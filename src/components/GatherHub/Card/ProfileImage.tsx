import React, { useState } from 'react';
import { createPortal } from 'react-dom';

interface ProfileImageProps {
  profileImageUrl: string;
  nickname: string;
  isModal?: boolean; 
}

const ProfileImage: React.FC<ProfileImageProps> = ({ profileImageUrl, nickname, isModal = false }) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <>
      {/* 프로필 이미지 (작거나 모달에서 크게 보여주는 경우) */}
      <div 
        className={`${isModal ? 'w-36 h-36 rounded-full p-14' : 'w-16 h-16 p-6 rounded-full'} 
        bg-white border-4 border-fillStrong absolute ${isModal ? 'bottom-[360px]' : 'bottom-[190px]'} 
        ${isModal ? 'left-1/2 transform -translate-x-1/2' : 'left-4'} 
        overflow-hidden cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110`}
        onClick={() => setIsProfileModalOpen(true)} // 이미지 클릭 시 확대 모달 열림
      >
        <img src={profileImageUrl} alt={nickname} className="w-full h-full object-cover" /> {/* 프로필 이미지 */}
      </div>

      {/* 프로필 이미지 클릭 시 나타나는 확대 모달 */}
      {isProfileModalOpen && createPortal(
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[9999]" // 모달 배경과 위치
          onClick={() => setIsProfileModalOpen(false)} // 모달 배경 클릭 시 닫기
        >
          <div className="relative">
            {/* 모달 안에서 프로필 이미지를 크게 보여줌 */}
            <img
              src={profileImageUrl}
              alt={nickname}
              className="s:w-[340px] w-[500px] s:h-[340px] h-[500px] object-cover rounded-full shadow-lg border-4 border-white"
            />
            {/* 모달 닫기 버튼 */}
            <button
              className="absolute top-2 right-2 text-gray-400 text-2xl font-bold rounded-full p-2 hover:text-white hover:scale-110 transition-transform duration-200 ease-in-out shadow-lg"
              onClick={() => setIsProfileModalOpen(false)} // 닫기 버튼 클릭 시 모달 닫기
            >
              &times; {/* 닫기 버튼으로 "X" 아이콘 */}
            </button>
          </div>
        </div>,
        document.body // 모달을 document.body에 포탈로 삽입
      )}
    </>
  );
};

export default ProfileImage;