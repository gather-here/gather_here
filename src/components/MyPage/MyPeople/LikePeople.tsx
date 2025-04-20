import { createServerSupabaseClient } from "@/utils/supabase/server";
import LikePeopleClient from "@/components/MyPage/MyPeople/LikePeopleClient";
import type { UserData } from "@/types/userData";

const LikePeople = async () => {
  const supabase = createServerSupabaseClient();

  // Supabase 세션 가져오기
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 세션이 없으면 로그인 필요 메시지 표시
  if (!session?.user?.id) {
    return <div>로그인이 필요합니다.</div>;
  }

  // User_Interests 테이블에서 내가 좋아요한 유저 ID 리스트 가져오기
  const { data: interestsData, error: interestsError } = await supabase
  .from("User_Interests")
  .select("liked_user_id")
  .eq("user_id", session.user.id);

  // 오류가 있으면 메시지 표시
  if (interestsError) {
    console.error("좋아요 데이터 조회 오류:", interestsError.message);
    return <div className="text-center mt-8 text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>;
  }

  // 관심 멤버가 하나도 없다면 해당 메시지 반환
  if (!interestsData || interestsData.length === 0) {
    return <div className="mt-8 text-center text-labelNeutral col-span-full">아직 좋아요한 멤버가 없습니다.🫠</div>;
  }

  const likedUserIds = interestsData.map((item) => item.liked_user_id); // liked_user_id 배열 생성

  // Users 테이블에서 해당 유저들의 상세 정보 조회
  const { data: likedMembersData } = await supabase
    .from("Users")
    .select(
      "user_id, nickname, job_title, experience, description, profile_image_url, blog, background_image_url, answer1, answer2, answer3, first_link_type, first_link, second_link_type, second_link, tech_stacks"
    )
    .in("user_id", likedUserIds);

  return (
    <LikePeopleClient
      userId={session.user.id}
      likedMembers={(likedMembersData ?? []) as Omit<UserData, "hubCard">[]}
    />
  );
};

export default LikePeople;