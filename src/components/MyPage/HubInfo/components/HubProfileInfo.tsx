"use client";

import React, { useState } from "react";

// 플랫폼 목록
const platforms = [
  { value: "behance", label: "비핸스" },
  { value: "github", label: "깃허브" },
  { value: "instagram", label: "인스타그램" },
  { value: "brunch", label: "브런치" },
  { value: "linkedin", label: "링크드인" },
  { value: "notion", label: "노션" },
  { value: "pinterest", label: "핀터레스트" },
  { value: "medium", label: "미디엄" },
  { value: "tistory", label: "티스토리" },
  { value: "facebook", label: "페이스북" },
  { value: "youtube", label: "유튜브" },
];

// URL prefix 자동 보정
const normalizeURL = (url: string) => {
  if (!/^https?:\/\//i.test(url)) return `https://${url}`;
  return url;
};

// URL 유효성 검사
const validateURL = (url: string) => {
  try {
    new URL(normalizeURL(url));
    return true;
  } catch {
    return false;
  }
};

// 링크 필드 컴포넌트
const AdditionalLinkField = ({
  label,
  link,
  linkType,
  setLink,
  setLinkType,
  error,
}: {
  label: string;
  link: string;
  linkType: string;
  setLink: (v: string) => void;
  setLinkType: (v: string) => void;
  error: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-labelNormal mb-1">
      {label}
    </label>
    <div className="flex gap-2">
      <select
        value={linkType}
        onChange={(e) => setLinkType(e.target.value)}
        className="w-1/3 shared-select-gray-2 border-[1px] border-fillLight"
      >
        <option value="">링크 선택</option>
        {platforms.map((platform) => (
          <option key={platform.value} value={platform.value}>
            {platform.label}
          </option>
        ))}
      </select>
      <input
        type="url"
        value={link}
        onChange={(e) => setLink(normalizeURL(e.target.value))}
        placeholder="링크를 입력하세요."
        className="w-2/3 shared-input-gray-2 border-[1px] border-fillLight"
      />
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// 메인 컴포넌트
const HubProfileForm: React.FC<{
  blog: string;
  setBlog: (value: string) => void;
  firstLinkType: string;
  setFirstLinkType: (value: string) => void;
  firstLink: string;
  setFirstLink: (value: string) => void;
  secondLinkType: string;
  setSecondLinkType: (value: string) => void;
  secondLink: string;
  setSecondLink: (value: string) => void;
}> = ({
  blog,
  setBlog,
  firstLinkType,
  setFirstLinkType,
  firstLink,
  setFirstLink,
  secondLinkType,
  setSecondLinkType,
  secondLink,
  setSecondLink,
}) => {
  const [errors, setErrors] = useState({
    blog: "",
    firstLink: "",
    secondLink: "",
  });

  const [showFirstLink, setShowFirstLink] = useState(!!firstLink);
  const [showSecondLink, setShowSecondLink] = useState(!!secondLink);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = {
      blog: validateURL(blog) ? "" : "올바른 포트폴리오 링크를 입력해주세요.",
      firstLink: firstLink && !validateURL(firstLink) ? "올바른 첫 번째 링크를 입력해주세요." : "",
      secondLink: secondLink && !validateURL(secondLink) ? "올바른 두 번째 링크를 입력해주세요." : "",
    };

    setErrors(newErrors);
  };

  return (
    <form className="space-y-6 ml-2" onSubmit={handleSubmit}>
      <fieldset className="p-3 s:p-0">
        <h1 className="text-subtitle font-baseBold text-labelNeutral mb-5">URL</h1>

        {/* 필수: 포트폴리오 */}
        <label htmlFor="blog" className="block text-sm font-medium text-labelNormal mb-1">
          포트폴리오 링크<span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="url"
          id="blog"
          value={blog}
          onChange={(e) => setBlog(normalizeURL(e.target.value))}
          placeholder="포트폴리오 링크를 입력하세요."
          className={`w-full shared-input-gray-2 border-[1px] ${
            errors.blog ? "border-red-500" : "border-fillLight"
          }`}
        />
        {errors.blog && <p className="text-red-500 text-sm mt-1">{errors.blog}</p>}

        {/* 추가 링크 1 */}
        {showFirstLink ? (
          <AdditionalLinkField
            label="추가 링크"
            link={firstLink}
            linkType={firstLinkType}
            setLink={setFirstLink}
            setLinkType={setFirstLinkType}
            error={errors.firstLink}
          />
        ) : (
          <button
            type="button"
            onClick={() => setShowFirstLink(true)}
            className="text-labelNeutral hover:text-primary mt-2 text-sm flex items-center"
          >
            <span className="mr-2">+</span> 추가 링크
          </button>
        )}

        {/* 추가 링크 2 */}
        {showFirstLink && showSecondLink ? (
          <AdditionalLinkField
            label="추가 링크 2"
            link={secondLink}
            linkType={secondLinkType}
            setLink={setSecondLink}
            setLinkType={setSecondLinkType}
            error={errors.secondLink}
          />
        ) : (
          showFirstLink && !showSecondLink && (
            <button
              type="button"
              onClick={() => setShowSecondLink(true)}
              className="text-labelNeutral hover:text-primary mt-2 text-sm flex items-center"
            >
              <span className="mr-2">+</span> 추가 링크 2
            </button>
          )
        )}

        <p className="text-labelAssistive text-xs mt-2">URL은 최대 3개까지 등록 가능합니다.</p>
      </fieldset>
    </form>
  );
};

export default HubProfileForm;