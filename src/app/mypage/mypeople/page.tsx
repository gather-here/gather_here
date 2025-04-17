"use client";
import { useUserData } from "@/provider/user/UserDataProvider"; 
import { useLikeStore } from "@/stores/useLikeStore";
import MemberCard from "@/components/GatherHub/MemberCard";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { secureImageUrl } from "@/utils/imageUtils";


interface LikedMember {
  user_id: string;
  nickname: string | null;
  job_title: string | null;
  experience: string | null;
  description: string | null;
  background_image_url: string | null;
  profile_image_url: string | null;
  blog: string | null;
  answer1: string | null;
  answer2: string | null;
  answer3: string | null;
  first_link: string | null;
  first_link_type: string | null;
  second_link: string | null;
  second_link_type: string | null;
  tech_stacks?: string[] | null;
}


// MyPeoplePage 컴포넌트
const MyPeoplePage: React.FC = () => {
  const { userData } = useUserData(); // 사용자 데이터 가져오기
  const { likedMembers, syncLikesWithServer, toggleLike } = useLikeStore(); // 좋아요 상태와 동기화 함수, 토글 함수 가져오기
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태
  const [likedMemberData, setLikedMemberData] = useState<LikedMember[]>([]);

  useEffect(() => {
    // 좋아요한 멤버를 가져오는 함수
    const fetchLikedMembers = async () => {
      if (!userData?.user_id) {
        setLoading(false); // userData가 없으면 로딩 중지
        return;
      }
      setLoading(true); // 로딩 시작
      setError(null); // 이전 에러 초기화
  
      try {
        // 좋아요 상태 동기화
        await syncLikesWithServer(userData.user_id);
  
        // 좋아요한 멤버 ID 가져오기
        const { data: interestsData, error: interestsError } = await supabase
          .from("User_Interests")
          .select("liked_user_id")
          .eq("user_id", userData.user_id);
  
        if (interestsError) {
          console.error("좋아요한 멤버 ID를 불러오는 중 오류 발생:", interestsError.message);
          setError("좋아요한 멤버를 불러오는 중 오류가 발생했습니다.");
          setLoading(false); // 에러 발생 시 로딩 중지
          return;
        }
  
        if (!interestsData || interestsData.length === 0) {
          setLikedMemberData([]); // 관심 멤버가 없을 경우 빈 배열로 설정
          setLoading(false); // 로딩 중지
          return;
        }
  
        // 좋아요한 멤버 정보 가져오기
        const likedUserIds = interestsData.map((interest) => interest.liked_user_id);
        const { data: likedMembersData, error: membersError } = await supabase
          .from("Users")
          .select("*")
          .in("user_id", likedUserIds);
  
        if (membersError) {
          console.error("좋아요한 멤버 정보를 불러오는 중 오류 발생:", membersError.message);
          setError("멤버 정보를 불러오는 중 오류가 발생했습니다.");
        } else {
          setLikedMemberData((likedMembersData ?? []) as LikedMember[]); // 멤버 정보가 없으면 빈 배열로 설정
        }
      } catch (error) {
        console.error("데이터 불러오는 중 오류 발생:", error);
        setError("데이터 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false); // 로딩 완료
      }
    };
  
    void fetchLikedMembers();
  }, [userData]);

  return (
    <div className="my-people-page">
      <h1 className="text-xl font-bold mb-6">내 관심 멤버</h1>

      {loading ? (
        <p>로딩 중...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : likedMemberData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-28">
          {likedMemberData.map((member) => (
            <MemberCard
              key={member.user_id}
              user_id={member.user_id}
              nickname={member.nickname ?? ""}
              job_title={member.job_title ?? ""}
              experience={member.experience ?? ""}
              description={member.description ?? ""}
              background_image_url={member.background_image_url ?? ""}
              profile_image_url={secureImageUrl(member.profile_image_url ?? "")}
              blog={member.blog ?? ""}
              answer1={member.answer1 ?? ""}
              answer2={member.answer2 ?? ""}
              answer3={member.answer3 ?? ""}
              first_link={member.first_link ?? undefined}
              first_link_type={member.first_link_type ?? undefined}
              second_link={member.second_link ?? undefined}
              second_link_type={member.second_link_type ?? undefined}
              liked={!!likedMembers[member.user_id]}
              toggleLike={() => {
                if (userData?.user_id) {
                  void toggleLike(member.user_id, userData.user_id);
                }
              }}
              tech_stacks={member.tech_stacks ?? []}
            />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-center text-labelNeutral col-span-full">아직 좋아요한 멤버가 없어요! 다른 유저의 PR을 보고 좋아요를 눌러보세요.🧐 </p>
      )}
    </div>
  );
};

export default MyPeoplePage;