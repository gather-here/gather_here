'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/provider/user/UserAuthProvider';
import { useUserData } from '@/provider/user/UserDataProvider';
import { supabase } from '@/utils/supabase/client';
import SearchBar from '@/components/Search/SearchBar';
import { SearchModalRef } from '@/types/refs/SearchModal';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const { user, resetAuthUser } = useAuth();
  const { userData } = useUserData();
  const [isMypageModalOpen, setIsMypageModalOpen] = useState(false);
  const modalRef = useRef<SearchModalRef>(null);
  const router = useRouter();


  // 로그아웃 함수
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
    } catch (err) {
      // 'err'를 명시적으로 Error로 캐스팅
      if (err instanceof Error) {
        console.error('로그아웃 중 오류:', err.message);
      } else {
        console.error('알 수 없는 오류 발생:', err);
      }
    } finally {
      void resetAuthUser(); // 사용자 상태 초기화
      router.push('/');
    }
  };

  // 마이페이지 모달 열기/닫기
  const mypageModalRef = useRef(false);

  const toggleMypageModal = () => {
    mypageModalRef.current = !mypageModalRef.current;
    setIsMypageModalOpen(mypageModalRef.current);
  };

  // 모달 창 크기에 따라 닫기
  const closeModalOnRouteChange = () => {
    if (window.innerWidth <= 768 && isMypageModalOpen) {
      setIsMypageModalOpen(false);
    }
  };

  return (
    <header className="bg-background shadow-md relative text-fontWhite">
      <div className="w-full mx-auto max-w-container-l m:max-w-container-m s:max-w-container-s s:flex-row flex justify-between items-center py-[14px] s:py-2">
        <div className="flex items-center s:space-x-6 space-x-12">
          <Link href="/" className="flex items-center logo-link">
            <Image
              src="/logos/gatherhere.svg"
              alt="@gather_here 로고"
              width={140}
              height={70}
              priority
              quality={85}
              className="s:hidden"
              style={{ objectFit: 'contain' }}
            />

            <Image
              src="/assets/header/mobile_logo.svg"
              alt="@gather_here 모바일 로고"
              width={30}
              height={40}
              quality={85}
              priority
              className="hidden s:block"
              style={{ objectFit: 'contain', width: 'auto', height: 'auto' }}
            />
          </Link>
          <Link href="/gatherHub" className="logo-link">
            <Image
              src="/logos/gatherHub.svg"
              alt="@gather_hub 로고"
              width={100}
              height={50}
              priority
              className="s:w-[50px] s:h-[25px]"
              style={{ width: 'auto', height: 'auto' }}
            />
          </Link>
        </div>

        <nav className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            {/* 검색 버튼 */}
            <button
              onClick={() => modalRef.current?.open()}
              type="submit"
              className="flex items-center justify-center w-[36px] h-[36px] rounded-lg bg-fillNeutral hover:bg-fillAssistive pt-1"
            >
              <Image src="/assets/header/search.svg" width={22} height={22} alt="검색 버튼 아이콘" />
              {/* 검색 모달 */}
              <SearchBar ref={modalRef} />
            </button>
            {/* 게시글 작성 버튼 */}
            <Link className="square-header-button-gray" href="/post" passHref>
              <Image src="/assets/header/write.svg" width={16} height={16} alt="글쓰기 버튼 아이콘" />
            </Link>

            {/* 로그인 / 마이페이지 버튼 */}
            {user ? (
              <div className="flex items-center">
                <button
                  onClick={toggleMypageModal}
                  className="hidden s:flex items-center justify-center w-[32px] h-[32px] rounded-lg bg-fillNeutral hover:bg-fillAssistive z-50"
                >
                  <Image
                    src={isMypageModalOpen ? '/assets/header/primary_close.svg' : '/assets/header/mobile_logo.svg'}
                    alt={isMypageModalOpen ? '닫기 버튼 아이콘' : '마이페이지 아이콘'}
                    priority
                    width={14}
                    height={16}
                  />
                </button>

                <Link href="/mypage" className="square-header-button-gray s:hidden">
                  <Image src="/assets/header/mobile_logo.svg" alt="마이페이지 아이콘" priority width={14} height={16} />
                </Link>

                <button onClick={() => void signOut()} className="shared-button-small-gray-2 ml-2 s:hidden">
                  로그아웃
                </button>
              </div>
            ) : (
              <Link className="shared-button-small-green" href="/login">
                시작하기
              </Link>
            )}
          </div>
        </nav>
      </div>

      {/* 마이페이지 모달, NOTE: 로그인 모달과 비슷한 방식으로 바꾸면 코드 덜어낼 수 있을듯 */}
      {isMypageModalOpen && user && (
        <>
          <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={toggleMypageModal}></div>
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-full max-w-[80%] border-[1px] border-fillLight bg-fillStrong shadow-lg rounded-lg p-5 z-50 s:block hidden">
            <div className="flex items-center mb-4 pb-4 border-b-[1px] border-b-fillLight">
              <div className="w-12 h-12 bg-fillNeutral rounded-[12px] flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full rounded-[12px]">
                  <Image
                    src={userData?.profile_image_url ?? '/defaults/profile.png'}
                    alt="프로필 이미지"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-[12px]"
                  />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-fontWhite font-subtitle">{userData?.nickname}</p>
                <p className="text-baseXs text-labelNormal">
                  {userData?.job_title} {userData?.experience}
                </p>
              </div>
            </div>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/mypage"
                  onClick={closeModalOnRouteChange}
                  className="block text-labelNormal font-base hover:text-fontWhite"
                >
                  기본 프로필
                </Link>
              </li>
              <li>
                <Link
                  href="/mypage/hubprofile"
                  onClick={closeModalOnRouteChange}
                  className="block text-labelNormal font-base hover:text-fontWhite"
                >
                  허브 프로필
                </Link>
              </li>
              <li>
                <Link
                  href="/mypage/myinterests"
                  onClick={closeModalOnRouteChange}
                  className="block text-labelNormal font-base hover:text-fontWhite"
                >
                  내 관심 글
                </Link>
              </li>
              <li>
                <Link
                  href="/mypage/myposts"
                  onClick={closeModalOnRouteChange}
                  className="block text-labelNormal font-base hover:text-fontWhite"
                >
                  내 관심 멤버
                </Link>
              </li>
              <li>
                <Link
                  href="/mypage/myposts"
                  onClick={closeModalOnRouteChange}
                  className="block text-labelNormal font-base hover:text-fontWhite"
                >
                  내 작성 글
                </Link>
              </li>
              <li>
                <button
                  onClick={() => void signOut()}
                  className="block w-full text-left text-labelNormal font-base hover:text-fontWhite"
                >
                  로그아웃
                </button>
              </li>
            </ul>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
