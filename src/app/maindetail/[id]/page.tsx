'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import DOMPurify from 'dompurify';
import Image from 'next/image';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import 'react-quill/dist/quill.core.css';
import LikeButton from '@/components/MainDetail/LikeButton';
import ShareButton from '@/components/MainDetail/ShareButton';
import CommonModal from '@/components/Common/Modal/CommonModal';
import { secureImageUrl } from '@/utils/imageUtils';
import { Post, User } from '@/types/posts/Post.type';
import { useUserData } from '@/provider/user/UserDataProvider';

const MainDetailPage = () => {
  const pathname = usePathname();
  const router = useRouter();
  const id = pathname.split('/').pop()!;
  const [post, setPost] = useState<Post>();
  const [user, setUser] = useState<User>();
  const { userData } = useUserData();
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPostAndUser = async () => {
      if (id) {
        const { data: postData, error: postError } = await supabase
          .from('Posts')
          .select('*')
          .eq('post_id', id)
          .single();

        if (postError) {
          return <div>게시글을 불러오는 과정에서 문제가 발생했습니다.</div>;
        }

        setPost(postData);

        const { data, error } = await supabase
          .from('Users')
          .select('profile_image_url, nickname')
          .eq('user_id', postData.user_id)
          .single();

        if (error) {
          console.error('Error fetching user:', error);
        } else {
          setUser(data);
        }
      }
    };

    void fetchPostAndUser();
  }, [id]);

  const handleMoreOptions = () => {
    setShowOptions(!showOptions);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [optionsRef]);

  const timeAgo = (timestamp: string): string => {
    const now: Date = new Date();
    const postDate: Date = new Date(timestamp);
    const diff = now.getTime() - postDate.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${days}일 전`;
  };

  const handleDelete = async () => {
    if (userData?.user_id !== post?.user_id) {
      alert('본인의 글만 삭제할 수 있습니다.');
      return;
    }

    const { error } = await supabase.from('Posts').delete().eq('post_id', id);
    if (error) {
      throw Error('게시글 삭제 과정에서 문제가 발생했습니다.');
    } else {
      router.push('/');
    }
  };

  if (!post) return <></>;

  const cleanContent = DOMPurify.sanitize(post.content, {
    ALLOWED_TAGS: [
      'b',
      'i',
      'em',
      'strong',
      'a',
      'h1',
      'h2',
      'h3',
      'p',
      'span',
      'ul',
      'ol',
      'li',
      'br',
      'gt',
      'lt',
      'amp',
    ],
    ALLOWED_ATTR: ['href', 'target', 'style', 'class'],
  });

  const renderTechStackIcons = (techStack: string[]) => {
    return techStack.map((tech) => (
      <div key={tech} className="inline-flex items-center mr-1">
        <div className="flex items-center my-1 bg-fillNormal px-2.5 py-1 rounded-full">
          <div className="flex items-center">
            <Image
              src={`/Stacks/${tech}.svg`}
              alt={tech}
              width={20}
              height={20}
              className="mr-1"
              style={{ width: '20px', height: '20px' }}
            />
          </div>
          <span className="text-baseS text-labelNeutral">{tech}</span>
        </div>
      </div>
    ));
  };

  return (
    <>
      <div className="w-full mx-auto max-w-[672px] s:max-w-container-s bg-background text-fontWhite rounded-lg">
        <button
          onClick={() => router.push('/')}
          className="text-labelNeutral mt-5 mb-4 flex items-center space-x-2 group"
        >
          <div className="relative">
            <Image
              src="/assets/back.svg"
              alt="목록으로 돌아가기"
              width={24}
              height={24}
              className="transform transition-transform duration-300 group-hover:translate-x-1"
            />
          </div>
          <span>목록으로 돌아갈게요</span>
        </button>
      </div>
      <div className="w-full mx-auto max-w-[672px] s:max-w-container-s p-5 bg-fillAlternative text-fontWhite rounded-lg">
        <div className="mb-4">
          <h1 className="text-title font-subtitle">{post.title}</h1>
        </div>
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
            <LikeButton postId={id} currentUser={userData} category={post.category} />
            {userData?.user_id === post.user_id && (
              <div className="relative ml-2" ref={optionsRef}>
                <button onClick={handleMoreOptions} className="flex items-center">
                  <Image src="/Detail/edit-delete.svg" alt="More Options" width={20} height={20} className="ml-1" />
                </button>

                {showOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-fillStrong rounded-lg shadow-lg">
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-white hover:bg-fillAssistive flex items-center"
                      onClick={() => router.push(`/post/${id}`)}
                    >
                      <Image src="/Detail/edit.svg" alt="Edit" width={24} height={24} className="mr-2" />
                      수정하기
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-white hover:bg-fillAssistive flex items-center"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <Image src="/Detail/delete.svg" alt="Delete" width={24} height={24} className="mr-2" />
                      삭제하기
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <hr className="border-fillNeutral mb-4" />
        <div>
          <h2 className="text-lg text-labelAssistive font-semibold mb-2">모집 정보</h2>
        </div>
        <div className="flex mb-4 flex-wrap">
          <div className="w-1/2 s:w-full">
            <p className="mb-4 flex">
              <strong className="text-labelNeutral w-20 font-baseBold">분류</strong>{' '}
              <span className="ml-5">{post.category}</span>
            </p>
            <p className="mb-4 flex">
              <strong className="text-labelNeutral w-20 font-baseBold">지역</strong>{' '}
              <span className="ml-5">{post.location}</span>
            </p>
            <p className="mb-4 flex">
              <strong className="text-labelNeutral w-20 font-baseBold">기간</strong>{' '}
              <span className="ml-5">{post.duration}개월</span>
            </p>
            <p className="mb-4 flex">
              <strong className="text-labelNeutral w-20 font-baseBold">총 인원</strong>
              <span className="ml-5">{post.total_members}명</span>
            </p>
            <p className="mb-4 flex">
              <strong className="text-labelNeutral w-20 font-baseBold">지원 방법</strong>
              <span className="ml-5">{post.personal_link}</span>
            </p>
          </div>
          <div className="w-1/2 s:w-full">
            <hr className="hidden s:block border-fillNeutral my-5" />
            <p className="mb-4 flex">
              <strong className="text-labelNeutral w-20 font-baseBold flex-shrink-0">모집 대상</strong>
              <span className="ml-5 text-left">{post.target_position.join(', ')}</span>
            </p>
            <p className="mb-4 flex">
              <strong className="text-labelNeutral w-20 font-baseBold">모집 인원</strong>
              <span className="ml-5">{post.recruitments}명</span>
            </p>

            <p className="mb-4 flex">
              <strong className="text-labelNeutral w-20 font-baseBold">마감일</strong>
              <span className="ml-5">{new Date(post.deadline).toLocaleDateString()}</span>
            </p>
            <p className="mb-4 flex">
              <strong className="text-labelNeutral w-20 font-baseBold">장소</strong>{' '}
              <span className="ml-5">{post.place}</span>
            </p>
            <div className="mb-4 flex items-start">
              <strong className="text-labelNeutral w-20 font-baseBold flex-shrink-0">기술 스택</strong>
              <span className="ml-4 flex flex-wrap justify-start items-center flex-grow">
                {renderTechStackIcons(post.tech_stack)}
              </span>
            </div>
          </div>
        </div>
        <hr className="border-fillNeutral mb-4" />
        <div>
          <h2 className="text-lg text-labelAssistive font-semibold mb-5 w-w-20">모집 내용</h2>
        </div>
        <div className="bg-fillLight p-4 rounded-lg shadow-md">
          <div className="ql-editor" dangerouslySetInnerHTML={{ __html: cleanContent }} />
        </div>
      </div>

      {showDeleteModal && (
        <CommonModal isOpen={showDeleteModal} onRequestClose={() => setShowDeleteModal(false)}>
          <div className="p-4 text-center">
            <p className="text-lg font-semibold mb-4">정말 삭제하시겠어요?</p>
            <p className="text-sm text-labelNeutral mb-5">한번 삭제된 글은 다시 복구할 수 없어요.</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-fillNeutral rounded-lg text-primary"
              >
                안 할래요
              </button>
              <button onClick={() => void handleDelete()} className="px-4 py-2 bg-primary rounded-lg text-fillNeutral">
                삭제할래요
              </button>
            </div>
          </div>
        </CommonModal>
      )}
    </>
  );
};

export default MainDetailPage;
