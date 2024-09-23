import React, { useState } from 'react';

interface ChatButtonProps {
  nickname: string;
  isModal?: boolean;
}

const ChatButton: React.FC<ChatButtonProps> = ({ nickname, isModal = false }) => {
  const chatIconSrc = '/assets/chat-icon.svg'; // 이미지 경로
  const [isImageError, setIsImageError] = useState(false); // 이미지 로드 실패 여부

  return (
    <button
      className={`p-2 rounded-3xl bg-gray-700 shadow-lg hover:bg-gray-500 
      transition-transform duration-200 ease-in-out transform hover:scale-110 z-10
       ${isModal ? 'justify-center mt-4' : 'absolute top-2 right-2'}`}
    >
      <span className="flex items-center space-x-2">
        {!isImageError ? (
          <img 
            src={chatIconSrc} 
            alt="채팅" 
            className="w-5 h-5" 
            onError={() => setIsImageError(true)} // 이미지 로드 실패 시 상태 변경
          />
        ) : (
          <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
            💬 {/* 이미지 로드 실패 시 표시할 이모지 */}
          </div>
        )}
        {isModal && <span>1:1채팅</span>}
      </span>
    </button>
  );
};

export default ChatButton;