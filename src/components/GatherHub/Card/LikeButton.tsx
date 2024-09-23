import React from 'react';
import { useUser } from '@/provider/UserContextProvider';

// LikeButtonProps: LikeButton 컴포넌트에 전달될 props를 정의하는 인터페이스
interface LikeButtonProps {
  nickname: string;
  isModal?: boolean;
}

// LikeButton: 좋아요 버튼을 렌더링하는 컴포넌트
const LikeButton: React.FC<LikeButtonProps> = ({ nickname, isModal = false }) => {
  const { likedMembers, toggleLike } = useUser();   // 좋아요 상태와 토글 함수
  const liked = likedMembers[nickname] || false;   // 좋아요 여부 확인

  return (
    <button
      onClick={() => toggleLike(nickname)}
      className={`p-2 rounded-3xl bg-gray-700 shadow-lg hover:bg-gray-500 transition-transform flex items-center 
        duration-200 ease-in-out transform hover:scale-110 space-x-2 z-10
      ${isModal ? 'justify-center mt-4' : 'absolute top-2 left-2'}`}
    >
      {liked ? (
        <img src="/assets/liked-icon.svg" alt="좋아요" className="w-5 h-5" />
      ) : (
        <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
          💖
        </div>
      )}
      {isModal && <span>좋아요</span>}
    </button>
  );
};

export default LikeButton;