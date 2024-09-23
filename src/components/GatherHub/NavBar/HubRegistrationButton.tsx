import React from 'react';

interface HubRegistrationButtonProps {
  isHubRegistered: boolean;
  onClick: () => void;
}

const HubRegistrationButton: React.FC<HubRegistrationButtonProps> = ({ isHubRegistered, onClick }) => {
  return (
    <>
      {/* 모바일 화면용 */}
      <div className="lg:hidden relative group">
        <button
          className="mb-4 w-full bg-fillLight text-primary text-xl p-3 rounded-lg shadow-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out hover:bg-fillLighter hover:text-bright hover:brightness-125 cursor-pointer"
          onClick={onClick}
        >
          {isHubRegistered ? '프로필 수정' : '프로필 등록'}
        </button>
        <div className="absolute top-[-50px] left-1/2 transform -translate-x-1/2 w-[200px] px-3 py-2 bg-yellow-500 text-black text-sm text-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
          Hub멤버가 되기 위해 <br /> Hub에서 카드를 등록해주세요
          <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-500 rotate-45 rounded-sm shadow-lg"></div>
        </div>
      </div>

      {/* 큰 화면용 */}
      <div className="hidden lg:block relative group">
        <button
          className="mt-2 w-full bg-fillLight text-primary text-sm p-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out hover:bg-black hover:text-bright hover:brightness-125"
          onClick={onClick}
        >
          {isHubRegistered ? '프로필 수정' : '프로필 등록'}
        </button>
        <div className="absolute top-[120%] left-1/2 transform -translate-x-1/2 w-[200px] px-3 py-2 bg-yellow-500 text-black text-sm text-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
          Hub멤버가 되기 위해 <br /> 카드를 등록해주세요
        </div>
      </div>
    </>
  );
};

export default HubRegistrationButton;