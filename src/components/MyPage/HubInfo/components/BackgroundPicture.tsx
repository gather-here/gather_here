"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import ProfileLoader from "@/components/Common/Skeleton/ProfileLoader";
import Image from "next/image";
import { useAuth } from "@/provider/user/UserAuthProvider";
import { useUserData } from "@/provider/user/UserDataProvider";
import Toast from "@/components/Common/Toast/Toast";
import ProfilePicture from "../MyInfo/ProfilePicture";

const BackgroundPicture: React.FC = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [backgroundAlt, setBackgroundAlt] = useState<string>("커버 이미지");
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const { userData, setUserData } = useUserData();
  const [toastState, setToastState] = useState({ state: "", message: "" });
  const defaultImage = "/assets/mypage/image_upload.svg";

  
  const uploadBackgroundImage = async (file: File | Blob, altText: string) => {
    if (!user?.id) {
      console.error("사용자 정보가 없습니다.");
      return;
    }

    setUploading(true);

    try {
      const FileName = `background_${btoa(user.id)}.png`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(`backgroundImages/${FileName}`, file, { upsert: true });
      
        if (uploadError) throw new Error(uploadError.message);

      const { data: backgroundImageUrlData } = supabase.storage
        .from("images")
        .getPublicUrl(`backgroundImages/${FileName}`);

      const backgroundImageUrl = backgroundImageUrlData.publicUrl;

      if (backgroundImageUrl) {
        const { error: updateError } = await supabase
          .from("Users")
          .update({ background_image_url: backgroundImageUrl })
          .eq("user_id", user.id);
          if (updateError) throw new Error(updateError.message);

        setBackgroundImage(backgroundImageUrl);
        setBackgroundAlt(altText);
        setUserData({
          ...userData,
          background_image_url: backgroundImageUrl ?? "",
          user_id: userData?.user_id ?? "",
          nickname: userData?.nickname ?? "",
          job_title: userData?.job_title ?? "",
          experience: userData?.experience ?? "",
          description: userData?.description ?? "",
          profile_image_url: userData?.profile_image_url ?? "",
          answer1: userData?.answer1 ?? "",
          answer2: userData?.answer2 ?? "",
          answer3: userData?.answer3 ?? "",
          blog: userData?.blog ?? "",
        });
        setToastState({ state: "success", message: "배경 이미지 업데이트 완료되었습니다." });
      } else {
        throw new Error("배경 이미지 URL을 얻지 못했습니다.");
      }
    } catch (error) {
      console.error("배경 이미지 업데이트 중 오류 발생:", error);
      setToastState({ state: "error", message: "배경 이미지 업데이트에 실패했습니다." });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) await uploadBackgroundImage(file, "커버 이미지");
  };

  const handleImageError = () => {
    setBackgroundImage(null);
    setBackgroundAlt("커버 이미지");
  };

  const handleFileUploadClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const getBackgroundImageUrl = (url: string) => {
    return url ? `${url}?${new Date().getTime()}` : defaultImage;
  };

  useEffect(() => {
    if (userData && userData.background_image_url !== backgroundImage) {
      setBackgroundImage(userData?.background_image_url ?? defaultImage);
    }
  }, [userData, backgroundImage]);


  return (
    <div>
      {user?.id ? (
        <>
          <div className="px-6 pt-6 pb-10 s:p-0 s:pb-4">
            <label className="block text-subtitle font-baseBold text-labelNeutral mb-5">커버 이미지</label>
            <div className="flex items-center flex-wrap s:mb-3 gap-5">
              <div className="w-40 h-40 m:w-40 m:h-40 s:w-40 s:h-40 rounded-[20px] overflow-hidden bg-fillLight flex items-center justify-center s:mb-3 relative group">
                {uploading ? (
                  <ProfileLoader className="w-full h-full rounded-[20px]" />
                ) : backgroundImage ? (
                  <Image
                    src={getBackgroundImageUrl(backgroundImage)}
                    alt={backgroundAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1068px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                    className="rounded-[20px]"
                    onError={handleImageError}
                    priority
                  />
                ) : (
                  <ProfileLoader className="w-full h-full rounded-[20px]" />
                )}
                {!uploading && (
                  <div className="relative group">
                    <div className="absolute inset-0 bg-black bg-opacity-50 m:group-hover:opacity-100 transition-opacity z-10"></div>
                    <button
                      type="button"
                      className="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[48px] h-[48px] bg-fillLight opacity-0 group-hover:opacity-100 z-20 rounded-[20px]"
                      onClick={handleFileUploadClick}
                    >
                      <Image
                        src="/assets/mypage/image_upload.svg"
                        alt="이미지 업로드 아이콘"
                        width={24}
                        height={24}
                        className="mx-auto"
                      />
                    </button>
                  </div>
                )}
              </div>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={(e) => void handleFileChange(e)}
                style={{ display: "none" }}
              />
            </div>
          </div>
          {toastState.state && (
            <Toast
              state={toastState.state}
              message={toastState.message}
              onClear={() => setToastState({ state: "", message: "" })}
            />
          )}
        </>
      ) : (
        <ProfilePicture />
      )}
    </div>
  );
};

export default BackgroundPicture;
