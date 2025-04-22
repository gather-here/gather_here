'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CommonModal from '@/components/Common/Modal/CommonModal';
import SpinnerLoader from '@/components/Common/Loading/SpinnerLoader';
import MainDetailLayout from './MainDetailLayout';
import { useUserData } from '@/provider/user/UserDataProvider';
import { Post, User } from '@/types/posts/Post.type';
import { UserData } from '@/types/userData';
import { deletePost } from '@/components/MainDetail/actions/deletePost';


interface MainDetailClientProps {
  post: Post;
  user: User;
}

const MainDetailClient: React.FC<MainDetailClientProps> = ({ post, user }) => {
  const router = useRouter();
  const { userData }: { userData: UserData | null } = useUserData();
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);
  
  const handleMoreOptions = () => setShowOptions((prev) => !prev);
  const handleClickOutside = (event: MouseEvent) => {
    if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = async () => {
    if (!userData) {
      alert('로그인이 필요합니다.');
      return;
    }

    const result = await deletePost(post.post_id, userData.user_id);

    if (!result.success) {
      alert(result.error ?? '게시글 삭제에 실패했습니다.');
      return;
    }

    router.push('/');
  };

  const onBack = () => router.push('/');

  if (!post) return <SpinnerLoader />;

  return (
    <>
      <MainDetailLayout
        post={post}
        user={user}
        userData={userData}
        showOptions={showOptions}
        optionsRef={optionsRef}
        handleMoreOptions={handleMoreOptions}
        setShowDeleteModal={setShowDeleteModal}
        onBack={onBack}
      />

      {showDeleteModal && (
        <CommonModal isOpen={showDeleteModal} onRequestClose={() => setShowDeleteModal(false)}>
          <div className="p-4 text-center">
            <p className="text-lg font-semibold mb-4">정말 삭제하시겠어요?</p>
            <p className="text-sm text-labelNeutral mb-5">한번 삭제된 글은 다시 복구할 수 없어요.</p>
            <div className="flex justify-center space-x-4">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-fillNeutral rounded-lg text-primary">
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

export default MainDetailClient;