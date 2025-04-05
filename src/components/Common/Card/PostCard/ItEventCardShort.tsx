'use client';

import React, { useEffect, useState } from 'react';
import { Tables } from '@/types/supabase';
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import LikeButton from '@/components/EventsDetail/ITLikeButton';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { useUserData } from '@/provider/user/UserDataProvider';

interface EventsCardProps {
  post: Tables<'IT_Events'>;
  style?: React.CSSProperties;
  onRemoveBookmark?: () => void;
}

const ItEventCardShort: NextPage<EventsCardProps> = ({ post, onRemoveBookmark }) => {
  const { userData } = useUserData();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const deadlineDate = new Date(post.date_done);
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
  }, []);

  dayjs.locale('ko');

  return (
    <article className="w-full h-full max-w-container-l m:max-w-container-m s:max-w-container-s">
      <div className="p-4 h-[261px] text-center bg-fillStrong rounded-2xl">
        {isMounted ? (
          <ul className="flex justify-between items-center">
            <li>
              <span className="label-secondary rounded-full text-baseS px-3 py-1.5">{displayDaysLeft}</span>
            </li>
            <li>
              <time dateTime={post.date_done} className="text-baseS text-labelNormal">
                {dayjs(post.apply_done).format('YY.MM.DD (ddd)')}
              </time>
            </li>
            <LikeButton eventId={post.event_id} currentUser={userData} onRemoveBookmark={onRemoveBookmark} />
          </ul>
        ) : null}
        <Link href={`/eventsdetail/${post.event_id}`}>
          <section>
            <h2 className="text-left text-subtitle font-base truncate mt-5 mb-1 text-labelStrong">{post.title}</h2>
            <div className="flex items-center justify-start mb-2 text-left">
              <svg
                className="mr-1"
                width="10"
                height="12"
                viewBox="0 0 10 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.99996 0C6.30978 0 7.56595 0.520324 8.49213 1.44651C9.41831 2.37269 9.93864 3.62886 9.93864 4.93868C9.93864 7.02559 8.47223 9.29991 5.5774 11.786C5.41644 11.9242 5.21121 12.0002 4.99901 12C4.78681 11.9998 4.58172 11.9235 4.42099 11.785L4.22952 11.6188C1.46285 9.19759 0.0612793 6.97899 0.0612793 4.93868C0.0612793 3.62886 0.581603 2.37269 1.50778 1.44651C2.43397 0.520324 3.69014 0 4.99996 0ZM4.99996 3.03919C4.49618 3.03919 4.01304 3.23931 3.65681 3.59554C3.30059 3.95176 3.10047 4.4349 3.10047 4.93868C3.10047 5.44245 3.30059 5.9256 3.65681 6.28182C4.01304 6.63805 4.49618 6.83817 4.99996 6.83817C5.50374 6.83817 5.98688 6.63805 6.3431 6.28182C6.69933 5.9256 6.89945 5.44245 6.89945 4.93868C6.89945 4.4349 6.69933 3.95176 6.3431 3.59554C5.98688 3.23931 5.50374 3.03919 4.99996 3.03919Z"
                  fill="#919191"
                  fillOpacity="0.32"
                />
              </svg>
              <p className="text-baseS text-labelNeutral">{post.location}</p>
            </div>
            <div className="w-full h-[125px] xs:h-[110px] bg-fillNeutral shadow-custom rounded-2xl">
              <Image
                src={post.img_url}
                alt="행사 이미지"
                className="w-full h-full object-cover rounded-2xl"
                width={184}
                height={125}
              />
            </div>
          </section>
        </Link>
      </div>
    </article>
  );
};

export default ItEventCardShort;
