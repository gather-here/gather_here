"use client";

import MemberCard from "@/components/GatherHub/MemberCard";
import { useLikeStore } from "@/stores/useLikeStore";
import { secureImageUrl } from "@/utils/imageUtils";
import { useState, useEffect, useMemo } from "react";
import type { UserData } from "@/types/userData";
import Pagination from "@/components/MyPage/Common/Pagination"; 

type LikedMember = Omit<UserData, "hubCard">;

// 로그인한 사용자 ID와 좋아요한 멤버 리스트
interface Props {
  userId: string;
  likedMembers: LikedMember[];
}

const LikePeopleClient = ({ userId, likedMembers }: Props) => {
  const { likedMembers: likedMap, syncLikesWithServer, toggleLike } = useLikeStore();

  // 페이지네이션 관련 상태
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 6;

  // 좋아요 상태 기반으로 화면에 보여줄 멤버만 필터링
  const visibleMembers = useMemo(() => {
    return likedMembers.filter((member) => likedMap[member.user_id]);
  }, [likedMembers, likedMap]);

  const totalPages = useMemo(() => Math.ceil(visibleMembers.length / membersPerPage), [visibleMembers]);


  // 현재 페이지 멤버 슬라이싱
  const currentMembers = useMemo(() => {
    const start = (currentPage - 1) * membersPerPage;
    return visibleMembers.slice(start, start + membersPerPage);
  }, [visibleMembers, currentPage]);

  // 컴포넌트 마운트 시 좋아요 상태를 서버에서 불러와 zustand에 동기화
  useEffect(() => {
    void syncLikesWithServer(userId);
  }, [userId]);

  return (
    <div className="my-people-page">
      <h1 className="text-xl font-bold mb-6">내 관심 멤버</h1>
  
      {currentMembers.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-28">
            {currentMembers.map((member) => (
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
                liked={!!likedMap[member.user_id]}
                toggleLike={() => void toggleLike(member.user_id, userId)}
                tech_stacks={member.tech_stacks ?? []}
              />
            ))}
          </div>

          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </>
      ) : (
        <p className="mt-8 text-center text-labelNeutral col-span-full">
          관심 멤버가 없습니다🧐
        </p>
      )}
    </div>
  );
};

export default LikePeopleClient;