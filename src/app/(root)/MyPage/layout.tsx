import React from "react";
import MyPageNav from "@/components/MyPage/LeftNav";

const MyPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col md:flex-row w-full mx-auto max-w-container-l m:max-w-container-m s:max-w-container-s gap-4 mt-8 mb-8">
      <MyPageNav />
      <main className="flex-1 overflow-y-auto h-screen">{children}</main>
    </div>
  );
};

export default MyPageLayout;
