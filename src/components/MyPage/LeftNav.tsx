"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LeftNav = () => {
  const pathname = usePathname();

  return (
    <aside className="sticky s:relative top-0 p-7 s:p-0 max-h-[260px] flex flex-col items-start gap-3 rounded-[20px] border border-[#E6E6E6] s:border-none bg-white shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex justify-center items-center">사진</div>
        <ol>
          <li className="font-bold">user</li>
          <li className="text-sm text-gray-500">user@gmail.com</li>
        </ol>
      </div>
      <nav>
        <ul className="w-full">
          <li className="mb-3">
            <Link href="/mypage" className={`block w-full ${pathname === "/mypage" ? "font-bold" : ""}`}>
              내 정보 수정
            </Link>
          </li>
          <li className="mb-3">
            <Link
              href="/mypage/myinterests"
              className={`block w-full  ${pathname === "/mypage/myinterests" ? "font-bold" : ""}`}
            >
              내 관심글
            </Link>
          </li>
          <li className="mb-3">
            <Link
              href="/mypage/myposts"
              className={`block w-full ${pathname === "/mypage/myposts" ? "font-bold" : ""}`}
            >
              내 작성글
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default LeftNav;
