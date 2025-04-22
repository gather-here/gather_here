'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import Image from 'next/image';
import LikeButton from '@/components/EventsDetail/ITLikeButton';
import ShareButton from '@/components/MainDetail/components/common/ShareButton';
import Link from 'next/link';
import { useUserData } from '@/provider/user/UserDataProvider';
import { ITEvent } from '@/types/posts/Post.type';

const EventDetailPage = () => {
  const pathname = usePathname();
  const router = useRouter();
  const eventId = pathname.split('/').pop()!;
  const [event, setEvent] = useState<ITEvent>();
  const { userData } = useUserData();

  useEffect(() => {
    const fetchEvent = async () => {
      if (eventId) {
        const { data: eventData, error: eventError } = await supabase
          .from('IT_Events')
          .select('*')
          .eq('event_id', eventId)
          .single();

        if (eventError) {
          throw Error(eventError.message);
        }

        setEvent(eventData);
      }
    };
    void fetchEvent();
  }, [eventId]);

  if (!event) return <div>에러가 발생했습니다.</div>;

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateDeadlineBadge = (deadline: string): string => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 'D-day' : `D-${diffDays}`;
  };

  const deadlineBadge = calculateDeadlineBadge(event.date_done);

  return (
    <div className="mb-8">
      <div className="w-full mx-auto max-w-[672px] s:max-w-container-s bg-background text-fontWhite rounded-lg">
        <button
          onClick={() => router.push('/events')}
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
      <div className="w-full mx-auto max-w-[672px] s:max-w-container-s p-5 bg-fillStrong text-fontWhite rounded-lg">
        <h1 className="text-title font-baseBold mb-3">{event.title}</h1>
        <div className="flex items-center ml-auto justify-between w-[60px] mb-4">
          <ShareButton />
          <LikeButton eventId={eventId} currentUser={userData} />
        </div>
        <div className="bg-fillStrong relative w-full mb-4 rounded-lg py-4 overflow-hidden">
          {event.img_url && (
            <div className="relative w-full mb-4 rounded-lg overflow-hidden" style={{ paddingTop: '56.25%' }}>
              <Image src={event.img_url} alt={event.title} fill className="object-cover" priority />
            </div>
          )}
          <h2 className="font-semibold text-lg text-labelAssistive mt-2 s:mt-4 pt-3 mb-2 s:mb-4 s:border-t-[1px] s:border-fillLight">
            행사 정보
          </h2>
          <div className="flex flex-wrap">
            <div className="w-1/2 py-3 s:py-0 s:w-full">
              <p className="mb-4 flex items-start">
                <strong className="text-labelNeutral w-[83px] flex-shrink-0 font-baseBold">분류</strong>
                <span>{event.category}</span>
              </p>
              <p className="mb-4 flex items-start">
                <strong className="text-labelNeutral w-[83px] flex-shrink-0 font-baseBold">주최</strong>
                <span>{event.host}</span>
              </p>
              <p className="mb-4 flex items-start">
                <strong className="text-labelNeutral w-[83px] flex-shrink-0 font-baseBold">일시</strong>
                <span className="leading-loose w-[200px] s:w-full">
                  {event.date_start === event.date_done
                    ? formatDate(event.date_start)
                    : `${formatDate(event.date_start)} - ${formatDate(event.date_done)}`}
                  <span className="ml-2 text-sm bg-fillLight text-primary rounded-full px-3 py-1.5 whitespace-nowrap">
                    {deadlineBadge}
                  </span>
                </span>
              </p>
              <p className="mb-4 flex items-start">
                <strong className="text-labelNeutral w-[83px] flex-shrink-0 font-baseBold">장소</strong>
                <span>{event.location}</span>
              </p>
            </div>
            <div className="w-1/2 s:w-full py-3 s:py-0 flex flex-col justify-between">
              <div>
                <p className="mb-4 flex items-start">
                  <strong className="text-labelNeutral w-24 s:w-[83px] flex-shrink-0 font-baseBold">신청 기간</strong>
                  <span className="ml-5 s:ml-0">
                    {formatDate(event.apply_start)} - {formatDate(event.apply_done)}
                  </span>
                </p>
                <p className="mb-4 flex items-start">
                  <strong className="text-labelNeutral w-24 s:w-[83px] flex-shrink-0 font-baseBold">입장 정보</strong>
                  <span className="ml-5 s:ml-0 flex flex-col">
                    <span>일반 구매자 - {event.price?.toString() || 'N/A'}원</span>
                    <span>사전 구매자 - {event.price?.toString() || 'N/A'}원</span>
                  </span>
                </p>
              </div>
            </div>
            <div className="ml-auto s:w-full s:mt-5">
              <Link
                href={event.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="shared-button-green self-end s:w-full"
              >
                <span className="mr-1">신청하러 가기</span>
                <Image src="/assets/arrowsmall.svg" alt="신청하러 가기 아이콘" width={16} height={16} />
              </Link>
            </div>
          </div>
        </div>
        <hr className="border-fillLight mb-4 s:mb-3" />
        <h2 className="text-lg text-labelAssistive font-semibold mb-5">행사 상세</h2>
        <div className="bg-fillNormal p-4 rounded-lg shadow-md">
          <p className="leading-relaxed">{event.description}</p>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
