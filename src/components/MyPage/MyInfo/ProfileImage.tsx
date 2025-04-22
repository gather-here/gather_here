"use client";

import ImageUploader from "@/components/Common/Images/ImageUploader";
import { useUserData } from "@/provider/user/UserDataProvider";
import { updateProfileImage } from "./actions/updateProfileImage";
import { supabase } from "@/utils/supabase/client";
import Image from "next/image";
import React, { useState, useMemo, useCallback } from "react";

interface ProfileImageProps {
  onImageChange?: (url: string) => void;
  onToast: (state: "success" | "error" | "info", message: string) => void;
}

const defaultImage = "/assets/header/user.svg";
const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL!;
const stripQuery = (url: string | null) => url?.split("?")[0] ?? ""; // 쿼리 스트링 제거 유틸 함수

// 직군별 아이콘 목록
const iconOptions = [
  "프론트엔드", "백엔드", "IOS", "안드로이드", "데브옵스",
  "디자인", "PM", "기획", "마케팅",
].map((role, i) => ({
  label: role,
  url: `${imageBaseUrl}/profileicon_dark_${String(i + 1).padStart(2, "0")}.png`,
}));

const ProfileImage: React.FC<ProfileImageProps> = ({ onImageChange, onToast }) => {
  const { userData, setUserData } = useUserData();
  const [imageVersion, setImageVersion] = useState(0); // 이미지 버전 상태

  // 프로필 이미지 URL 메모이제이션
  const currentImage = useMemo(() => {
    const rawUrl = userData?.profile_image_url ?? defaultImage;
    return `${stripQuery(rawUrl)}?v=${imageVersion}`; // 쿼리 제거 후 버전 붙여서 캐시 무효화
  }, [userData?.profile_image_url, imageVersion]);

  // 이미지 업로드 처리 로직 (스토리지 업로드 후 DB 업데이트 및 상태 반영)
  const handleImageUpload = useCallback(
    async (file: File, previewUrl: string) => {
      try {
        if (!userData?.user_id) throw new Error("유저 정보 없음");

        const current = stripQuery(userData.profile_image_url);
        if (current === stripQuery(previewUrl)) {
          onToast("info", "이미 현재 프로필 이미지입니다."); // 중복 이미지 업로드 방지
          return;
        }
        const ext = "webp";
        const filename = `profile_${userData.user_id}.${ext}`;
        const path = `profileImages/${filename}`;

        const { error: uploadError } = await supabase.storage
            .from("images")
            .upload(path, file, { upsert: true }); // 기존 파일 덮어쓰기

          if (uploadError) throw new Error(uploadError.message);


        const { data } = supabase.storage.from("images").getPublicUrl(path);
        const publicUrl = data?.publicUrl;
        if (!publicUrl) throw new Error("이미지 URL 생성 실패");

        await updateProfileImage(publicUrl); // DB에는 쿼리 없는 순수 URL 저장

      // 상태 업데이트: 전역 상태와 캐시용 버전 번호 증가
      setUserData((prev) =>
        prev ? { ...prev, profile_image_url: publicUrl } : prev
      );
      setImageVersion((prev) => prev + 1); // 캐시 무효화를 위해 버전 증가
      onImageChange?.(publicUrl);

      onToast("success", "프로필 이미지가 변경되었습니다.");
    } catch (e) {
      console.error(e);
      onToast("error", "이미지 업로드에 실패했습니다.");
    }
  },
  [setUserData, userData, onImageChange, onToast]
);

  // 아이콘 클릭 시 해당 URL의 이미지를 fetch해서 업로드 처리
  const handleUploadFromUrl = async (url: string) => {
    try {
      const blob = await (await fetch(`${url}?t=${Date.now()}`)).blob(); // 캐시 우회용 t=timestamp
      const blobPreview = URL.createObjectURL(blob); // 로컬 미리보기 URL
      await handleImageUpload(blob as File, blobPreview); // previewUrl까지 전달
    } catch (err) {
      console.error(`아이콘 이미지 업로드 실패 (URL: ${url})`, err);
      onToast("error", "이미지 업로드에 실패했습니다.");
    }
  };

  return (
    <div className="border-b border-fillNormal pb-6 mb-6">
      <label className="block text-subtitle font-baseBold text-labelNeutral mb-4">프로필 사진</label>

      <div className="flex items-center gap-6">
        {/* 직접 이미지 업로드 */}
        <ImageUploader
          imageUrl={currentImage}
          onUpload={handleImageUpload}
          onError={(msg) => onToast("error", msg)}
        />

        {/* 아이콘 이미지 선택 */}
        <div className="grid grid-cols-5 s:grid-cols-3 gap-2 mb-4 max-w-[320px]">
          {iconOptions.map(({ url, label }, index) => (
            <div key={url} className="relative group">
              <button
                type="button"
                className="w-[52px] h-[52px] m:w-[48px] m:h-[48px] rounded-full m:rounded-[9px] overflow-hidden bg-fillNeutral flex items-center justify-center"
                onClick={() => void handleUploadFromUrl(url)}
              >
                <div className="w-full h-full relative">
                  <Image
                    src={url}
                    alt={label}
                    fill
                    sizes="(max-width: 768px) 100vw"
                    style={{ objectFit: "cover" }}
                    className="rounded-full m:rounded-[9px]"
                  />
                  {/* hover 시 아이콘 오버레이 */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Image
                      alt="호버시 플러스 버튼 아이콘"
                      src="/assets/mypage/hover_plus.svg"
                      width={24}
                      height={24}
                    />
                  </div>
                </div>
              </button>
              {/* 툴팁 표시 */}
              <div
                className={`absolute z-20 whitespace-nowrap py-1 px-2 min-h-6 ${
                  index < 4 ? "bottom-full mb-2" : "top-full mt-2"
                } left-1/2 transform -translate-x-1/2 bg-fillStrong text-fontWhite text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileImage;