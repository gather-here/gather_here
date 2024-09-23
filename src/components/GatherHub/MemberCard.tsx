//MemberCard

"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import LikeButton from './Card/LikeButton';
import ChatButton from './Card/ChatButton';
import BackgroundImage from './Card/BackgroundImage';
import ProfileImage from './Card/ProfileImage';
import ProfileViewButton from './Card/ProfileViewButton';
import MemberInfo from './Card/MemberInfo';
import PortfolioLinks from './Card/PortfolioLinks';
import QnASection from './Card/QnASection';

// 서브 컴포넌트 불러오기
interface MemberCardProps {
  nickname: string;
  jobTitle: string;
  experience: string;
  description: string;
  backgroundImageUrl: string;
  profileImageUrl: string;
  blog: string; // 대표 포트폴리오
  answer1: string; 
  answer2: string; 
  answer3: string; 
  notionLink: string;
  instagramLink: string;
  liked: boolean;
  toggleLike: (nickname: string) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({
  nickname,
  jobTitle,
  experience,
  description,
  backgroundImageUrl,
  profileImageUrl,
  blog,
  answer1,
  answer2,
  answer3,
  notionLink,
  instagramLink,
}) => {
  
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); 
  
  // 모달 열기/닫기 핸들러
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // ESC 키로 모달 닫기 기능
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener("keydown", handleEsc);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

  return (
    <>
      <div className="member-card bg-fillStrong rounded-[20px] shadow-lg relative w-[300px] h-[460px] flex flex-col justify-between z-30 user-select-none">
        
        {/* 좌상단 좋아요 버튼 */}
        <LikeButton nickname={nickname} isModal={false} />
        {/* 우상단 1:1 채팅 버튼 */}
        <ChatButton nickname={nickname} isModal={false} />
        {/* 상단 포트폴리오 대표 이미지 */}
        <BackgroundImage backgroundImageUrl={backgroundImageUrl} blog={blog} isModal={false} />
        {/* 프로필 이미지 */}
        <ProfileImage profileImageUrl={profileImageUrl} nickname={nickname} isModal={false} />
        {/* 프로필 보기 버튼 */}
        <div className="absolute bottom-[190px] p-2 right-4">
          <ProfileViewButton onClick={openModal} />
        </div>
        {/* 하단 멤버 정보 */}
        <MemberInfo 
          nickname={nickname} 
          jobTitle={jobTitle} 
          experience={experience} 
          description={description} 
          isModal={false} 
          onOpenProfileModal={openModal}
        />
        {/* 포트폴리오 링크 */}
        <PortfolioLinks blog={blog} notionLink={notionLink} instagramLink={instagramLink} isModal={false} />
      </div>
        {/* 프로필 이미지 확대 모달 */}
        {isProfileModalOpen && createPortal(
          <ProfileImage profileImageUrl={profileImageUrl} nickname={nickname} isModal={true} />,
          document.body
        )}

        {/* 프로필 보기 모달 */}
        {isModalOpen && createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out user-select-none" onClick={closeModal}>
            <div className="bg-background rounded-3xl shadow-lg s:w-[400px] s:h-[600px] w-[550px] h-[700px] overflow-y-auto transform transition-transform duration-300 ease-in-out scale-95 opacity-0" style={{ opacity: isModalOpen ? 1 : 0, transform: isModalOpen ? "scale(1)" : "scale(0.95)" }} onClick={(e) => e.stopPropagation()}>
              <button className="absolute top-2 right-2 text-black text-3xl font-bold rounded-full p-4 hover:text-white hover:scale-110 transition-transform duration-200 ease-in-out z-50" onClick={closeModal}>
                &times;
              </button>
              {/* 상단 배경 이미지 */}
              <BackgroundImage backgroundImageUrl={backgroundImageUrl} blog={blog} isModal={true} />
              {/* 프로필 정보 */}
              <ProfileImage profileImageUrl={profileImageUrl} nickname={nickname} isModal={true} />
              {/* 멤버 정보 */}
                <MemberInfo nickname={nickname} jobTitle={jobTitle} experience={experience} description={description} isModal={true} />
              {/* 좋아요와 메시지 보내기 버튼을 중앙에 배치 */}
              <div className="flex justify-center space-x-4 mt-1">
                <LikeButton nickname={nickname} isModal={true} />
                <ChatButton nickname={nickname} isModal={true} />
              </div>
              {/* 포트폴리오 링크 */}
                <PortfolioLinks blog={blog} notionLink={notionLink} instagramLink={instagramLink} isModal={true} />
              {/* 질문과 답변 섹션 */}
                <QnASection answer1={answer1} answer2={answer2} answer3={answer3} />
              {/* 하단 확인 버튼 */}
              <div className="mt-8 flex justify-center space-x-4 p-6"> {/* 여백을 일정하게 맞추기 위해 margin-top 설정 */}
                <button className="bg-primary text-black py-2 px-4 rounded-lg hover:bg-primary transition" onClick={closeModal}>
                  확인
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default MemberCard;