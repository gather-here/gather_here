//MemberCard

"use client";
import { useUser } from "@/provider/UserContextProvider";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { techStacks } from "@/lib/techStacks";
import { createPortal } from "react-dom";

// MemberCardProps: 멤버 카드 컴포넌트에서 필요한 속성들을 정의하는 인터페이스
interface MemberCardProps {
  nickname: string;
  job_title: string;
  experience: string;
  description: string;
  background_image_url: string;
  profile_image_url: string;
  blog: string; // 대표 포트폴리오
  answer1: string;
  answer2: string;
  answer3: string;
  first_link_type: string; // 첫 번째 링크 타입
  first_link: string; // 첫 번째 링크
  second_link_type: string; // 두 번째 링크 타입
  second_link: string; // 두 번째 링크
  tech_stacks: string[]; // 기술 스택
  liked: boolean;
  toggleLike: (nickname: string) => void;
}

// MemberCard: 각 멤버의 정보를 카드 형태로 렌더링하는 컴포넌트
const MemberCard: React.FC<MemberCardProps> = ({
  nickname,
  job_title,
  experience,
  description,
  background_image_url,
  profile_image_url,
  blog,
  answer1,
  answer2,
  answer3,
  first_link_type,
  first_link,
  second_link_type,
  second_link,
  tech_stacks,
}) => {
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // 좋아요 상태와 함수 사용
  const { likedMembers, toggleLike } = useUser();
  const liked = likedMembers[nickname] || false;

  // 선택된 기술 스택 필터링
  const selectedTechStacks = useMemo(() => {
    return techStacks.filter((stack) => (tech_stacks || []).includes(stack.id));
  }, [tech_stacks]);

  // 소셜 링크를 useMemo로 최적화
  const socialLinks = useMemo(() => {
    const links = [{ name: "Portfolio", url: blog, icon: "/Link/link.svg" }];

    // firstLinkType에 따른 아이콘을 설정
    if (first_link_type && first_link) {
      links.push({
        name: first_link_type,
        url: first_link,
        icon: `/Link/${first_link_type}.svg`,
      });
    }

    // secondLinkType에 따른 아이콘을 설정
    if (second_link_type && second_link) {
      links.push({
        name: second_link_type,
        url: second_link,
        icon: `/Link/${second_link_type}.svg`,
      });
    }

    return links;
  }, [blog, first_link, first_link_type, second_link, second_link_type]);

  // 모달 열기 핸들러
  const openModal = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기 핸들러
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 모달이 열렸을 때 Esc 키로 모달 닫기 및 스크롤 처리
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal(); // Esc 키를 누르면 모달을 닫음
      }
    };

    if (isModalOpen) {
      // 모달이 열렸을 때 스크롤 막기
      document.body.style.overflow = "hidden";
      // Esc 키 이벤트 리스너 추가
      window.addEventListener("keydown", handleEsc);
    } else {
      // 모달이 닫히면 스크롤 복구
      document.body.style.overflow = "auto";
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto"; // 스크롤 복구
    };
  }, [isModalOpen, closeModal]);

  return (
    <>
      <div
        className="member-card bg-fillStrong rounded-[20px] shadow-lg relative w-[290px] h-96 flex-col z-30 user-select-none justify-start items-center gap-[78px] inline-flex"
        style={{ userSelect: "none" }}
      >
        {/* 우상단 좋아요 버튼 */}
        <div className="absolute top-3 right-3 z-10 justify-center items-center gap-2.5 flex">
          <button
            onClick={() => toggleLike(nickname)}
            className="p-1 rounded-[9px] bg-[#141415] border border-[#2d2d2f] shadow-lg transition-transform duration-200 ease-in-out transform hover:scale-110"
            style={{ userSelect: "none" }}
          >
            <Image
              src={liked ? "/assets/bookmark2.svg" : "/assets/bookmark1.svg"}
              alt="좋아요"
              width={6}
              height={6}
              className="w-6 h-6 p-1"
            />
          </button>
        </div>

        {/* 메세지 보내기 버튼 */}
        <div className="absolute bottom-[200px] p-1 z-10 right-3 justify-center items-center gap-2 inline-flex">
          <button
            className="bg-[#28282a] text-white px-3 py-2 rounded-xl hover:bg-gray-900 transition flex items-center space-x-2 group"
            style={{ userSelect: "none", cursor: "not-allowed" }}
            disabled
          >
            <Image src="/assets/chat.svg" alt="메시지 아이콘" width={20} height={20} className="w-5 h-5" />
            <span className=" text-[#c4c4c4] text-xs font-semibold font-['Pretendard'] leading-none">
              대화 신청하기
            </span>
            {/* 말풍선 */}
            <div className="absolute top-[100%] s:left-[50%] left-[65%] transform -translate-x-1/2 min-w-[140px] px-3 py-2 bg-[orange] text-black text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
              현재 개발 중인 <br /> 기능 입니다.
              <div className="absolute top-[-6px] s:left-[70%] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[orange] rotate-45"></div>
            </div>
          </button>
        </div>

        {/* 대표 포트폴리오 이미지 */}
        <div className="relative mb-4">
          <div
            className="w-full h-40 bg-gray-300 rounded-t-[20px] overflow-hidden cursor-pointer group"
            onClick={() => window.open(blog, "_blank")}
            style={{ userSelect: "none" }}
          >
            {background_image_url ? (
              <Image
                src={background_image_url}
                alt="포트폴리오"
                width={300}
                height={40}
                className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"
              />
            ) : (
              <Image
                src="/logos/hi.png"
                alt="기본 이미지"
                width={300}
                height={40}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                style={{ width: "300px", height: "auto" }}
              />
            )}
            {/* 말풍선 효과 */}
            <div className="absolute top-[-50px] left-1/2 transform -translate-x-1/2 px-3 py-2 bg-yellow-500 text-black text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
              구경하기
              <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-500 rotate-45 rounded-sm shadow-lg"></div>
            </div>
          </div>
        </div>

        {/* 프로필 이미지 */}
        <div
          className="w-30 h-30 rounded-2xl flex items-center justify-center ml-1 bg-black absolute bottom-[190px] left-4 overflow-hidden cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105"
          onClick={() => setIsProfileModalOpen(true)}
          style={{ userSelect: "none" }}
        >
          <div className="relative w-[60px] h-[60px]">
            <Image
              src={profile_image_url}
              alt={nickname}
              fill
              sizes="20vw"
              className="object-cover rounded-2xl shadow-lg"
              priority
            />
          </div>
        </div>

        {/* 프로필 이미지 확대 모달 */}
        {isProfileModalOpen &&
          createPortal(
            <div
              className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[9999]"
              onClick={() => setIsProfileModalOpen(false)}
              style={{ userSelect: "none" }}
            >
              <div className="relative">
                <Image
                  src={profile_image_url || ""}
                  alt={nickname}
                  width={500}
                  height={500}
                  className="s:w-[340px] s:h-[340px] h-[500px] w-[500px] object-cover rounded-2xl shadow-lg"
                />
                <button
                  className="absolute top-2 right-2 text-black text-2xl font-bold rounded-full p-2 hover:text-gray-800 hover:scale-110 transition-transform duration-200 ease-in-out"
                  onClick={() => setIsProfileModalOpen(false)}
                  style={{ userSelect: "none" }}
                >
                  &times;
                </button>
              </div>
            </div>,
            document.body,
          )}

        {/* 하단 멤버 정보 */}
        <div className="self-stretch pl-4 h-[234px] flex-col justify-start items-start gap-2 ml-1 flex mt-[-40px]">
          <div
            className="self-stretch h-[129px] flex-col justify-start items-start cursor-pointer gap-3 flex"
            onClick={openModal}
          >
            <div className="self-stretch justify-between items-center inline-flex">
              <div className="h-[57px] flex-col justify-start items-start gap-2 inline-flex">
                <div className="text-center text-[#f7f7f7] text-xl font-medium font-['Pretendard'] leading-7">
                  {nickname}
                </div>
                <div className="text-primary text-sm font-normal font-['Pretendard'] leading-[21px]">
                  {job_title}
                  <span className="text-[#5e5e5e] text-sm font-normal font-['Pretendard'] leading-[21px]">
                    &nbsp; |&nbsp; {experience}
                  </span>
                </div>
                <div className="self-stretch h-[41px] text-[#919191] text-sm font-normal font-['Pretendard'] leading-[21px]">
                  {description.length > 30 ? description.substring(0, 30) + "..." : description}
                </div>
              </div>
            </div>
          </div>
          {/* 포트폴리오 링크 */}
          <div className="flex justify-start space-x-4 mt-[-18px]" style={{ userSelect: "none" }}>
            {/* 대표 포트폴리오 링크 */}
            <div className="self-stretch h-8 justify-start items-center gap-2 inline-flex">
              <div className="p-1 bg-[#28282a] rounded-[9px] justify-center items-center gap-2.5 flex">
                <div className="w-6 h-6 p-1 justify-center items-center flex">
                  <Link
                    href={blog || "#"} // blog 링크
                    target="_blank"
                    className="flex flex-col items-center space-y-1 transition-transform duration-300 hover:scale-110 hover:rotate-3"
                    style={{ userSelect: "none" }}
                  >
                    <Image
                      src="/Link/link.svg" // blog는 기본적으로 link.svg 아이콘 사용
                      alt="포트폴리오"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </Link>
                </div>
              </div>

              {/* 첫 번째 링크 */}
              <div className="p-1 bg-[#28282a] rounded-[9px] justify-center items-center gap-2.5 flex">
                <div className="w-6 h-6 p-1 justify-center items-center flex">
                  <Link
                    href={first_link || "#"} // firstLink
                    target="_blank"
                    className="flex flex-col items-center space-y-1 transition-transform duration-300 hover:scale-110 hover:rotate-3"
                    style={{ userSelect: "none" }}
                  >
                    <Image
                      src={first_link_type ? `/Link/${first_link_type}.svg` : "/Link/link.svg"} // firstLinkType에 따른 아이콘
                      alt="첫 번째 링크"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </Link>
                </div>
              </div>

              {/* 두 번째 링크 */}
              <div className="p-1 bg-[#28282a] rounded-[9px] justify-center items-center gap-2.5 flex">
                <div className="w-6 h-6 p-1 justify-center items-center flex">
                  <Link
                    href={second_link || "#"} // secondLink
                    target="_blank"
                    className="flex flex-col items-center space-y-1 transition-transform duration-300 hover:scale-110 hover:rotate-3"
                    style={{ userSelect: "none" }}
                  >
                    <Image
                      src={second_link_type ? `/Link/${second_link_type}.svg` : "/Link/link.svg"} // secondLinkType에 따른 아이콘
                      alt="두 번째 링크"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 모달 창 */}
      {isModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out"
            onClick={closeModal}
            style={{ userSelect: "none" }}
          >
            <div
              className="bg-[#141415] rounded-3xl shadow-lg s:w-[400px] s:h-[600px] w-[744px] h-[800px] overflow-y-auto transform transition-transform duration-300 ease-in-out scale-95 opacity-0"
              style={{
                opacity: isModalOpen ? 1 : 0,
                transform: isModalOpen ? "scale(1)" : "scale(0.95)",
                userSelect: "none",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-[#1919a] text-3xl font-bold rounded-full p-4 hover:text-black hover:scale-110 transition-transform duration-200 ease-in-out z-50"
                onClick={closeModal}
                style={{ userSelect: "none" }}
              >
                &times;
              </button>
              {/* 대표 포트폴리오 이미지 */}
              <div
                className="relative h-[300px] bg-gray-200 rounded-t-[20px] overflow-hidden cursor-pointer"
                onClick={() => window.open(blog, "_blank")}
                style={{ userSelect: "none" }}
              >
                {background_image_url ? (
                  <Image
                    src={background_image_url}
                    alt="배경 이미지"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                ) : (
                  <Image
                    src="/logos/hi.png"
                    alt="기본 이미지"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                )}
              </div>

              {/* 프로필 정보 */}
              <div className="relative">
                <div className="absolute -top-20 flex flex-col items-start p-6">
                  <div className="w-[120px] h-[120px] rounded-2xl bg-white border-1 border-background overflow-hidden">
                    <div className="relative w-[120px] h-[120px]">
                      <Image
                        src={profile_image_url}
                        alt={nickname}
                        fill
                        sizes="24vw"
                        className="object-cover rounded-2xl shadow-lg"
                        priority
                      />
                    </div>
                  </div>
                  <div className="mt-5">
                    <h2 className="text-xl font-medium text-f7f7f7 font-['Pretendard'] leading-7">{nickname}</h2>
                    <p className="text-primary mt-1 text-sm font-normal font-['Pretendard'] leading-[21px]">
                      {job_title}
                      <span className="text-[#5e5e5e] text-sm font-normal font-['Pretendard'] leading-[21px]">
                        &nbsp; |&nbsp; {experience}
                      </span>
                    </p>
                  </div>
                </div>

                {/* 좋아요 & 1:1채팅 버튼 */}
                <div className="absolute -top-10 right-0 flex items-center space-x-4 p-6">
                  <button
                    onClick={() => toggleLike(nickname)}
                    className={`p-3 rounded-xl transition flex items-center space-x-2 ${
                      liked ? "bg-gray-800 text-white" : "bg-[#28282a] text-white"
                    } hover:bg-gray-900`}
                    style={{ userSelect: "none" }}
                  >
                    <Image
                      src={liked ? "/assets/bookmark2.svg" : "/assets/bookmark1.svg"}
                      alt="북마크"
                      width={5}
                      height={5}
                      className="w-5 h-5"
                    />
                    <span className={`hidden md:block`}>북마크 저장하기</span>
                  </button>

                  <button
                    className="bg-[#28282a] text-white px-4 py-3 rounded-xl hover:bg-gray-900 transition flex items-center space-x-2 group"
                    style={{ userSelect: "none", cursor: "not-allowed" }}
                    disabled
                  >
                    <Image src="/assets/chat.svg" alt="메시지 아이콘" width={20} height={20} className="w-5 h-5" />
                    <span className="hidden md:block">대화 신청하기</span>

                    {/* 말풍선 */}
                    <div className="absolute top-[100%] s:left-[50%] left-[65%] transform -translate-x-1/2 min-w-[140px] px-3 py-2 bg-[orange] text-black text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                      현재 개발 중인 <br /> 기능 입니다.
                      <div className="absolute top-[-6px] s:left-[70%] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[orange] rotate-45"></div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="s:w-[340px] w-[680px] border-t border-gray-500 border-opacity-40 mt-40 mx-5"></div>

              {/* 자기소개 섹션 */}
              <div className="h-[92px] justify-start p-6 items-start gap-5 inline-flex space-x-8 md:space-x-20">
                <div className="h-[29px] p-1 justify-start items-center gap-1 flex">
                  <div className="text-[#c4c4c4] text-sm font-medium font-['Pretendard'] leading-[21px]">자기소개</div>
                </div>
                <div className="s:w-[240px] md:w-[524px] flex-col justify-start items-start inline-flex">
                  <div className="self-stretch h-[92px] py-1 flex-col justify-center items-center flex">
                    <div className="self-stretch h-[84px] p-3 bg-[#19191a] rounded-xl shadow border border-[#212121] justify-between items-start inline-flex">
                      <div className="text-xs md:text-sm text-gray-300 md:h-auto h-[60px] overflow-y-auto md:overflow-y-visible leading-relaxed md:leading-normal">
                        {description}
                      </div>
                      <div className="w-6 h-6 p-1 justify-center items-center flex">
                        <div className="h-4 p-2.5"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="s:w-[340px] w-[680px] border-t border-gray-500 border-opacity-40 mx-5"
                style={{ marginTop: "50px" }}
              ></div>

              <div className="h-[411px] justify-start p-6 items-start gap-5 inline-flex space-x-6 md:space-x-16">
                <div className="h-[29px] p-2 justify-start items-center gap-1 flex">
                  <div className="text-[#c4c4c4] text-sm font-medium font-['Pretendard'] leading-[21px] whitespace-nowrap">
                    공통 질문
                  </div>
                </div>

                <div className="s:w-[240px] md:w-[524px] flex-col justify-start items-start gap-6 inline-flex">
                  <div className="self-stretch h-[121px] flex-col justify-start items-start flex">
                    <div className="self-stretch p-1 justify-start items-center gap-2 inline-flex">
                      <div className="text-[#c4c4c4] s:text-xs text-sm font-medium font-['Pretendard'] leading-[21px]">
                        1. 팀으로 일할 때 나는 어떤 팀원인지 설명해 주세요.
                      </div>
                    </div>
                    <div className="self-stretch h-[92px] py-1 flex-col justify-center items-center flex">
                      <div className="self-stretch h-[84px] p-3 bg-[#19191a] rounded-xl shadow border border-[#212121] justify-between items-start inline-flex">
                        <div className="text-xs md:text-sm text-gray-300 md:h-auto h-[60px] overflow-y-auto md:overflow-y-visible leading-relaxed md:leading-normal">
                          {answer1}
                        </div>
                        <div className="w-6 h-6 p-1 justify-center items-center flex">
                          <div className="h-4 p-2.5"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="self-stretch h-[121px] flex-col justify-start items-start flex">
                    <div className="self-stretch p-1 justify-start items-center gap-2 inline-flex">
                      <div className="text-[#c4c4c4] s:text-xs text-sm font-medium font-['Pretendard'] leading-[21px]">
                        2. 팀과 함께 목표를 이루기 위해 무엇이 가장 중요하다고 생각하는지 알려 주세요.
                      </div>
                    </div>
                    <div className="self-stretch h-[92px] py-1 flex-col justify-center items-center flex">
                      <div className="self-stretch h-[84px] p-3 bg-[#19191a] rounded-xl shadow border border-[#212121] justify-between items-start inline-flex">
                        <div className="text-xs md:text-sm text-gray-300 md:h-auto h-[60px] overflow-y-auto md:overflow-y-visible leading-relaxed md:leading-normal">
                          {answer2}
                        </div>
                        <div className="w-6 h-6 p-1 justify-center items-center flex">
                          <div className="h-4 p-2.5"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="self-stretch h-[121px] flex-col justify-start items-start flex">
                    <div className="self-stretch p-1 justify-start items-center gap-2 inline-flex">
                      <div className="text-[#c4c4c4] s:text-xs text-sm font-medium font-['Pretendard'] leading-[21px]">
                        3. 자신이 부족하다고 느낀 부분을 어떻게 보완하거나 학습해왔는지 이야기해 주세요.
                      </div>
                    </div>
                    <div className="self-stretch h-[92px] py-1 flex-col justify-center items-center flex">
                      <div className="self-stretch h-[84px] p-3 bg-[#19191a] rounded-xl shadow border border-[#212121] justify-between items-start inline-flex">
                        <div className="text-xs md:text-sm text-gray-300 md:h-auto h-[60px] overflow-y-auto md:overflow-y-visible leading-relaxed md:leading-normal">
                          {answer3}
                        </div>
                        <div className="w-6 h-6 p-1 justify-center items-center flex">
                          <div className="h-4 p-2.5"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="s:w-[340px] w-[680px] border-t border-gray-500 border-opacity-40 s:mt-[90px] mt-[54px] mx-5"></div>

              <div className="h-8 justify-start items-start p-6 gap-5 inline-flex space-x-20">
                <div className="h-[29px] p-1 justify-start items-center gap-1 flex">
                  <div className="text-[#c4c4c4] text-sm font-medium font-['Pretendard'] leading-[21px]">기술 스택</div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedTechStacks.map((stack) => (
                    <div
                      key={stack.id}
                      className="px-3 py-2 bg-[#28282a] rounded-full border border-[#2d2d2f] flex items-center gap-2"
                    >
                      <Image src={stack.image} alt={stack.name} width={12} height={12} />
                      <span className="text-white text-xs font-medium">{stack.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="w-240px border-t border-gray-500 border-opacity-40 mx-5"
                style={{ marginTop: "50px" }}
              ></div>

              <div className="h-9 justify-start items-start gap-5 inline-flex p-6 space-x-20">
                <div className="h-[29px] p-1 justify-start items-center gap-1 flex">
                  <div className="w-[52px] text-[#c4c4c4] text-sm font-medium font-['Pretendard'] leading-[21px]">
                    URL
                  </div>
                </div>

                <div className="grow shrink basis-0 h-9 justify-start items-center gap-2 flex">
                  {/* Blog 링크 */}
                  <div className="p-1 bg-[#28282a] rounded-[10px] border border-[#2d2d2f] justify-center items-center gap-2.5 flex">
                    <Link href={blog || "#"} target="_blank" className="flex justify-center items-center">
                      <Image src="/Link/link.svg" alt="Blog Link" width={24} height={24} className="w-7 h-7" />
                    </Link>
                  </div>

                  {/* 첫 번째 링크 */}
                  {first_link && (
                    <div className="p-1 bg-[#28282a] rounded-[10px] border border-[#2d2d2f] justify-center items-center gap-2.5 flex">
                      <Link href={first_link || "#"} target="_blank" className="flex justify-center items-center">
                        <Image
                          src={first_link_type ? `/Link/${first_link_type}.svg` : "/Link/link.svg"} // first_link_type에 따른 아이콘
                          alt={`${first_link_type} Link`}
                          width={24}
                          height={24}
                          className="w-7 h-7"
                        />
                      </Link>
                    </div>
                  )}

                  {/* 두 번째 링크 */}
                  {second_link && (
                    <div className="p-1 bg-[#28282a] rounded-[10px] border border-[#2d2d2f] justify-center items-center gap-2.5 flex">
                      <Link href={second_link || "#"} target="_blank" className="flex justify-center items-center">
                        <Image
                          src={second_link_type ? `/Link/${second_link_type}.svg` : "/Link/link.svg"} // second_link_type에 따른 아이콘
                          alt={`${second_link_type} Link`}
                          width={24}
                          height={24}
                          className="w-7 h-7"
                        />
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              <div
                className="w-240px border-t border-gray-500 border-opacity-10 mx-5"
                style={{ marginTop: "50px" }}
              ></div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default MemberCard;
