import React from 'react';

interface MemberInfoProps {
  nickname: string;
  jobTitle: string;
  experience: string;
  description: string;
  isModal?: boolean;
  onOpenProfileModal?: () => void;
}

const MemberInfo: React.FC<MemberInfoProps> = ({ 
  nickname, 
  jobTitle, 
  experience, 
  description, 
  isModal = false, 
  onOpenProfileModal
}) => {

  // 클릭 핸들러: isModal이 false일 때만 모달을 열도록 처리
  const handleClick = () => {
    if (!isModal && onOpenProfileModal) {
      onOpenProfileModal();
    }
  };

  return (
    <div className={`${isModal ? 'text-center p-1' : 'p-3'}`}>
      <h3 className={`${isModal ? 'mt-10 text-2xl' : 'text-xl'} font-bold text-fontWhite`}>{nickname}</h3>
      <p className={`${isModal ? 'text-lg' : 'text-base'} text-primary`}>{jobTitle} | {experience}</p>
      <p className={`mt-1 ${isModal ? 'text-white' : 'text-m text-fontGray line-clamp-1 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 '}`}
         onClick={handleClick}
      >
        {description}
      </p>
    </div>
  );
};

export default MemberInfo;