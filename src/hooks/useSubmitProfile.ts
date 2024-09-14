import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { FormValues } from "@/components/Signup/Signup03";
import { useUser } from "@/provider/UserContextProvider";  // useUser 훅을 가져옴

const supabase = createClient();

const useSubmitProfile = (setUserData: (data: any) => void) => {
  // useUser 훅을 사용하여 필요한 상태와 메서드를 가져옴
  const {
    nextStep,
    setNickname,
    setBlog,
    setUser,
    setProfileImageUrl,
    user,
    job_title,
    experience,
    profile_image_url,
  } = useUser();

  const [blogError, setBlogError] = useState<string | null>(null);
  const [blogSuccess, setBlogSuccess] = useState<string | null>(null);

  // 세션에서 사용자 정보를 가져옴
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session && session.user) {
        setUser(session.user);  // 사용자 세션 설정
        if (session.user.user_metadata?.avatar_url) {
          setProfileImageUrl(session.user.user_metadata.avatar_url);
        }
      }
    };

    fetchUser();
  }, [setUser, setProfileImageUrl]);

  // URL 유효성 검사 함수
  const validateUrl = (url: string): boolean => {
    if (!url || url.trim() === "") {
      return true;  // URL이 비어있을 때는 유효하다고 처리
    }

    // URL 유효성 검사 패턴
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" +
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,6})" +
        "(:\\d+)?(\\/[-a-z\\d%_.~+\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF@]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i",
    );
    return urlPattern.test(url);  // URL 유효성 검사 결과 반환
  };

  // 프로필 제출 함수
  const onSubmit = async (data: FormValues, nicknameAvailable: boolean | null, setError: any) => {
    const { nickname, blog } = data;

    if (!user?.email) {
      setError("nickname", { message: "유효한 이메일을 확인할 수 없습니다." });
      return;
    }

    if (nicknameAvailable === false) {
      setError("nickname", { message: "이미 사용 중인 닉네임입니다." });
      return;
    }

    let formattedBlog = blog;
    if (blog && !/^https?:\/\//i.test(blog)) {
      formattedBlog = "http://" + blog;  // HTTP가 없을 경우 붙여줌
    }

    if (formattedBlog && !validateUrl(formattedBlog)) {
      setBlogError("유효한 URL을 입력하세요.");
      setBlogSuccess(null);
      return;
    }

    setBlogError(null);  // 에러 초기화
    setBlogSuccess("유효한 URL입니다.");  // URL 성공 메시지 설정

    try {
      const { error: updateError } = await supabase
        .from("Users")
        .update({
          job_title,
          experience,
          nickname,
          blog: formattedBlog,
          email: user.email,
          profile_image_url,
        })
        .eq("user_id", user.id);

      if (updateError) {
        console.error("Error updating data:", updateError);
        setError("nickname", { message: "프로필 업데이트에 실패했습니다. 다시 시도해 주세요." });
        return;
      }

      // 닉네임과 블로그 정보 업데이트
      setNickname(nickname);
      setBlog(formattedBlog || "");

      // 상태 업데이트 (프로필 정보 저장)
      setUserData({ ...user, nickname, blog: formattedBlog, job_title, experience, profile_image_url });

      nextStep();  // 다음 단계로 이동
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("nickname", { message: "예기치 않은 오류가 발생했습니다. 다시 시도해 주세요." });
    }
  };

  return { onSubmit, blogError, blogSuccess, setBlogError, setBlogSuccess, validateUrl };
};

export default useSubmitProfile;