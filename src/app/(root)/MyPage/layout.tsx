import MyPageNav from "@/components/MyPage/LeftNav";

const MyPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full mx-auto max-w-container-l m:max-w-container-m s:max-w-container-s  mt-7">
      <MyPageNav />
      <main className="flex-1 p-4 overflow-y-auto h-screen">{children}</main>
    </div>
  );
};

export default MyPageLayout;
