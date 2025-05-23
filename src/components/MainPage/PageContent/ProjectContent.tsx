/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import InfiniteScrollComponent from '@/components/MainPage/InfiniteScroll/InfiniteScrollComponents';
import { PostWithUser } from '@/types/posts/Post.type';
import { fetchPosts, fetchPostsWithDeadLine } from '@/lib/fetchPosts';
import FilterBar from '../FilterBar/FilterBar';
import Image from 'next/image';
import CarouselLoader from '@/components/Common/Skeleton/CarouselLoader';
import dynamic from 'next/dynamic';
import useSearch from '@/hooks/useSearch';

const Carousel = dynamic(() => import('@/components/MainPage/Carousel/Carousel'), { ssr: false });

interface ProjectContentProps {
  initialPosts: PostWithUser[];
}

const ProjectContent: React.FC<ProjectContentProps> = () => {
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { searchWord } = useSearch();

  const [carouselPosts, setCarouselPosts] = useState<PostWithUser[]>([]);
  const [isLoadingCarousel, setIsLoadingCarousel] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [selectedPlace, setSelectedPlace] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

  useEffect(() => {
    const loadCarouselData = async () => {
      setIsLoadingCarousel(true);
      const carouselData = await fetchPostsWithDeadLine(15, '프로젝트');
      setCarouselPosts(carouselData);
      setIsLoadingCarousel(false);
    };
    void loadCarouselData();
  }, []);

  useEffect(() => {
    localStorage.setItem('previousPage', '/projects');
  }, []);

  const loadMorePosts = async () => {
    // @ts-expect-error, 오류를 어떻게 처리해야할지 모르는 상황이라 일단 대기.
    const filterOptions: FetchPostsFilters = {
      targetPosition: selectedPosition ? [selectedPosition] : undefined,
      place: selectedPlace,
      location: selectedLocation,
      duration: null,
    };

    if (selectedDuration !== null) {
      if (selectedDuration === 7) {
        filterOptions.duration = { gt: 6 };
      } else {
        filterOptions.duration = { lte: selectedDuration };
      }
    }

    const newPosts = await fetchPosts(page, '프로젝트', filterOptions);

    setPosts((prevPosts) => {
      const uniqueNewPosts = newPosts.filter((newPost) => !prevPosts.some((post) => post.post_id === newPost.post_id));
      return [...prevPosts, ...uniqueNewPosts];
    });

    setPage((prevPage) => prevPage + 1);

    if (newPosts.length < 5) {
      setHasMore(false);
    }
  };

  const handleFilterChange = useCallback(
    async (position: string, place: string, location: string, duration: number | null) => {
      setSelectedPosition(position);
      setSelectedPlace(place);
      setSelectedLocation(location);
      setSelectedDuration(duration);

      const isDefaultFilter = !position && !place && !location && duration === null;

      if (isDefaultFilter) {
        const allPosts = await fetchPosts(1, '프로젝트', {});
        setPosts(allPosts);
        setPage(2);
        setHasMore(allPosts.length === 5);
      } else {
        // @ts-expect-error, 오류를 어떻게 처리해야할지 모르는 상황이라 일단 대기.
        const filterOptions: FetchPostsFilters = {
          targetPosition: position ? [position] : undefined,
          place: place,
          location: location,
          duration: null,
        };

        if (duration !== null) {
          if (duration === 7) {
            filterOptions.duration = { gt: 6 };
          } else {
            filterOptions.duration = { lte: duration };
          }
        }

        const filteredPosts = await fetchPosts(1, '프로젝트', filterOptions);

        setPosts(filteredPosts);
        setPage(2);
        setHasMore(filteredPosts.length === 5);
      }
    },
    [],
  );

  useEffect(() => {
    const initialLoad = async () => {
      const initialPosts = await fetchPosts(1, '프로젝트', {});
      setPosts(initialPosts);
      setPage(2);
      setHasMore(initialPosts.length === 5);
    };

    void initialLoad();
  }, []);

  const filteredPosts = useMemo(() => {
    if (!searchWord) return posts;
    const lowerSearchWord = searchWord.toLowerCase();
    return posts.filter(
      (post) =>
        post.title?.toLowerCase().includes(lowerSearchWord) ?? post.content.toLowerCase().includes(lowerSearchWord),
    );
  }, [posts, searchWord]);

  return (
    <div className="w-full">
      <div className="flex items-center">
        <Image src="/assets/gif/run.webp" alt="Run Icon" width={20} height={20} className="w-5 h-5 mb-2" priority />
        <p className="m-2 mb-4 text-labelNormal">모집이 곧 종료돼요</p>
      </div>
      {isLoadingCarousel ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <CarouselLoader key={index} />
          ))}
        </div>
      ) : (
        <Carousel posts={carouselPosts} />
      )}
      <div className="flex items-center mt-7">
        <Image src="/assets/gif/puzzle.webp" alt="Puzzle Icon" width={20} height={20} className="mb-3" />
        <p className="ml-2 mb-3 text-labelNormal">나에게 꼭 맞는 동료들을 찾아보세요</p>
      </div>
      <FilterBar
        selectedPosition={selectedPosition}
        selectedPlace={selectedPlace}
        selectedLocation={selectedLocation}
        selectedDuration={selectedDuration}
        onChange={handleFilterChange}
      />
      <InfiniteScrollComponent posts={filteredPosts} hasMore={hasMore} loadMorePosts={loadMorePosts} />
    </div>
  );
};

export default ProjectContent;
