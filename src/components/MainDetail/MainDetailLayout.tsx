'use client';

import React from 'react';
import Image from 'next/image';
import LikeButton from '@/components/MainDetail/components/common/LikeButton';
import ShareButton from '@/components/MainDetail/components/common/ShareButton';
import PostTechStackIcons from '@/components/MainDetail/components/PostTechStackIcons';
import { secureImageUrl } from '@/utils/imageUtils';
import { timeAgo, cleanContent } from '@/utils/mainDetailUtils';
import { Post, User } from '@/types/posts/Post.type';
import { UserData } from '@/types/userData';

interface Props {
  post: Post;
  user: User;
  userData: UserData | null;
  showOptions: boolean;
  optionsRef: React.RefObject<HTMLDivElement>;
  handleMoreOptions: () => void;
  setShowDeleteModal: (value: boolean) => void;
  onBack: () => void;
}

const MainDetailLayout: React.FC<Props> = ({
  post,
  user,
  userData,
  showOptions,
  optionsRef,
  handleMoreOptions,
  setShowDeleteModal,
  onBack,
}) => {
  return (
    <>
      {/* 뒤로가기 버튼 */}
      <div className="w-full mx-auto max-w-[672px] s:max-w-container-s bg-background text-fontWhite rounded-lg">
        <button
          onClick={onBack}
          className="text-labelNeutral mt-5 mb-4 flex items-center space-x-2 group"
        >
          <Image
            src="/assets/back.svg"
            alt="목록으로 돌아가기"
            width={24}
            height={24}
            className="transform transition-transform duration-300 group-hover:translate-x-1"
          />
          <span>목록으로 돌아갈게요</span>
        </button>
      </div>

      {/* 메인 디테일 카드 */}
      <div className="w-full mx-auto max-w-[672px] s:max-w-container-s p-5 bg-fillAlternative text-fontWhite rounded-lg">
        <h1 className="text-title font-subtitle mb-4">{post.title}</h1>

        {/* 유저 정보 + 버튼들 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {user?.profile_image_url && (
              <Image
                src={secureImageUrl(user.profile_image_url)}
                alt={`${user.nickname} 님의 프로필 사진`}
                width={28}
                height={28}
                className="rounded-md object-cover w-[28px] h-[28px]"
              />
            )}
            <span className="text-base font-medium">{user?.nickname}</span>
            <span className="text-sm text-labelNeutral">{timeAgo(post.created_at)}</span>
          </div>

          <div className="flex items-center">
            <ShareButton />
            <LikeButton
              postId={post.post_id}
              currentUser={userData ?? null}
              category={post.category}
            />
            {userData?.user_id === post.user_id && (
              <div className="relative ml-2" ref={optionsRef}>
                <button onClick={handleMoreOptions} className="flex items-center">
                  <Image
                    src="/Detail/edit-delete.svg"
                    alt="More Options"
                    width={20}
                    height={20}
                  />
                </button>

                {showOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-fillStrong rounded-lg shadow-lg">
                    <button
                      className="w-full px-4 py-2 text-sm text-white hover:bg-fillAssistive flex items-center"
                      onClick={onBack}
                    >
                      <Image
                        src="/Detail/edit.svg"
                        alt="Edit"
                        width={24}
                        height={24}
                        className="mr-2"
                      />
                      수정하기
                    </button>
                    <button
                      className="w-full px-4 py-2 text-sm text-white hover:bg-fillAssistive flex items-center"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <Image
                        src="/Detail/delete.svg"
                        alt="Delete"
                        width={24}
                        height={24}
                        className="mr-2"
                      />
                      삭제하기
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <hr className="border-fillNeutral mb-4" />

        {/* 모집 정보 */}
        <h2 className="text-lg text-labelAssistive font-semibold mb-2">모집 정보</h2>
        <div className="flex mb-4 flex-wrap">
          <div className="w-1/2 s:w-full">
            <p className="mb-4 flex"><strong className="text-labelNeutral w-20 font-baseBold">분류</strong><span className="ml-5">{post.category}</span></p>
            <p className="mb-4 flex"><strong className="text-labelNeutral w-20 font-baseBold">지역</strong><span className="ml-5">{post.location}</span></p>
            <p className="mb-4 flex"><strong className="text-labelNeutral w-20 font-baseBold">기간</strong><span className="ml-5">{post.duration}개월</span></p>
            <p className="mb-4 flex"><strong className="text-labelNeutral w-20 font-baseBold">총 인원</strong><span className="ml-5">{post.total_members}명</span></p>
            <p className="mb-4 flex"><strong className="text-labelNeutral w-20 font-baseBold">지원 방법</strong><span className="ml-5">{post.personal_link}</span></p>
          </div>
          <div className="w-1/2 s:w-full">
            <hr className="hidden s:block border-fillNeutral my-5" />
            <p className="mb-4 flex"><strong className="text-labelNeutral w-20 font-baseBold">모집 대상</strong><span className="ml-5">{post.target_position.join(', ')}</span></p>
            <p className="mb-4 flex"><strong className="text-labelNeutral w-20 font-baseBold">모집 인원</strong><span className="ml-5">{post.recruitments}명</span></p>
            <p className="mb-4 flex"><strong className="text-labelNeutral w-20 font-baseBold">마감일</strong><span className="ml-5">{new Date(post.deadline).toLocaleDateString()}</span></p>
            <p className="mb-4 flex"><strong className="text-labelNeutral w-20 font-baseBold">장소</strong><span className="ml-5">{post.place}</span></p>
            <div className="mb-4 flex items-start">
              <strong className="text-labelNeutral w-20 font-baseBold">기술 스택</strong>
              <span className="ml-4 flex flex-wrap justify-start items-center flex-grow">
                <PostTechStackIcons techStack={post.tech_stack} />
              </span>
            </div>
          </div>
        </div>

        <hr className="border-fillNeutral mb-4" />

        {/* 모집 내용 */}
        <h2 className="text-lg text-labelAssistive font-semibold mb-5">모집 내용</h2>
        <div className="bg-fillLight p-4 rounded-lg shadow-md">
          <div className="ql-editor" dangerouslySetInnerHTML={{ __html: cleanContent(post.content) }} />
        </div>
      </div>
    </>
  );
};

export default MainDetailLayout;