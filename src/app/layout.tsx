import localFont from 'next/font/local';
import './globals.css';
import CombinedProviders from '@/provider/CombinedProviders';
import Header from '@/components/Common/Header/Header';
import 'react-toastify/dist/ReactToastify.css';
import type { Metadata } from 'next';
import { Suspense } from 'react';

const pretendard = localFont({
  src: [
    {
      path: '../fonts/PretendardVariable.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/PretendardVariable.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/PretendardVariable.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../fonts/PretendardVariable.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-pretendard',
});

export const metadata: Metadata = {
  title: '@gather_here',
  description: '  9개의 IT 직군 종사자들과 IT 직군 취업을 목표로 하는 준비생들을 연결해주는 반응형 플랫폼입니다.',
  keywords: '개발, 스터디, 사이드, 프로젝트, 디자인, 기획, 취업, IT, 행사, 이력서 , PR',
  authors: [
    { name: '김영범' },
    { name: '조은영' },
    { name: '전정현' },
    { name: '이하름' },
    { name: '김성준' },
    { name: '이보아' },
  ],
  icons: {
    icon: '/Favicon/favicon.png',
  },
  openGraph: {
    title: '@gather_here',
    description: ' 9개의 IT 직군 종사자들과 IT 직군 취업을 목표로 하는 준비생들을 연결해주는 반응형 플랫폼입니다.',
    url: 'https://gather-here-cyan.vercel.app',
    type: 'website',
    images: [
      {
        url: 'https://yrmjrxuealdugqizqtjg.supabase.co/storage/v1/object/public/images/og/og_image.png',
        width: 516,
        height: 504,
        alt: '9개의 직군이 퍼즐 조각처럼 모여 서로 필요한 부분을 채워주는 gather_here.',
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
          <Suspense>
            <Header />
          </Suspense>
          {children}
        </CombinedProviders>
      </body>
    </html>
  );
}
