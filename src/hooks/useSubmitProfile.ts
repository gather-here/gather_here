import { useEffect, useCallback } from "react";
import { supabase } from "@/utils/supabase/client"; 
import { FormValues } from "@/components/Signup/Signup03";
import { useSignup } from "@/provider/user/UserSignupProvider";
import { useAuth } from "@/provider/user/UserAuthProvider";
import { useUserData } from "@/provider/user/UserDataProvider";
import { defaultUserData } from "@/types/userData"; 
import type { UseFormSetError } from "react-hook-form";
import { secureImageUrl } from "@/utils/imageUtils";


const useSubmitProfile = () => {
  
  const { nextStep } = useSignup(); // 회원가입 단계 관련 상태
  const { setUser, user } = useAuth(); // 사용자 인증 관련 상태
  const { userData, setUserData } = useUserData(); // 사용자 프로필 관련 상태 및 업데이트 함수
  const profileData = userData ?? defaultUserData; // 프로필 기본값 설정

  // 프로필 이미지 URL을 context 기반으로 설정
  const setProfileImageUrl = useCallback((url: string) => {
    setUserData((prev) => ({
      ...prev ?? defaultUserData,
      profile_image_url: secureImageUrl(url),
    }));
  }, [setUserData]);

  // 세션 가져와서 유저 등록 + 프로필 이미지 반영
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          void setUser(session.user);
          const avatarUrl = (session.user.user_metadata as { avatar_url?: string })?.avatar_url;
          if (typeof avatarUrl === "string") {
            setProfileImageUrl(avatarUrl);
          }
        }
      } catch (e) {
        console.error("세션 조회 실패:", e);
      }
    };

    void fetchUser();

  }, [setUser, setProfileImageUrl]);

  // 프로필 제출 함수
  const onSubmit = async (
    data: FormValues,
    nicknameAvailable: boolean,
    setError: UseFormSetError<FormValues>
  ) => {
    const { nickname } = data;

    // 유효한 이메일 확인
    if (!user?.email) {
      setError("nickname", { message: "유효한 이메일을 확인할 수 없습니다." });
      return;
    }

    // 닉네임 중복 확인
    if (!nicknameAvailable) {
      setError("nickname", { message: "이미 사용 중인 닉네임입니다." });
      return;
    }

    try {
      // Supabase에서 사용자 데이터 업데이트
      const { error: updateError } = await supabase
        .from("Users")
        .update({
          nickname,
          job_title: profileData.job_title,
          experience: String(profileData.experience),
          email: user.email,
          profile_image_url: secureImageUrl(profileData.profile_image_url),
        })
        .eq("user_id", user.id)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating data:", updateError);
        setError("nickname", { message: "프로필 업데이트에 실패했습니다. 다시 시도해 주세요." });
        return;
      }

      // setUserData를 `UserData` 형식으로 변환하여 저장
      setUserData((prev) => ({
        ...(prev ?? defaultUserData),
        nickname,
        job_title: profileData.job_title,
        experience: String(profileData.experience),
        profile_image_url: secureImageUrl(profileData.profile_image_url),
        description: prev?.description ?? "",
        blog: prev?.blog ?? "",
      }));

      nextStep();
    } catch (err: unknown) {
      console.error("Unexpected error:", err);
      setError("nickname", { message: "예기치 않은 오류가 발생했습니다. 다시 시도해 주세요." });
    }
  };

  return { onSubmit };
};

export default useSubmitProfile;