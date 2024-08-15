import localFont from "next/font/local";
import "./globals.css";
import CombinedProviders from "@/provider/CombinedProviders";
import Header from "@/components/Common/Header/Header";
import type { Metadata } from "next";

const pretendard = localFont({
  src: [
    {
      path: "../../fonts/PretendardVariable.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/PretendardVariable.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../fonts/PretendardVariable.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../fonts/PretendardVariable.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "@gather_here",
  description: "스터디나 사이드 프로젝트 팀원을 오픈 채팅으로 빠르고 쉽게 찾을 수 있는 gather_here.",
  keywords: ["개발", "스터디", "사이드", "프로젝트", "디자인", "기획", "취업"],
  authors: [
    { name: "김영범" },
    { name: "조은영" },
    { name: "전정현" },
    { name: "이하름" },
    { name: "김성준" },
    { name: "이보아" },
  ],
  icons: {
    icon: "/Favicon/favicon.png",
  },
  openGraph: {
    title: "@gather_here",
    description: "스터디나 사이드 프로젝트 팀원을 오픈 채팅으로 빠르고 쉽게 찾을 수 있는 gather_here.",
    url: "https://gather-here-cyan.vercel.app",
    type: "website",
    images: [
      {
        url: "https://yrmjrxuealdugqizqtjg.supabase.co/storage/v1/object/public/images/og/og_image.png",
        width: 516,
        height: 504,
        alt: "9개의 직군이 퍼즐 조각처럼 모여 서로 필요한 부분을 채워주는 gather_here.",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={pretendard.className}>
      <body className="bg-background text-fontWhite">
        <CombinedProviders>
          <Header />
          {children}
        </CombinedProviders>
      </body>
    </html>
  );
}
