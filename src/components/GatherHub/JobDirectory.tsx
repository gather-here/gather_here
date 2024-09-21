"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic"; // 동적 컴포넌트 로딩
import { useRouter } from "next/navigation";
import { useUser } from "@/provider/UserContextProvider";
import { createPortal } from "react-dom";

// 동적 로딩 설정
const LoginForm = dynamic(() => import("../Login/LoginForm"), {
  ssr: false, // 서버 사이드 렌더링 비활성화
  loading: () => <div>Loading...</div>, // 로딩 중 표시
});

interface JobDirectoryProps {
  setFilteredJob: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}

const JobDirectory: React.FC<JobDirectoryProps> = ({ setFilteredJob, className }) => {
  const [selectedJob, setSelectedJob] = useState<string>("all");
  const router = useRouter();
  const { isAuthenticated, userData } = useUser();

  // Hub 등록 여부를 useMemo로 캐싱
  const isHubRegistered = useMemo(() => userData?.hubCard || false, [userData]);

  // 직업군 리스트 캐싱
  const jobCategories = useMemo(
    () => [
      { name: "전체 보기", value: "all", hoverClass: "hover:bg-primary hover:text-black text-black" },
      { name: "프론트엔드", value: "frontend", hoverClass: "hover:bg-primaryStrong hover:text-black" },
      { name: "백엔드", value: "backend", hoverClass: "hover:bg-accentOrange hover:text-black" },
      { name: "iOS", value: "ios", hoverClass: "hover:bg-accentMaya hover:text-black" },
      { name: "안드로이드", value: "android", hoverClass: "hover:bg-accentPurple hover:text-black" },
      { name: "데브옵스", value: "devops", hoverClass: "hover:bg-accentRed hover:text-black" },
      { name: "디자인", value: "design", hoverClass: "hover:bg-accentMint hover:text-black" },
      { name: "PM", value: "pm", hoverClass: "hover:bg-accentColumbia hover:text-black" },
      { name: "기획", value: "planning", hoverClass: "hover:bg-accentPink hover:text-black" },
      { name: "마케팅", value: "marketing", hoverClass: "hover:bg-accentYellow hover:text-black" },
    ],
    [],
  );

  // 로컬 스토리지 접근 최적화
  const storedJob = useMemo(() => localStorage.getItem("selectedJob") || "all", []);

  // 로컬 스토리지에서 직업군 상태 불러오기
  useEffect(() => {
    setSelectedJob(storedJob);
    setFilteredJob(storedJob);
  }, [storedJob, setFilteredJob]);

  // 직업군 선택 핸들러
  const handleSelectJob = useCallback(
    (jobValue: string) => {
      setSelectedJob(jobValue);
      setFilteredJob(jobValue);
      localStorage.setItem("selectedJob", jobValue);
    },
    [setFilteredJob],
  );

  // Hub 등록 카드 추가 버튼 핸들러
  const handleAddCard = useCallback(() => {
    if (!isAuthenticated) {
      setIsModalOpen(true);
    } else {
      router.push(isHubRegistered ? "/mypage/hubprofile" : "/mypage/hubprofile");
    }
  }, [isAuthenticated, isHubRegistered, router]);

  // 로그인 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCloseLoginModal = useCallback(() => setIsModalOpen(false), []);

  // 모달이 열렸을 때 Esc 키로 닫기
  useEffect(() => {
    if (isModalOpen) {
      const handleEsc = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          handleCloseLoginModal();
        }
      };
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  }, [isModalOpen, handleCloseLoginModal]);

  return (
    <aside className={`${className} p-4 rounded-lg sticky top-4 user-select-none`}>
      {/* 큰 화면에서는 리스트로 */}
      <ul className="hidden lg:block job-list rounded-2xl bg-fillStrong">
        {jobCategories.map((job, index) => (
          <li
            key={job.value}
            className={`job-item 
              ${selectedJob === job.value ? "bg-primary text-black font-bold" : ""} 
              ${job.hoverClass} text-center rounded-lg p-2 transition-all duration-300 
              ${index < jobCategories.length - 1}`}
            onClick={() => handleSelectJob(job.value)}
          >
            {job.name}
          </li>
        ))}
      </ul>

      {/* Hub 등록 버튼 (작은 화면용) */}
      <div className="lg:hidden relative group">
        <button
          className="mb-4 w-full bg-fillLight text-primary text-xl p-3 rounded-lg shadow-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out hover:bg-fillLighter hover:text-bright hover:brightness-125 cursor-pointer"
          onClick={handleAddCard}
        >
          {isHubRegistered ? "프로필 수정" : "프로필 등록"}
        </button>
        {/* 말풍선 */}
        <div className="absolute top-[-50px] left-1/2 transform -translate-x-1/2 w-[200px] px-3 py-2 bg-yellow-500 text-black text-sm text-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
          Hub멤버가 되기 위해 <br /> Hub에서 카드를 등록해주세요
          <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-500 rotate-45 rounded-sm shadow-lg"></div>
        </div>
      </div>

      {/* 작은 화면에서는 셀렉트 박스로 */}
      <div className="block lg:hidden">
        <select
          className="p-2 text-xl bg-black text-white rounded-lg w-full border border-gray-500 transition-all duration-300 ease-in-out focus:border-blue-500 focus:bg-gray-800 hover:bg-gray-900"
          value={selectedJob}
          onChange={(e) => handleSelectJob(e.target.value)}
        >
          {jobCategories.map((job) => (
            <option key={job.value} value={job.value}>
              {job.name}
            </option>
          ))}
        </select>
      </div>

      {/* Hub 등록 버튼 (큰 화면용) */}
      <div className="hidden lg:block relative group">
        <button
          className="mt-3 w-full bg-fillLight text-primary text-sm p-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out hover:bg-fillLighter hover:text-bright hover:brightness-125"
          onClick={handleAddCard}
        >
          {isHubRegistered ? "프로필 수정" : "프로필 등록"}
        </button>
        {/* 말풍선 */}
        <div className="absolute top-[-60px] left-1/2 transform -translate-x-1/2 w-[200px] px-3 py-2 bg-yellow-500 text-black text-sm text-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
          Hub멤버가 되기 위해 <br /> 카드를 등록해주세요
          <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-500 rotate-45 rounded-sm shadow-lg"></div>
        </div>
      </div>

      {/* 로그인 모달 */}
      {isModalOpen &&
        createPortal(
          <>
            <div className="fixed inset-0 bg-black opacity-80 z-40" onClick={handleCloseLoginModal}></div>
            <div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background rounded-[20px] p-4 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseLoginModal}
                className="ml-auto mt-1 mr-1 block text-right p-1 text-3xl text-[fontWhite] hover:text-[#777]"
              >
                &times;
              </button>
              <LoginForm />
            </div>
          </>,
          document.body,
        )}
    </aside>
  );
};

export default JobDirectory;
