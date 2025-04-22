import React, { useState } from "react";
import Toast from "@/components/Common/Toast/Toast";

const ShareButton: React.FC = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [toast, setToast] = useState<{
        state: "success" | "error" | "warn" | "info" | "custom";
        message: string;
      } | null>(null);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setToast({ state: "success", message: "URL 복사 완료하였습니다!" });
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 1000);
      })
      .catch(() => {
        setToast({ state: "error", message: "URL 복사에 실패했습니다." });
      });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleShare}
        className={`flex items-center mr-2 ${isClicked ? "clicked" : ""}`}
        style={{
          width: "20px",
          height: "20px",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12.0005 16C11.3338 16 10.7672 15.7667 10.3005 15.3C9.83382 14.8333 9.60049 14.2667 9.60049 13.6C9.60049 13.5067 9.60715 13.4099 9.62049 13.3096C9.63382 13.2093 9.65382 13.1195 9.68049 13.04L4.04049 9.76C3.81382 9.96 3.56049 10.1168 3.28049 10.2304C3.00049 10.344 2.70715 10.4005 2.40049 10.4C1.73382 10.4 1.16715 10.1667 0.700488 9.7C0.233822 9.23333 0.000488281 8.66667 0.000488281 8C0.000488281 7.33333 0.233822 6.76667 0.700488 6.3C1.16715 5.83333 1.73382 5.6 2.40049 5.6C2.70715 5.6 3.00049 5.6568 3.28049 5.7704C3.56049 5.884 3.81382 6.04053 4.04049 6.24L9.68049 2.96C9.65382 2.88 9.63382 2.79013 9.62049 2.6904C9.60715 2.59067 9.60049 2.49387 9.60049 2.4C9.60049 1.73333 9.83382 1.16667 10.3005 0.7C10.7672 0.233333 11.3338 0 12.0005 0C12.6672 0 13.2338 0.233333 13.7005 0.7C14.1672 1.16667 14.4005 1.73333 14.4005 2.4C14.4005 3.06667 14.1672 3.63333 13.7005 4.1C13.2338 4.56667 12.6672 4.8 12.0005 4.8C11.6938 4.8 11.4005 4.74347 11.1205 4.6304C10.8405 4.51733 10.5872 4.36053 10.3605 4.16L4.72049 7.44C4.74715 7.52 4.76716 7.61013 4.78049 7.7104C4.79382 7.81067 4.80049 7.9072 4.80049 8C4.80049 8.0928 4.79382 8.1896 4.78049 8.2904C4.76716 8.3912 4.74715 8.48107 4.72049 8.56L10.3605 11.84C10.5872 11.64 10.8405 11.4835 11.1205 11.3704C11.4005 11.2573 11.6938 11.2005 12.0005 11.2C12.6672 11.2 13.2338 11.4333 13.7005 11.9C14.1672 12.3667 14.4005 12.9333 14.4005 13.6C14.4005 14.2667 14.1672 14.8333 13.7005 15.3C13.2338 15.7667 12.6672 16 12.0005 16Z"
            fill={isClicked ? "#C3E88D" : "#5E5E5E"}
          />
        </svg>
      </button>
      {toast && (
        <Toast
          state={toast.state}
          message={toast.message}
          onClear={() => setToast(null)}
        />
      )}
    </>
  );
};

export default ShareButton;
