'use client';

import React, { useEffect, useState } from 'react';
import { PostWithUser } from '@/types/posts/Post.type';
import Image from 'next/image';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import LikeButton from '@/components/MainDetail/LikeButton';
import { useAuth } from '@/provider/user/UserAuthProvider';
import dayjs from 'dayjs';
import { secureImageUrl } from '@/utils/imageUtils';

interface PostCardProps {
  post: PostWithUser;
  style?: React.CSSProperties;
}

const PostCardShort: React.FC<PostCardProps> = ({ post }) => {
  const { user: currentUser } = useAuth();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const deadlineDate = new Date(post.deadline);
  deadlineDate.setHours(0, 0, 0, 0);
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const daysLeft = Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const displayDaysLeft = daysLeft === 0 ? 'D-day' : `D-${daysLeft.toFixed(0)}`;

  useEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, [post]);

  const jobTitleClassMap: Record<string, string> = {
    프론트엔드: 'text-primary',
    IOS: 'text-accentPurple',
    안드로이드: 'text-accentRed',
    PM: 'text-accentColumbia',
    기획자: 'text-accentPink',
    마케터: 'text-accentYellow',
    백엔드: 'text-accentOrange',
    디자이너: 'text-accentMaya',
    데브옵스: 'text-accentMint',
  };

  const cleanContent = DOMPurify.sanitize(post.content, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

  return (
    <div className="w-full h-full max-w-container-l m:max-w-container-m s:max-w-container-s post-card">
      <div className="p-5 h-64 text-center bg-fillStrong rounded-2xl">
        <div className="flex justify-between items-center">
          {isMounted ? (
            <ul className="flex items-center">
              <li>
                <span className="label-secondary rounded-full text-baseS  px-3 py-1.5 mr-1">{displayDaysLeft}</span>
              </li>
              <li className="text-baseS  text-labelNormal ml-2">
                <time dateTime="YYYY-MM-DD">~{dayjs(post.deadline).format('YY.MM.DD')}</time>
              </li>
            </ul>
          ) : null}
          <LikeButton postId={post.post_id} currentUser={currentUser} category={post.category} />
        </div>
        <Link href={`/maindetail/${post.post_id}`}>
          <h2 className="text-left text-subtitle font-semibold truncate mt-3 text-labelStrong">{post.title}</h2>
          <div className="hidden sm:block mt-2 mb-3 h-11 overflow-hidden text-left font-thin line-clamp-2 text-labelNeutral">
            <div dangerouslySetInnerHTML={{ __html: cleanContent }} />
          </div>
          <div className="mt-1">
            <div className="flex items-center mb-4">
              <div className="hidden sm:flex items-center">
                {post.user?.profile_image_url && (
                  <div className="relative w-7 h-7 mr-2">
                    <Image
                      src={secureImageUrl(post.user?.profile_image_url)}
                      alt="프로필 사진"
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>
                )}
                <p className="text-sm text-labelNeutral truncate">{post.user?.nickname}</p>
              </div>
            </div>
            <div className="text-subtitle xs:text-base flex items-center justify-between bg-fillNormal p-3 xs:p-2 rounded-lg truncate">
              <div className="flex-1 text-left truncate">
                {post.target_position?.length > 0 && (
                  <>
                    <span className={`${jobTitleClassMap[post.target_position[0]] || 'text-default'}`}>
                      {post.target_position[0]}
                    </span>
                    {post.target_position.length > 1 && (
                      <span className={`${jobTitleClassMap[post.target_position[0]] || 'text-default'}`}>
                        +{post.target_position.length - 1}
                      </span>
                    )}
                  </>
                )}
              </div>
              <div className={`mr-2 ${jobTitleClassMap[post.target_position?.[0]] || 'text-default'}`}>
                {post.recruitments}명
              </div>
              <div className="flex items-center">
                <Image
                  src="/assets/cardarrow.svg"
                  alt="Puzzle Icon"
                  width={10}
                  height={10}
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default PostCardShort;
