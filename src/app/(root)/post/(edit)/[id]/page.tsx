"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import FormInput from "@/components/MainDetail/FormInput";
import FormDropdown from "@/components/MainDetail/FormDropdown";
import FormMultiSelect from "@/components/MainDetail/FormMultiSelect";
import ReactQuillEditor from "@/components/MainDetail/ReactQuillEditor";
import "react-quill/dist/quill.snow.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

interface Option {
  value: string;
  label: string;
}

const supabase = createClient();

const PostEditPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split("/").pop() as string;

  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [totalMembers, setTotalMembers] = useState<string>("");
  const [personalLink, setPersonalLink] = useState<string>("");
  const [targetPosition, setTargetPosition] = useState<Option[]>([]);
  const [recruitments, setRecruitments] = useState<string>("");
  const [techStack, setTechStack] = useState<Option[]>([]);
  const [deadline, setDeadline] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [place, setPlace] = useState<string>("");

  useEffect(() => {
    const fetchPostData = async () => {
      if (id) {
        const { data: postData, error } = await supabase.from("Posts").select("*").eq("post_id", id).single();

        if (error) {
          console.error("Error fetching post data:", error);
          return;
        }

        setTitle(postData.title || "");
        setCategory(postData.category || "");
        setLocation(postData.location || "");
        setDuration(postData.duration?.toString() || "");
        setTotalMembers(postData.total_members?.toString() || "");
        setPersonalLink(postData.personal_link || "");
        setTargetPosition(postData.target_position?.map((pos: string) => ({ value: pos, label: pos })) || []);
        setRecruitments(postData.recruitments?.toString() || "");
        setTechStack(postData.tech_stack?.map((tech: string) => ({ value: tech, label: tech })) || []);
        setDeadline(postData.deadline || "");
        setContent(postData.content || "");
        setPlace(postData.place || "");
      }
    };

    fetchPostData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title,
      category,
      location,
      duration: Number(duration),
      total_members: Number(totalMembers),
      personal_link: personalLink,
      target_position: targetPosition.map((pos) => pos.value),
      recruitments: Number(recruitments),
      tech_stack: techStack.map((ts) => ts.value),
      deadline: deadline || "",
      content: content,
      place: place,
    };

    const { error } = await supabase.from("Posts").update(payload).eq("post_id", id);

    if (error) {
      console.error("데이터 수정 실패:", error);
      toast.error("다시 시도해주세요!");
    } else {
      toast.success("수정되었습니다!");
      router.push(`/maindetail/${id}`);
    }
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<any>>) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setter(e.target.value);
    };

  const handleMultiSelectChange =
    (setter: React.Dispatch<React.SetStateAction<Option[]>>) => (selectedOptions: Option[]) => {
      setter(selectedOptions);
    };

  const categoryOptions: Option[] = [
    { value: "스터디", label: "스터디" },
    { value: "프로젝트", label: "프로젝트" },
  ];

  const locationOptions: Option[] = [
    { value: "서울", label: "서울" },
    { value: "인천", label: "인천" },
    { value: "대전", label: "대전" },
    { value: "광주", label: "광주" },
    { value: "대구", label: "대구" },
    { value: "부산", label: "부산" },
    { value: "울산", label: "울산" },
    { value: "제주", label: "제주" },
  ];

  const durationOptions: Option[] = [
    { value: "1", label: "1개월" },
    { value: "2", label: "2개월" },
    { value: "3", label: "3개월" },
    { value: "6", label: "6개월" },
    { value: "7", label: "6개월 이상" },
  ];

  const totalMembersOptions: Option[] = [
    { value: "3", label: "3명 이하" },
    { value: "4", label: "4명" },
    { value: "5", label: "5명" },
    { value: "6", label: "6명" },
    { value: "7", label: "7명 이상" },
  ];

  const targetPositionOptions: Option[] = [
    { value: "프론트엔드", label: "프론트엔드" },
    { value: "백엔드", label: "백엔드" },
    { value: "디자이너", label: "디자이너" },
    { value: "IOS", label: "IOS" },
    { value: "안드로이드", label: "안드로이드" },
    { value: "데브옵스", label: "데브옵스" },
    { value: "PM", label: "PM" },
    { value: "기획자", label: "기획자" },
    { value: "마케터", label: "마케터" },
  ];

  const recruitmentsOptions: Option[] = [
    { value: "1", label: "1명" },
    { value: "2", label: "2명" },
    { value: "3", label: "3명" },
    { value: "4", label: "4명" },
    { value: "5", label: "5명" },
    { value: "6", label: "5명 이상" },
  ];

  const techStackOptions: Option[] = [
    { value: "AWS", label: "AWS" },
    { value: "Docker", label: "Docker" },
    { value: "Django", label: "Django" },
    { value: "Express", label: "Express" },
    { value: "Figma", label: "Figma" },
    { value: "Firebase", label: "Firebase" },
    { value: "Flutter", label: "Flutter" },
    { value: "Git", label: "Git" },
    { value: "Go", label: "Go" },
    { value: "GraphQL", label: "GraphQL" },
    { value: "Java", label: "Java" },
    { value: "Javascript", label: "Javascript" },
    { value: "Jest", label: "Jest" },
    { value: "Kotlin", label: "Kotlin" },
    { value: "Kubernetes", label: "Kubernetes" },
    { value: "MongoDB", label: "MongoDB" },
    { value: "MySQL", label: "MySQL" },
    { value: "Nestjs", label: "Nestjs" },
    { value: "Nextjs", label: "Nextjs" },
    { value: "Nodejs", label: "Nodejs" },
    { value: "Php", label: "Php" },
    { value: "Python", label: "Python" },
    { value: "React", label: "React" },
    { value: "ReactNative", label: "ReactNative" },
    { value: "Spring", label: "Spring" },
    { value: "Svelte", label: "Svelte" },
    { value: "Swift", label: "Swift" },
    { value: "TypeScript", label: "TypeScript" },
    { value: "Unity", label: "Unity" },
    { value: "Vue", label: "Vue" },
    { value: "Zeplin", label: "Zeplin" },
  ];

  const placeOptions: Option[] = [
    { value: "온라인", label: "온라인" },
    { value: "오프라인", label: "오프라인" },
    { value: "온/오프라인", label: "온/오프라인" },
  ];

  return (
    <>
      <ToastContainer />
      <div className="w-full mx-auto max-w-container-l m:max-w-container-m s:max-w-container-s bg-background text-fontWhite rounded-lg shadow-md">
        <button onClick={() => router.push("/")} className="text-labelNeutral mt-2 mb-4 flex items-center space-x-2">
          <Image src="/Common/Icons/back.png" alt="Back" width={16} height={16} />
          <span>목록으로 돌아갈게요</span>
        </button>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-fillStrong w-full mx-auto max-w-container-l m:max-w-container-m s:max-w-container-s p-4 bg-fillAlternative text-fontWhite rounded-lg shadow-md"
      >
        <div className="bg-fillStrong p-6 rounded-lg shadow-md space-y-4">
          <div className="space-y-4">
            <h2 className="text-lg text-labelNeutral font-semibold mb-2">제목</h2>
            <FormInput
              label=""
              value={title}
              onChange={handleInputChange(setTitle)}
              maxLength={30}
              placeholder="제목을 입력해주세요"
            />
          </div>
          <hr className="border-fillNeutral mb-4" />
          <h2 className="text-lg text-labelNeutral font-semibold mb-2">기본 정보</h2>
          <div className="grid grid-cols-2 gap-4">
            <FormDropdown
              label="분류"
              options={categoryOptions}
              value={category}
              onChange={handleInputChange(setCategory)}
              placeholder="분류를 선택해주세요"
            />
            <FormDropdown
              label="방식"
              options={placeOptions}
              value={place}
              onChange={handleInputChange(setPlace)}
              placeholder="진행 방식을 선택해주세요"
            />
            <FormDropdown
              label="지역"
              options={locationOptions}
              value={location}
              onChange={handleInputChange(setLocation)}
              placeholder="지역을 선택해주세요"
            />
            <FormDropdown
              label="기간"
              options={durationOptions}
              value={duration}
              onChange={handleInputChange(setDuration)}
              placeholder="기간을 선택해주세요"
            />
            <FormDropdown
              label="총 인원"
              options={totalMembersOptions}
              value={totalMembers}
              onChange={handleInputChange(setTotalMembers)}
              placeholder="총 참여 인원을 선택해주세요"
            />
            <FormInput
              label="연락 방법"
              value={personalLink}
              onChange={handleInputChange(setPersonalLink)}
              placeholder="연락 받을 링크 또는 이메일을 입력해주세요"
            />
          </div>
        </div>
        <hr className="border-fillNeutral mb-4" />

        <div className="bg-fillStrong p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-lg text-labelNeutral font-semibold mb-2">모집 정보</h2>
          <div className="grid grid-cols-2 gap-4">
            <FormMultiSelect
              label="모집 대상"
              options={targetPositionOptions}
              value={targetPosition}
              onChange={handleMultiSelectChange(setTargetPosition)}
            />
            <FormDropdown
              label="모집 인원"
              options={recruitmentsOptions}
              value={recruitments}
              onChange={handleInputChange(setRecruitments)}
              placeholder="모집 인원을 선택해주세요"
            />
            <FormMultiSelect
              label="기술 스택"
              options={techStackOptions}
              value={techStack}
              onChange={handleMultiSelectChange(setTechStack)}
            />
            <FormInput
              label="마감일"
              type="date"
              value={deadline || ""}
              onChange={handleInputChange(setDeadline)}
              placeholder="마감일을 선택해주세요"
            />
          </div>
        </div>
        <hr className="border-fillNeutral mb-4" />
        <div className="bg-fillStrong p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-lg text-labelNeutral font-semibold mb-2">상세 설명</h2>
          <ReactQuillEditor value={content} onChange={setContent} className="bg-fillAssistive text-labelNeutral" />
        </div>

        <div className="flex justify-end space-x-4">
          <button type="button" className="shared-button-gray mt-3" onClick={() => router.push("/")}>
            취소
          </button>
          <button type="submit" className="shared-button-green mt-3">
            수정
          </button>
        </div>
      </form>
    </>
  );
};

export default PostEditPage;
