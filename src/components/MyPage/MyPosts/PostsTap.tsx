"use client";

import React, { useState } from "react";

type Tab = "전체" | "스터디" | "프로젝트";

const PostsTap: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<Tab>("전체");

  const handleTabClick = (tab: Tab) => {
    setSelectedTab(tab);
  };

  return (
    <div className="relative">
      <div className="sticky z-10 bg-white border-b s:relative s:top-auto">
        <div className="flex space-x-4 sm:space-x-2">
          <button
            className={`px-4 py-2 s:px-2 sm:py-1 text-base sm:text-sm ${
              selectedTab === "전체" ? "font-bold border-b-2 border-black" : ""
            }`}
            onClick={() => handleTabClick("전체")}
          >
            전체
          </button>
          <button
            className={`px-4 py-2 s:px-2 sm:py-1 text-base sm:text-sm ${
              selectedTab === "스터디" ? "font-bold border-b-2 border-black" : ""
            }`}
            onClick={() => handleTabClick("스터디")}
          >
            스터디
          </button>
          <button
            className={`px-4 py-2 s:px-2 sm:py-1 text-base sm:text-sm ${
              selectedTab === "프로젝트" ? "font-bold border-b-2 border-black" : ""
            }`}
            onClick={() => handleTabClick("프로젝트")}
          >
            프로젝트
          </button>
        </div>
      </div>
      <div className="mt-4">
        {selectedTab === "전체" && <div>전체 영역 내용</div>}
        {selectedTab === "스터디" && <div>스터디 영역 내용</div>}
        {selectedTab === "프로젝트" && <div>프로젝트 영역 내용</div>}
      </div>
    </div>
  );
};

export default PostsTap;
