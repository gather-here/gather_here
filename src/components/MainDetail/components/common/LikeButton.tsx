'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import Toast from '@/components/Common/Toast/Toast';
import { UserData } from '@/types/userData';

interface LikeButtonProps {
  postId: string;
  currentUser: UserData | null;
  category: string;
  onRemoveBookmark?: (postId: string) => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({ postId, currentUser, category, onRemoveBookmark }) => {
  const [liked, setLiked] = useState(false);
   const [toast, setToast] = useState<{
      state: "success" | "error" | "warn" | "info" | "custom";
      message: string;
    } | null>(null);

  useEffect(() => {
    const checkLikeStatus = async () => {
      if (currentUser) {
        const {
          data: likeData,
          error: likeError,
          status,
        } = await supabase.from('Interests').select('*').eq('user_id', currentUser.user_id).eq('post_id', postId);

        if (likeError) {
          if (status !== 406) {
            console.error('Error checking like status:', likeError.message);
            setToast({ state: 'error', message: '좋아요 상태를 확인하는 중 오류가 발생했습니다.' });
          }
        } else if (likeData && likeData.length > 0) {
          setLiked(true);
        }
      }
    };

    void checkLikeStatus();
  }, [currentUser, postId]);

  const handleLike = async () => {
    if (!currentUser) {
      setToast({ state: 'error', message: '로그인이 필요합니다!' });
      return;
    }

    if (!liked) {
      const { error } = await supabase.from('Interests').insert({
        user_id: currentUser.user_id,
        post_id: postId,
        category,
      });
      if (error) {
        setToast({ state: 'error', message: '좋아요 등록 중 오류가 발생했습니다.' });
        console.error('Error liking post:', error.message);
      } else {
        setLiked(true);
        setToast({ state: 'success', message: '게시글을 좋아요 했습니다!' });
      }
    } else {
      const { error } = await supabase
        .from('Interests')
        .delete()
        .eq('user_id', currentUser.user_id)
        .eq('post_id', postId);
      if (error) {
        setToast({ state: 'error', message: '좋아요 취소 중 오류가 발생했습니다.' });
        console.error('Error unliking post:', error.message);
      } else {
        setLiked(false);
        setToast({ state: 'success', message: '게시글 좋아요를 취소했습니다.' });

        if (onRemoveBookmark) {
          onRemoveBookmark(postId);
        }
      }
    }
  };

  return (
    <>
      <button type="button" onClick={() => void handleLike()} className="flex items-center justify-end w-[30px]">
        <svg width="20" height="20" viewBox="0 0 22 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M17.2867 0H4.71526C2.04384 0 0 2.08 0 4.8V30.4C0 30.72 0 30.88 0.15812 31.2C0.629548 32 1.57241 32.16 2.35812 31.84L11.0005 26.72L19.6433 31.84C19.9581 32 20.1153 32 20.4291 32C21.372 32 22.0005 31.36 22.0005 30.4V4.8C22.0005 2.08 19.9581 0 17.2867 0Z"
            fill={liked ? '#C3E88D' : '#5E5E5E'}
          />
        </svg>
      </button>
      {toast && (
        <Toast
          state={toast.state}
          message={toast.message}
          onClear={() => setToast(null)}
        />
      )}
    </>
  );
};

export default LikeButton;
