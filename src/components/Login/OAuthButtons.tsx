import Image from "next/image";

interface OAuthButtonsProps {
  handleLogin: (provider: "google" | "kakao" | "github") => void;
}

const OAuthButtons: React.FC<OAuthButtonsProps> = ({ handleLogin }) => {
  return (
    <div className="flex flex-col justify-center items-center mb-8">
      <div className="w-full py-2 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95">
        <button onClick={() => handleLogin("google")} className="shared-button-google flex items-center space-x-4">
          <div className="w-[34.84px] h-[34.84px] rounded-full flex justify-center items-center">
            <Image src="/logos/google.svg" alt="Goggle Icon" width={24} height={24} />
          </div>
          <span className="font-semibold text-[#2B2B2B]">Google로 시작하기</span>
        </button>
      </div>
      <div className="w-full py-2 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95">
        <button onClick={() => handleLogin("kakao")} className="shared-button-kakao flex items-center space-x-4">
          <div className="w-[34.84px] h-[34.84px] rounded-full flex justify-center items-center">
            <Image src="/logos/kakao.svg" alt="Kakao Icon" width={44} height={44} />
          </div>
          <span className="font-semibold text-[#2B2B2B]">Kakao로 시작하기</span>
        </button>
      </div>
      <div className="w-full py-2 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95">
        <button onClick={() => handleLogin("github")} className="shared-button-github flex items-center space-x-4">
          <div className="w-[34.84px] h-[34.84px] rounded-full flex justify-center items-center">
            <Image src="/logos/github.svg" alt="Github Icon" width={44} height={44} />
          </div>
          <span className="font-semibold text-[#F7F7F7]">Github로 시작하기</span>
        </button>
      </div>
    </div>
  );
};

export default OAuthButtons;
