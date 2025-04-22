"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/provider/user/UserAuthProvider";
import { fetchLikedPosts } from "@/lib/fetchPosts";
import PostCardLong from "@/components/Common/Card/PostCard/PostCardLong";
import ItEventCardShort from "@/components/Common/Card/PostCard/ItEventCardShort";
import MypageList from "@/components/Common/Skeleton/MypageList";
import Pagination from "@/components/MyPage/Common/Pagination";
import { PostWithUser, ITEvent } from "@/types/posts/Post.type";

type Tab = "전체" | "스터디" | "프로젝트" | "IT 행사";

const InterestsTap: React.FC = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<Tab>("전체");
  const [originalPosts, setOriginalPosts] = useState<(PostWithUser | ITEvent)[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // 로그인하지 않은 경우 접근 제한
  if (!user) {
    return <p className="text-center mt-12">로그인이 필요합니다.</p>;
  }

  // 최초 한 번 북마크된 게시글을 가져옴
  useEffect(() => {
    const loadPosts = async () => {
      if (user?.id) {
        setLoading(true);
        try {
          const likedPosts = await fetchLikedPosts(user.id);
          setOriginalPosts(likedPosts);
        } catch (error) {
          console.error("포스트 불러오는 중 오류 발생:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    void loadPosts();
  }, [user?.id]);

  // 현재 선택된 탭에 따라 게시글 필터링
  const filteredPosts = useMemo(() => {
    return originalPosts.filter((post) => {
      if (selectedTab === "전체") return true;
      if ("event_id" in post && selectedTab === "IT 행사") return true;
      if ("category" in post && post.category === selectedTab) return true;
      return false;
    });
  }, [originalPosts, selectedTab]);

  // 전체 페이지 수 계산
  const totalPages = useMemo(() => Math.ceil(filteredPosts.length / postsPerPage), [filteredPosts]);

  // 현재 페이지에 보여줄 게시글 목록 계산
  const currentPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
  }, [filteredPosts, currentPage]);

  // 탭 클릭 시 탭 변경 및 페이지 초기화
  const handleTabClick = (tab: Tab) => {
    setSelectedTab(tab);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 페이지네이션 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 북마크 해제 시 해당 게시글 제거
  const handleRemoveBookmark = (postId: string | number) => {
    setOriginalPosts((prev) =>
      prev.filter((post) =>
        (post as PostWithUser).post_id !== postId &&
        (post as ITEvent).event_id !== postId
      )
    );
  };

  return (
    <div className="relative flex flex-col">
      {/* 탭 필터 */}
      <div className="sticky z-10 s:relative s:top-auto">
        <div className="flex w-[320px] s:w-full items-center m:justify-start s:justify-center space-x-4 s:space-x-6 p-3 bg-fillStrong rounded-2xl">
          {(["전체", "스터디", "프로젝트", "IT 행사"] as Tab[]).map((tab) => (
            <button
              key={tab}
              className={`text-baseS min-w-[60px] ${selectedTab === tab ? "tab-button" : ""}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 카드 리스트 */}
      <div className="s:w-full mt-5 grid gap-5 s:grid-cols-1 m:grid-cols-2 grid-cols-3">
        {loading ? (
          Array(3).fill(0).map((_, index) => <MypageList key={index} />)
        ) : currentPosts.length > 0 ? (
          currentPosts.map((post) => (
            <div
              key={(post as PostWithUser).post_id || (post as ITEvent).event_id}
              className="s:w-full h-[261px] mb-4 sm:mb-0"
            >
              {"event_id" in post ? (
                <ItEventCardShort post={post} onRemoveBookmark={() => handleRemoveBookmark(post.event_id)} />
              ) : (
                <PostCardLong post={post} onRemoveBookmark={() => handleRemoveBookmark(post.post_id)} />
              )}
            </div>
          ))
        ) : (
          <p className="mt-8 text-center text-labelNeutral col-span-full">
            북마크 한 글이 아직 없어요.🥺
          </p>
        )}
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center py-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default InterestsTap;