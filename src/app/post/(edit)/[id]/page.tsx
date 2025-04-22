'use client';

import React, { useState, ChangeEvent, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import FormInput from '@/components/MainDetail/components/form/FormInput';
import FormDropdown from '@/components/MainDetail/components/form/FormDropdown';
import FormMultiSelect from '@/components/MainDetail/components/form/FormMultiSelect';
import ReactQuillEditor from '@/components/MainDetail/ReactQuillEditor';
import Toast from '@/components/Common/Toast/Toast';
import 'react-quill/dist/quill.snow.css';
import Image from 'next/image';
import { validateDraft } from '@/lib/validation';

interface Option {
  value: string;
  label: string;
}

// NOTE: 서버 컴포넌트로 변경하고, server action 사용하기
const PostEditPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split('/').pop()!;

  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [totalMembers, setTotalMembers] = useState<string>('');
  const [personalLink, setPersonalLink] = useState<string>('');
  const [targetPosition, setTargetPosition] = useState<string[]>([]);
  const [recruitments, setRecruitments] = useState<string>('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [deadline, setDeadline] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [place, setPlace] = useState<string>('');
  const [toast, setToast] = useState<{
    state: "success" | "error" | "warn" | "info" | "custom";
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchPostData = async () => {
      if (id) {
        const { data: postData, error } = await supabase.from('Posts').select('*').eq('post_id', id).single();

        if (error) {
          console.error('Error fetching post data:', error);
          return;
        }

        setTitle(postData.title ?? '');
        setCategory(postData.category ?? '');
        setLocation(postData.location ?? '');
        setDuration(postData.duration?.toString() ?? '');
        setTotalMembers(postData.total_members?.toString() ?? '');
        setPersonalLink(postData.personal_link ?? '');
        setTargetPosition(postData.target_position?.map((pos: string) => pos ?? []));
        setRecruitments(postData.recruitments?.toString() ?? '');
        setTechStack(postData.tech_stack?.map((tech: string) => tech ?? []));
        setDeadline(postData.deadline ?? '');
        setContent(postData.content ?? '');
        setPlace(postData.place ?? '');
      }
    };

    void fetchPostData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateDraft({
      title,
      category,
      location,
      duration,
      totalMembers,
      personalLink,
      // @ts-expect-error, 오류를 어떻게 처리해야할지 모르는 상황이라 일단 대기.
      targetPosition,
      recruitments,
      // @ts-expect-error, 오류를 어떻게 처리해야할지 모르는 상황이라 일단 대기.
      techStack,
      deadline,
      content,
      place,
    });

    if (validationError) {
      setToast({ state: 'error', message: validationError });
      return;
    }

    const payload = {
      title,
      category,
      location,
      duration: Number(duration),
      total_members: Number(totalMembers),
      personal_link: personalLink,
      target_position: targetPosition.map((pos) => pos),
      recruitments: Number(recruitments),
      tech_stack: techStack.map((ts) => ts),
      deadline: deadline ?? '',
      content: content,
      place: place,
    };

    const { error } = await supabase.from('Posts').update(payload).eq('post_id', id);

    if (error) {
      console.error('데이터 수정 실패:', error);
      setToast({ state: 'error', message: '다시 시도해주세요!' });
    } else {
      router.push(`/maindetail/${id}`);
    }
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setter(e.target.value);
    };

  const handleMultiSelectChange =
    (setter: React.Dispatch<React.SetStateAction<string[]>>) => (selectedOptions: string[]) => {
      setter(selectedOptions);
    };

  const handleBackClick = () => {
    if (category === '스터디') {
      router.push('/studies');
    } else if (category === '프로젝트') {
      router.push('/projects');
    } else {
      router.push('/');
    }
  };

  const categoryOptions: Option[] = [
    { value: '스터디', label: '스터디' },
    { value: '프로젝트', label: '프로젝트' },
  ];

  const locationOptions: Option[] = [
    { value: '서울', label: '서울' },
    { value: '인천', label: '인천' },
    { value: '대전', label: '대전' },
    { value: '광주', label: '광주' },
    { value: '대구', label: '대구' },
    { value: '부산', label: '부산' },
    { value: '울산', label: '울산' },
    { value: '세종', label: '세종' },
    { value: '경기', label: '경기' },
    { value: '강원', label: '강원' },
    { value: '충북', label: '충북' },
    { value: '충남', label: '충남' },
    { value: '전북', label: '전북' },
    { value: '전남', label: '전남' },
    { value: '경북', label: '경북' },
    { value: '경남', label: '경남' },
    { value: '제주', label: '제주' },
  ];

  const durationOptions: Option[] = [
    { value: '1', label: '1개월' },
    { value: '2', label: '2개월' },
    { value: '3', label: '3개월' },
    { value: '4', label: '4개월' },
    { value: '5', label: '5개월' },
    { value: '6', label: '6개월' },
    { value: '7', label: '6개월 이상' },
  ];

  const totalMembersOptions: Option[] = [
    { value: '3', label: '3명 이하' },
    { value: '4', label: '4명' },
    { value: '5', label: '5명' },
    { value: '6', label: '6명' },
    { value: '7', label: '7명' },
    { value: '8', label: '8명 이상' },
  ];

  const targetPositionOptions: Option[] = [
    { value: '프론트엔드', label: '프론트엔드' },
    { value: '백엔드', label: '백엔드' },
    { value: '디자이너', label: '디자이너' },
    { value: 'IOS', label: 'IOS' },
    { value: '안드로이드', label: '안드로이드' },
    { value: '데브옵스', label: '데브옵스' },
    { value: 'PM', label: 'PM' },
    { value: '기획자', label: '기획자' },
    { value: '마케터', label: '마케터' },
  ];

  const recruitmentsOptions: Option[] = [
    { value: '1', label: '1명' },
    { value: '2', label: '2명' },
    { value: '3', label: '3명' },
    { value: '4', label: '4명' },
    { value: '5', label: '5명' },
    { value: '6', label: '5명 이상' },
  ];

  const techStackOptions: Option[] = [
    { value: 'AWS', label: 'AWS' },
    { value: 'Docker', label: 'Docker' },
    { value: 'Django', label: 'Django' },
    { value: 'Express', label: 'Express' },
    { value: 'Figma', label: 'Figma' },
    { value: 'Firebase', label: 'Firebase' },
    { value: 'Flutter', label: 'Flutter' },
    { value: 'Git', label: 'Git' },
    { value: 'Go', label: 'Go' },
    { value: 'GraphQL', label: 'GraphQL' },
    { value: 'Java', label: 'Java' },
    { value: 'JavaScript', label: 'JavaScript' },
    { value: 'Jest', label: 'Jest' },
    { value: 'Kotlin', label: 'Kotlin' },
    { value: 'Kubernetes', label: 'Kubernetes' },
    { value: 'MongoDB', label: 'MongoDB' },
    { value: 'MySQL', label: 'MySQL' },
    { value: 'Nestjs', label: 'Nestjs' },
    { value: 'Nextjs', label: 'Nextjs' },
    { value: 'Nodejs', label: 'Nodejs' },
    { value: 'Php', label: 'Php' },
    { value: 'Python', label: 'Python' },
    { value: 'React', label: 'React' },
    { value: 'ReactNative', label: 'ReactNative' },
    { value: 'Spring', label: 'Spring' },
    { value: 'Svelte', label: 'Svelte' },
    { value: 'Swift', label: 'Swift' },
    { value: 'TypeScript', label: 'TypeScript' },
    { value: 'Unity', label: 'Unity' },
    { value: 'Vue', label: 'Vue' },
    { value: 'Zeplin', label: 'Zeplin' },
  ];

  const placeOptions: Option[] = [
    { value: '온라인', label: '온라인' },
    { value: '오프라인', label: '오프라인' },
    { value: '온/오프라인', label: '온/오프라인' },
  ];

  return (
    <>
      <form
        onSubmit={(evt) => void handleSubmit(evt)}
        className="w-full mx-auto max-w-[744px] s:max-w-container-s bg-background text-fontWhite rounded-lg mt-5"
      >
        <div className="bg-fillStrong p-5 rounded-t-lg space-y-4">
          <div className="space-y-4">
            <h2 className="text-lg text-labelNeutral font-semibold mb-2">
              제목 <span className="text-red-500">*</span>
            </h2>
            <FormInput
              label=""
              value={title}
              onChange={handleInputChange(setTitle)}
              maxLength={50}
              placeholder="제목을 입력해주세요"
            />
            <p className="text-sm text-labelNeutral">제목은 50자 내로 작성해주세요. ({title.length}/50)</p>
          </div>
          <hr className="border-fillNeutral mb-4" />
          <h2 className="text-lg text-labelNeutral font-semibold mb-2">기본 정보</h2>
          <div className="grid grid-cols-2 s:grid-cols-1 gap-4">
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
              label={
                <>
                  <span>연락 방법</span>
                  <span className="text-red-500 ml-1">*</span>
                </>
              }
              value={personalLink}
              onChange={handleInputChange(setPersonalLink)}
              placeholder="연락 받을 번호나 이메일을 입력해주세요"
            />
          </div>
        </div>
        <div className="bg-fillStrong p-5 space-y-4">
          <hr className="border-fillNeutral mt-0 mb-0" />
          <h2 className="text-lg text-labelNeutral font-semibold mb-2">모집 정보</h2>
          <div className="grid grid-cols-2 s:grid-cols-1 gap-4">
            <div className="space-y-2">
              <FormMultiSelect
                label="모집 대상"
                options={targetPositionOptions}
                value={targetPosition}
                // @ts-expect-error, 오류를 어떻게 처리해야할지 모르는 상황이라 일단 대기.
                onChange={handleMultiSelectChange(setTargetPosition)}
                placeholder="모집 대상을 선택해주세요"
              />
              <p className="text-sm text-labelNeutral">다중 선택이 가능해요.</p>
            </div>
            <FormDropdown
              label="모집 인원"
              options={recruitmentsOptions}
              value={recruitments}
              onChange={handleInputChange(setRecruitments)}
              placeholder="모집 인원을 선택해주세요"
            />
            <div className="space-y-2">
              <FormMultiSelect
                label="기술 스택"
                options={techStackOptions}
                value={techStack}
                // @ts-expect-error, 오류를 어떻게 처리해야할지 모르는 상황이라 일단 대기.
                onChange={handleMultiSelectChange(setTechStack)}
                placeholder="기술 스택을 선택해주세요"
              />
              <p className="text-sm text-labelNeutral">다중 선택이 가능해요.</p>
            </div>
            <FormInput
              label={
                <>
                  <span>마감일</span>
                  <span className="text-red-500 ml-1">*</span>
                </>
              }
              type="date"
              value={deadline ?? ''}
              onChange={handleInputChange(setDeadline)}
              placeholder="마감일을 선택해주세요"
            />
          </div>
        </div>

        <div className="bg-fillStrong p-5 rounded-b-lg space-y-4">
          <hr className="border-fillNeutral" />
          <h2 className="text-lg text-labelNeutral font-semibold mb-2">상세 설명</h2>
          <ReactQuillEditor value={content} onChange={setContent} className="bg-fillAssistive text-labelNeutral" />
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            type="button"
            onClick={handleBackClick}
            className="text-labelNeutral flex items-center space-x-2 group"
          >
            <div className="relative">
              <Image
                src="/assets/back.svg"
                alt="목록으로"
                width={24}
                height={24}
                className="transform transition-transform duration-300 group-hover:translate-x-1"
              />
            </div>
            <span>목록으로</span>
          </button>

          <div className="flex space-x-4">
            <button type="button" className="shared-button-gray mt-3" onClick={() => router.push(`/maindetail/${id}`)}>
              취소
            </button>
            <button type="submit" className="shared-button-green mt-3">
              수정
            </button>
          </div>
        </div>
      </form>
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

export default PostEditPage;
