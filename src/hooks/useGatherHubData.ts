import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { UserData } from '../types/hub';
import { useInfiniteScrollWithRestoration } from './useInfiniteScrollWithRestoration ';


// Axios 인스턴스 생성 (타임아웃 설정)
const axiosInstance = axios.create({ timeout: 5000 });

// 실제 멤버 데이터를 가져오는 함수
const fetchRealMembers = async ({ pageParam = 1 }) => {
  try {
    const response = await axiosInstance.get(`/gatherhere?page=${pageParam}&limit=10`);
    return {
      members: response.data.members, // 서버에서 가져온 멤버 데이터
      hasMore: response.data.hasMore, // 추가 데이터 여부
      nextPage: response.data.hasMore ? pageParam + 1 : undefined, // 다음 페이지 번호
    };
  } catch (error) {
    console.error("Error fetching real members:", error);
    return { members: [], nextPage: undefined };  // 에러 발생 시 빈 데이터 반환
  }
};

// 목 데이터를 생성
const mockMembers = Array.from({ length: 100 }, (_, index) => ({
  nickname: `User${index + 1}`,
  jobTitle: ['Frontend', 'Backend', 'Design', 'PM', 'IOS', 'Android'][index % 6],
  experience: ['신입', '1년차', '2년차', '3년차', '4년차', '5년차', '6년차'][index % 4],
  backgroundImageUrl: '/logos/hi.png',
  profileImageUrl: '/path-to-profile-image',
  blog: 'https://github.com/gather-here',
  notionLink: 'https://www.notion.so/',
  instagramLink: 'https://www.instagram.com/',
  liked: false,
  toggleLike: () => {},
  description: '항상 사용자의 입장에서 친절한 화면을 지향합니다.',
  answer1: '기본 답변 1',
  answer2: '기본 답변 2',
  answer3: '기본 답변 3',
}));

// 멤버 데이터를 가져오는 함수
const fetchMembers = async ({ pageParam = 1 }) => {
  const realData = await fetchRealMembers({ pageParam }); // 실제 데이터 호출
  const pageSize = 10; // 페이지당 항목 수
  const startIndex = (pageParam - 1) * pageSize; // 시작 인덱스
  const endIndex = pageParam * pageSize; // 끝 인덱스
  const pageMockMembers = mockMembers.slice(startIndex, endIndex); // 해당 페이지의 목데이터 추출
  const combinedMembers = Array.from(new Set([...realData.members, ...pageMockMembers])); // 중복 제거 후 결합

  return {
    members: combinedMembers, // 결합된 멤버 리스트
    nextPage: realData.nextPage || (endIndex < mockMembers.length ? pageParam + 1 : undefined), // 다음 페이지 설정
  };
};

// 사용자가 Hub에 등록된 멤버 데이터를 관리하는 훅
export const useGatherHubData = (userData: UserData, isHubRegistered: boolean) => {
  const [likedMembers, setLikedMembers] = useState<{ [key: string]: boolean }>({}); // 좋아요 상태 관리
  const [filteredJob, setFilteredJob] = useState<string>('all'); // 필터링된 직업군 상태 관리

  // React Query를 사용하여 데이터 페칭 및 상태 관리
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading, 
    error,
  } = useInfiniteQuery({
    queryKey: ['gatherHub', userData?.nickname],
    queryFn: fetchMembers,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 60000, // 데이터 캐싱 시간 (60초)
    initialPageParam: 1,
  });

  // 스크롤 관련 훅 사용
  useInfiniteScrollWithRestoration(filteredJob, {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    restoreScroll: true, // 스크롤 복원 여부 설정
  });

  // 멤버 리스트 생성 및 liked 처리
  const allMembers = data?.pages?.flatMap(page => page.members) || []; // 모든 멤버 데이터 가져오기

  // Hub에 등록된 사용자의 데이터 추가
  if (isHubRegistered && userData && userData.nickname) {
    const { nickname } = userData;
    allMembers.unshift({
      nickname,
      jobTitle: userData.job_title,
      experience: userData.experience,
      blog: userData.blog,
      backgroundImageUrl: '',
      profileImageUrl: userData.profile_image_url,
      notionLink: 'https://www.notion.so/',
      instagramLink: 'https://www.instagram.com/',
      liked: nickname && likedMembers[nickname] || false, // 사용자의 닉네임이 존재하면 likedMembers에서 해당 닉네임의 좋아요 상태를 가져오고, 없으면 false 반환
      toggleLike: () => setLikedMembers(prev => ({ // toggleLike 함수: 사용자가 좋아요 버튼을 클릭할 때 호출되어 해당 멤버의 좋아요 상태를 토글 처리
        ...prev,
        [nickname]: !prev[nickname], 
      })), 
      description: userData.description || '항상 사용자의 입장에서 친절한 화면을 지향합니다.',
      answer1: userData.answer1 || '기본 답변 1',
      answer2: userData.answer2 || '기본 답변 2',
      answer3: userData.answer3 || '기본 답변 3',
    });
  }

  // 필터링 로직
  const filteredMembers = filteredJob === 'all'
    ? allMembers.filter(member => member.nickname && member.jobTitle && member.profileImageUrl) // 전체 보기
    : allMembers.filter(member => member.jobTitle?.toLowerCase() === filteredJob && member.nickname && member.profileImageUrl); // 직업군별 필터링

  return {
    filteredMembers, 
    setFilteredJob, 
    isLoading,
    error, 
    isFetchingNextPage,
    hasNextPage,
    likedMembers, 
    setLikedMembers,
    fetchNextPage,
  };
};