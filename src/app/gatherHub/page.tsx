"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import JobDirectory from '@/components/GatherHub/JobDirectory';
import { useUser } from '@/provider/UserContextProvider';
import { useGatherHubData } from '@/hooks/useGatherHubData';
import { useInfiniteScrollWithRestoration } from '@/hooks/useInfiniteScrollWithRestoration ';
import LoadingState from '@/components/GatherHub/LoadingState';
import ErrorHandler from '@/components/GatherHub/ErrorHandler';


// MemberCard 컴포넌트를 동적으로 로드 (로딩 중에 표시할 내용 설정)
const MemberCard = React.memo(dynamic(() => import('@/components/GatherHub/MemberCard'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
}), (prevProps, nextProps) => prevProps.liked === nextProps.liked);

const GatherHubPage: React.FC = () => {
  const { userData } = useUser();  // 유저 데이터 가져오기

    // userData가 null일 경우 로딩 상태 처리 또는 다른 처리
    if (!userData) {
      return <LoadingState />; // userData가 없으면 로딩 화면을 보여줍니다.
    }
  const isHubRegistered = userData.hubCard || false;  // Hub에 등록된 유저인지 확인

  // useGatherHubData 훅을 사용하여 데이터와 상태를 가져옴
  const {
    filteredMembers,
    setFilteredJob,
    isLoading,
    error,
    isFetchingNextPage,
    hasNextPage,
    likedMembers,
    setLikedMembers,
    fetchNextPage, 
  } = useGatherHubData({ 
    ...userData, 
    blog: userData.blog ?? undefined // blog가 null일 경우 undefined로 변환
  }, 
  isHubRegistered
);;

  // 무한 스크롤 및 스크롤 복원 훅 적용
  useInfiniteScrollWithRestoration('all', {
    fetchNextPage: () => {
      sessionStorage.setItem('scrollPosition', window.scrollY.toString()); // 스크롤 위치 저장
      return fetchNextPage();
    },
    hasNextPage,
    isFetchingNextPage,
  });

  if (isLoading) {
    return <LoadingState />;  // LoadingState 컴포넌트를 사용
  }

  if (error) {
    return <ErrorHandler error={error} />;
  }

  return (
    <div className="flex flex-col lg:flex-row justify-center">
      <div className="w-full lg:max-w-6xl lg:flex lg:justify-between px-4 py-8">
        <div className="mb-6 lg:hidden">
          <JobDirectory setFilteredJob={setFilteredJob} className="w-full" />
        </div>

        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {filteredMembers.map((member, index) => (
            <div key={`${member.nickname}-${index}`}>
              <MemberCard
                {...member}
                liked={likedMembers[member.nickname] || false}
                toggleLike={() => setLikedMembers(prev => ({
                  ...prev,
                  [member.nickname]: !prev[member.nickname],
                }))}
              />
            </div>
          ))}

          {isFetchingNextPage && <div className="col-span-full">더 불러오는 중...</div>}

          {!hasNextPage && !isFetchingNextPage && (
            <div className="col-span-full">더 이상 데이터가 없습니다.</div>
          )}
        </div>

        <div className="hidden lg:block lg:ml-10 lg:w-40">
          <JobDirectory setFilteredJob={setFilteredJob} />
        </div>
      </div>
    </div>
  );
};

export default GatherHubPage;