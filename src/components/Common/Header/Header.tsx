"use client";

import React, { useState } from "react";
import Link from "next/link";

const Header: React.FC = () => {
  /* 로그인 기능 개발 전 테스트용
    false 일때 : 로그인 
    true 일때 : 프로필, 로그아웃 
  */
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header className="bg-[#1A1B1E] shadow-md">
      <div className="w-full mx-auto max-w-container-l m:max-w-container-m s:max-w-container-s flex justify-between items-center pt-4 pb-4 text-white">
        <Link href="/">
          <h1 className="text-lg font-bold">@gather_here</h1>
        </Link>
        <nav className="flex items-center space-x-4">
          <form className="flex s:hidden items-center border rounded border-white overflow-hidden">
            <label htmlFor="search" className="sr-only">
              검색창
            </label>
            <input
              type="text"
              id="search"
              name="search"
              placeholder="검색어를 입력해 주세요."
              className="px-2 py-1 bg-[#1A1B1E] text-white outline-none"
            />
            <button type="submit" className="px-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17.65 10.65a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>
          {isLoggedIn ? (
            <div className="flex items-center space-x-2">
              <Link href="/mypage">프로필</Link>
              <button onClick={() => setIsLoggedIn(false)} className="text-white">
                로그아웃
              </button>
            </div>
          ) : (
            <Link href="/login">로그인</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
