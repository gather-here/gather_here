"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useAuth } from "@/provider/user/UserAuthProvider";
import { useUserData } from "@/provider/user/UserDataProvider";
import Toast from "@/components/Common/Toast/Toast";

interface HubProfileToggleProps {
  initialIsActive: boolean;
  description: string;
  blog: string;
  firstLinkType: string;
  firstLink: string;
  secondLinkType: string;
  secondLink: string;
  answer1: string;
  answer2: string;
  answer3: string;
  techStacks: string[];
}

const HubProfileToggle: React.FC<HubProfileToggleProps> = ({
  initialIsActive,
  description,
  blog,
  firstLinkType,
  firstLink,
  secondLinkType,
  secondLink,
  answer1,
  answer2,
  answer3,
  techStacks,
}) => {
    const { user } = useAuth(); // 인증된 사용자 정보
    const { fetchUserData } = useUserData(); // 사용자 정보 갱신 함수
    const [isHubCardActive, setIsHubCardActive] = useState(initialIsActive); // 현재 허브카드 등록 여부 상태
    const [isLoading, setIsLoading] = useState(false); // 서버 요청 중 로딩 상태

    // 토스트 메시지 상태
    const [toast, setToast] = useState<{ state: "success" | "error" | ""; message: string }>({
      state: "",
      message: "",
    });
  
    // 토스트 메시지 출력 함수
    const showToast = (state: "success" | "error", message: string) => {
      setToast({ state, message });
    };
  
    // Supabase에 사용자 프로필 업데이트 요청
    const updateUserProfile = async (active: boolean) => {
      if (!user?.id) {
        return { error: new Error("유저 ID가 없습니다."), data: null };
      }
  
      return await supabase
        .from("Users")
        .update({
          hubCard: active,
          description,
          blog,
          first_link_type: firstLinkType,
          first_link: firstLink,
          second_link_type: secondLinkType,
          second_link: secondLink,
          answer1,
          answer2,
          answer3,
          tech_stacks: techStacks,
        })
        .eq("user_id", user.id);
    };
  
    // 등록 여부 토글 핸들러
    const handleToggleHubCard = async () => {
      if (!user || isLoading) return;
  
      // 등록을 시도하는데 포트폴리오 링크가 없을 경우 에러 처리
      if (!isHubCardActive && !blog) {
        showToast("error", "포트폴리오 링크를 작성해주세요!");
        return;
      }
  
      setIsLoading(true);
  
      const nextState = !isHubCardActive;
      const { error } = await updateUserProfile(nextState);
  
      if (error) {
        showToast("error", `저장에 실패했습니다: ${error.message}`);
      } else {
        setIsHubCardActive(nextState);
        showToast("success", nextState ? "프로필이 등록되었습니다." : "프로필이 삭제되었습니다.");
  
        // 사용자 상태 최신화
        void fetchUserData(user.id);
  
        // 변경 사항 적용을 위해 새로고침
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
  
      setIsLoading(false);
    };
  
    return (
      <div className="mt-6 mb-12 flex flex-col items-center gap-3">
        <span className="text-sm text-white font-medium">
          {isHubCardActive ? "프로필이 등록된 상태입니다." : "프로필이 비공개 상태입니다."}
        </span>
  
        {/* 허브카드 등록/비공개 토글 스위치 */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isHubCardActive}
            onChange={() => void handleToggleHubCard()}
            disabled={isLoading}
          />
          <div
            className={`w-14 h-8 bg-gray-300 rounded-full peer
              peer-checked:bg-green-500 transition-all duration-300
              after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white
              after:rounded-full after:h-6 after:w-6 after:transition-all
              peer-checked:after:translate-x-6
              ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          ></div>
        </label>
  
        {/* 토스트 메시지 표시 영역 */}
        {toast.state && (
          <Toast
            state={toast.state}
            message={toast.message}
            onClear={() => setToast({ state: "", message: "" })}
          />
        )}
      </div>
    );
  };
  
  export default HubProfileToggle;