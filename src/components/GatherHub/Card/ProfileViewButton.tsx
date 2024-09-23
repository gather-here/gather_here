import React from 'react';

interface ProfileViewButtonProps {
  onClick: () => void;
  ariaLabel?: string;
}

const ProfileViewButton: React.FC<ProfileViewButtonProps> = ({ onClick, ariaLabel = "프로필 보기" }) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="p-2 bg-primary text-black rounded-lg shadow hover:bg-primaryStrong transition-transform duration-200 ease-in-out transform hover:scale-105 cursor-pointer"
    >
      프로필 보기
    </button>
  );
};

export default ProfileViewButton;