import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useUser } from "@/provider/UserContextProvider";

// fetchMembers 함수 정의
const fetchMembers = async ({ pageParam = 1 }) => {
  const response = await fetch(`/api/gatherHub?page=${pageParam}&limit=10`);
  const data = await response.json();

  return {
    members: data.members,
    nextPage: data.members.length === 10 ? pageParam + 1 : undefined,
  };
};

// MemberCardProps: 멤버 카드 컴포넌트에서 필요한 속성들을 정의하는 인터페이스
interface MemberCardProps {
  nickname: string;
  job_title: string;
  experience: string;
  description: string;
  profile_image_url: string;
  blog: string; // 대표 포트폴리오
  notionLink: string;
  instagramLink: string;
  liked: boolean;
  toggleLike: (nickname: string) => void;
}

// MemberCard: 각 멤버의 정보를 카드 형태로 렌더링하는 컴포넌트
const MemberCard: React.FC<MemberCardProps> = ({
  nickname,
  job_title,
  experience,
  description,
  profile_image_url,
  blog,
  notionLink,
  instagramLink,
}) => {

    // 좋아요 상태와 함수 사용
    const { likedMembers, toggleLike } = useUser(); 
    const liked = likedMembers[nickname] || false;

  return (
    <div className="w-[340px] h-64 p-5 bg-[#141415] rounded-3xl flex-col justify-between items-center inline-flex">
      <div className="self-stretch grow shrink basis-0 rounded-3xl flex-col justify-between items-start flex">

        {/* 상단 프로필 섹션 */}
        <div className="self-stretch justify-between items-start inline-flex">

          <div className="justify-start items-center gap-3 flex">
            {/* 프로필 이미지 */}
            <div className="relative w-20 h-20"> 
              <Image
                src={profile_image_url}
                alt={nickname}
                fill
                sizes="20vw"
                className="object-cover rounded-2xl shadow-lg"
                priority
              />
            </div>
            
            {/* 자기소개 */}
            <div className="flex-col justify-start items-start ml-2 gap-2 inline-flex">
              <div className="text-center text-[#f7f7f7] text-lg font-medium font-['Pretendard'] leading-[25.20px]">
                {nickname.length > 9 ? `${nickname.slice(0, 9)}...` : nickname}
              </div>
              <div className="self-stretch justify-start items-center gap-3 inline-flex">
                <div className="justify-start items-center gap-2 flex">
                  <div className="text-[#a0e7b8] text-sm font-normal font-['Pretendard'] leading-[21px]">{job_title}</div>
                </div>
                <div className="w-px self-stretch bg-[#28282a] rounded-[999px]"></div>
                <div className="text-[#5e5e5e] text-sm font-normal font-['Pretendard'] leading-[21px] whitespace-nowrap">{experience}</div>
              </div>
            </div>
          </div>

          {/* 북마크 */}
          <div className="member-card bg-fillStrong rounded-[20px] shadow-lg relative w-[276px] h-2 flex-col z-30 user-select-none justify-start items-center inline-flex" style={{ userSelect: 'none' }}>
            <div className="absolute top-1 right-1 z-10 justify-center items-center gap-2.5 flex">
              <button
                onClick={() => toggleLike(nickname)}
                className="p-1 rounded-[9px] bg-[#141415] border border-[#2d2d2f] shadow-lg transition-transform duration-200 ease-in-out transform hover:scale-110"
                style={{ userSelect: 'none' }} 
              >
                <Image
                  src={liked ? '/assets/bookmark2.svg' : '/assets/bookmark1.svg'}
                  alt="좋아요"
                  width={6}
                  height={6}
                  className="w-6 h-6 p-1"
                />
              </button>
            </div>
          </div>

        </div>

        {/* 자기소개 */}
        <div className="self-stretch h-[41px] flex-col mt-3 justify-center items-end flex">
          <div className="self-stretch h-[41px] text-[#919191] text-sm font-normal font-['Pretendard'] leading-[21px]">
             {description.length > 20 ? `${description.slice(0, 20)}...` : description} 
          </div>
        </div>

        {/* 포트폴리오 링크 */}
        <div className="self-stretch justify-start items-center mb-3 gap-2 inline-flex">
          <div className="p-1 bg-[#28282a] rounded-[9px] justify-center items-center gap-2.5 flex">
            <div className="w-6 h-6 p-1 justify-center items-center flex">
              <div className="w-5 h-5 justify-center items-center flex">⭐️</div>
            </div>
          </div>

          <div className="p-1 bg-[#28282a] rounded-[9px] justify-center items-center gap-2.5 flex">
            <div className="w-6 h-6 p-1 justify-center items-center flex">
              <div className="w-5 h-5 justify-center items-center flex"></div>
            </div>
          </div>

          <div className="p-1 bg-[#28282a] rounded-[9px] justify-center items-center gap-2.5 flex">
            <div className="w-6 h-6 p-1 justify-center items-center flex">
              <div className="w-5 h-5 justify-center items-center flex"></div>
            </div>
          </div>
        </div>

        {/* 버튼영역 */}
        <div className="w-[300px] h-[45px] px-4 py-2 bg-[#212121] hover:bg-gray-900 rounded-xl justify-center items-center gap-2 inline-flex"
            style={{ cursor: 'not-allowed' }} 
        >
          <button
            className="relative text-white py-3 rounded-xl transition flex items-center space-x-2 group"
            style={{ userSelect: 'none', cursor: 'not-allowed' }} 
            disabled
          >
            <Image
              src="/assets/chat.svg"
              alt="메시지 아이콘"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span className="hidden md:block">대화 시작하기</span>
            
            {/* 말풍선 */}
            <div className="absolute top-[-60px] right-[-150px] transform -translate-x-1/2 min-w-[140px] px-3 py-2 bg-[orange] text-black text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
              현재 개발 중인 <br /> 기능 입니다.
              <div className="absolute bottom-[-6px] right-[30px] transform -translate-x-1/2 w-3 h-3 bg-[orange] rotate-45"></div>
            </div>
          </button>
        </div>
        
      </div>
    </div>
   );
  };

  const AdCard: React.FC = () => {
    const settings = {
      infinite: true,
      speed: 600,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 4000,
      arrows: false,
    };
  
    const [slides, setSlides] = useState<any[]>([]);
  
    const { data, isLoading, isError } = useInfiniteQuery({
      queryKey: ["members"],
      queryFn: fetchMembers,
      getNextPageParam: (lastPage) => lastPage.nextPage,
      initialPageParam: 1,
    });
  
    useEffect(() => {
      if (data) {
        const latestMembers = data.pages.flatMap((page) => page.members).slice(0, 10);
        setSlides(latestMembers);
      }
    }, [data]);
  
    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error loading data...</p>;

  return (
    <div className="w-auto h-auto rounded-2xl my-3">
      <Slider {...settings}>
        {slides.map((member, index) => (
          <div key={index}>
            <MemberCard
              nickname={member.nickname}
              job_title={member.job_title}
              experience={member.experience}
              description={member.description}
              profile_image_url={member.profile_image_url}
              blog={member.blog}
              notionLink={member.notionLink}
              instagramLink={member.instagramLink}
              liked={false} 
              toggleLike={() => {}}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default AdCard;