"use client";
import React, { useState, useMemo } from "react";
import { useLikeStore } from "@/stores/useLikeStore";
import { useUserData } from "@/provider/user/UserDataProvider";
import CardUI from "./CardUI"; 
import CardModal from "./CardModal";
import ProfileExtend from "./ProfileExtend"; 
import { MemberCardProps } from "@/lib/gatherHub";
import { techStacks } from "@/lib/techStacks";
import { secureImageUrl } from "@/utils/imageUtils";


const MemberCard: React.FC<MemberCardProps> = ({
  user_id,
  nickname,
  job_title,
  experience,
  description,
  background_image_url,
  profile_image_url,
  blog,
  answer1,
  answer2,
  answer3,
  first_link_type,
  first_link,
  second_link_type,
  second_link,
  tech_stacks,
}) => {

  // 모달 상태 관리 (카드 모달 & 프로필 확장 모달)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // 좋아요 상태 관리
  const { likedMembers, toggleLike } = useLikeStore();

  // 현재 로그인한 사용자 정보 가져오기
  const { userData } = useUserData();
  const currentUserId = userData?.user_id;

  // 현재 카드가 좋아요 상태인지 확인
  const liked = likedMembers[user_id] || false;

  // 좋아요 버튼 클릭 시 실행되는 함수
  const handleToggleLike = () => {
    if (!currentUserId) {
      alert("로그인이 필요합니다.");
      return;
    }
    
    void toggleLike(user_id, currentUserId);
  };

  // 기술 스택 필터링 (사용자가 선택한 기술 스택과 전체 스택 비교)
  const selectedTechStacks = useMemo(() => {
    if (!tech_stacks) return [];
    return techStacks.filter((stack) => tech_stacks.includes(stack.id));
  }, [tech_stacks]);

  return (
    <>
      {/* 카드 UI */}
      <CardUI
        nickname={nickname}
        job_title={job_title}
        experience={experience}
        description={description}
        background_image_url={background_image_url}
        profile_image_url={profile_image_url}
        blog={blog}
        first_link_type={first_link_type}
        first_link={first_link}
        second_link_type={second_link_type}
        second_link={second_link}
        liked={liked}
        handleToggleLike={handleToggleLike}
        secureImageUrl={secureImageUrl}
        onOpenModal={() => setIsModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* 상세 모달 */}
      <CardModal
        isModalOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        nickname={nickname}
        job_title={job_title}
        experience={experience}
        description={description}
        profile_image_url={profile_image_url}
        background_image_url={background_image_url}
        blog={blog}
        liked={liked}
        answer1={answer1}
        answer2={answer2}
        answer3={answer3}
        first_link_type={first_link_type}
        first_link={first_link}
        second_link_type={second_link_type}
        second_link={second_link}
        handleToggleLike={handleToggleLike}
        secureImageUrl={secureImageUrl}
        selectedTechStacks={selectedTechStacks}
      />

      {/* 프로필 확대 모달 */}
      <ProfileExtend
        isOpen={isProfileModalOpen}
        closeModal={() => setIsProfileModalOpen(false)}
        profileImageUrl={profile_image_url}
        nickname={nickname}
        secureImageUrl={secureImageUrl}
      />
    </>
  );
};

export default MemberCard;