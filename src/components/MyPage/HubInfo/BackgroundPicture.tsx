"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import { useAuth } from "@/provider/user/UserAuthProvider";
import { useUserData } from "@/provider/user/UserDataProvider";
import Toast from "@/components/Common/Toast/Toast";
import ImageUploader from "@/components/Common/Images/ImageUploader";

const stripQuery = (url: string | null) => url?.split("?")[0] ?? ""; // URL에서 쿼리스트링 제거하는 유틸

const BackgroundPicture: React.FC = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null); // 현재 표시할 배경 이미지 URL 상태
  const [imageVersion, setImageVersion] = useState(0); // 캐시 무효화를 위한 버전 상태
  const defaultImage = useMemo(() => "/assets/mypage/image_upload.svg", []); // 기본 이미지 URL
  const { user } = useAuth(); // 인증된 사용자 정보
  const { userData, setUserData } = useUserData(); // 사용자 데이터 전역 상태

  // 토스트 메시지 상태
  const [toast, setToast] = useState<{
    state: "success" | "error" | "warn" | "info" | "custom";
    message: string;
  } | null>(null);

// 이미지 업로드 및 사용자 정보 업데이트
  const uploadBackgroundImage = useCallback(async (file: File | Blob) => {
    if (!user?.id) {
      console.error("사용자 정보가 없습니다.");
      return;
    }

    try {
      // 파일 이름 및 업로드 경로 생성
      const fileName = `background_${btoa(user.id)}.png`;
      const path = `backgroundImages/${fileName}`;

      // Supabase Storage에 파일 업로드
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(path, file, { upsert: true });

      if (uploadError) throw new Error(uploadError.message);

      // public URL 가져오기
      const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(path);
      const publicUrl = publicUrlData.publicUrl;

      if (!publicUrl) throw new Error("배경 이미지 URL을 얻지 못했습니다.");

      // Supabase DB에는 쿼리 없는 순수 URL 저장
      const { error: updateError } = await supabase
        .from("Users")
        .update({ background_image_url: publicUrl })
        .eq("user_id", user.id);


      if (updateError) throw new Error(updateError.message);

      // 상태 업데이트: UI용 쿼리스트링은 렌더링에만 사용
      setBackgroundImage(publicUrl);
      setImageVersion((prev) => prev + 1);
      setUserData((prev) => prev ? { ...prev, background_image_url: publicUrl } : prev);

      setToast({ state: "success", message: "배경 이미지 업데이트 완료되었습니다." });
    } catch (e) {
      console.error(e);
      setToast({ state: "error", message: "배경 이미지 업데이트에 실패했습니다." }); 
    }
  }, [user?.id, setUserData]);

  // 전역 상태에 있는 배경 이미지 URL을 로컬 상태로 반영
  useEffect(() => {
    const strippedLocal = stripQuery(backgroundImage); // 현재 로컬 상태의 이미지 URL
    const strippedRemote = stripQuery(userData?.background_image_url ?? ""); // UserDataProvider의 이미지 URL 
  
    if (!strippedLocal && strippedRemote) {
      // 초기 로딩 상태일 때만 반영
      setBackgroundImage(userData?.background_image_url ?? null);
    }
  }, [userData]);

  return (
    <div className="px-6 pt-6 pb-10 s:p-0 s:pb-4">
      <label className="block text-subtitle font-baseBold text-labelNeutral mb-5">커버 이미지</label>

      {/* 이미지 업로더 컴포넌트 */}
      <ImageUploader
        imageUrl={
          backgroundImage
            ? `${backgroundImage}?v=${imageVersion}`
            : defaultImage
        }
        onUpload={uploadBackgroundImage}
        onError={(msg) => setToast({ state: "error", message: msg })}
      />


      {/* 토스트 메시지 표시 */}
      {toast && (
        <Toast
          state={toast.state}
          message={toast.message}
          onClear={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default BackgroundPicture;