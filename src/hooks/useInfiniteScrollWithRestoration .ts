import { useEffect, useRef } from 'react';
import { throttle } from 'lodash';

// InfiniteScrollOptions 인터페이스 정의
interface InfiniteScrollOptions {
  fetchNextPage: () => void; // 다음 페이지를 가져오는 함수
  hasNextPage: boolean | undefined; // 다음 페이지가 있는지 여부
  isFetchingNextPage: boolean; // 현재 다음 페이지를 fetching 중인지 여부
  restoreScroll?: boolean; // 스크롤 복원 여부
}

// useInfiniteScrollWithRestoration 훅 정의
export const useInfiniteScrollWithRestoration = (
  filteredJob: string,
  { fetchNextPage, hasNextPage, isFetchingNextPage, restoreScroll = true }: InfiniteScrollOptions // 옵션 객체
) => {
  
  // 다음 페이지 여부와 fetching 상태를 참조하기 위한 useRef
  const hasNextPageRef = useRef(hasNextPage);
  const isFetchingNextPageRef = useRef(isFetchingNextPage);

  // 다음 페이지 여부와 fetching 상태를 업데이트
  useEffect(() => {
    hasNextPageRef.current = hasNextPage; // 참조값 업데이트
    isFetchingNextPageRef.current = isFetchingNextPage; // 참조값 업데이트
  }, [hasNextPage, isFetchingNextPage]);

  // 스크롤 이벤트 핸들러
  useEffect(() => {
    // 스크롤 이벤트에 대한 throttled 핸들러 정의
    const handleScroll = throttle(() => {
      // 필터링된 직업군이 'all'일 경우에만 동작
      if (
        filteredJob === 'all' &&
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 200 // 스크롤이 페이지 하단에 가까워질 때
      ) {
        // 다음 페이지가 존재하고, 현재 fetching 중이 아닐 경우
        if (hasNextPageRef.current && !isFetchingNextPageRef.current) {
          fetchNextPage(); // 다음 페이지 데이터 요청
        }
      }
    }, 300); // 300ms마다 호출

    // 스크롤 이벤트 리스너 추가
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // 컴포넌트 언마운트 시 리스너 제거
  }, [fetchNextPage, filteredJob]);

  // 스크롤 복원 로직 (옵션으로 처리)
  if (restoreScroll) {
    useEffect(() => {
      const storageKey = `scrollPosition-${filteredJob}`; // 직업군별 스크롤 위치 저장 키
      const savedPosition = sessionStorage.getItem(storageKey); // 저장된 스크롤 위치 가져오기
      window.scrollTo(0, savedPosition ? parseInt(savedPosition, 10) : 0); // 스크롤 위치 복원

      // 페이지 언로드 시 현재 스크롤 위치 저장
      const handleBeforeUnload = () => {
        sessionStorage.setItem(storageKey, window.scrollY.toString());
      };

      // beforeunload 이벤트 리스너 추가
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload); // 컴포넌트 언마운트 시 리스너 제거
      };
    }, [filteredJob]); // filteredJob이 변경될 때마다 실행
  }
};