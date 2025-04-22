"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/components/Common/Toast/Toast";
import { updateProfile } from "@/components/MyPage/MyInfo/actions/updateProfile";
import useCheckNickname from "@/hooks/useCheckNickname";
import ProfileImage from "@/components/MyPage/MyInfo/ProfileImage"; 
import { useUserData } from "@/provider/user/UserDataProvider";

interface UserProfileClientFormProps {
  initialData: {
    email: string;
    profileImageUrl: string;
    nickname: string;
    jobTitle: string;
    experience: string;
  };
}

// 폼에서 필요한 값만 추출하는 유틸 함수
const extractFormData = (form: HTMLFormElement) => {
  const formData = new FormData(form);
  return {
    nickname: formData.get("nickname") as string,
    jobTitle: formData.get("jobTitle") as string,
    experience: formData.get("experience") as string,
  };
};

  const UserProfileClientForm: React.FC<UserProfileClientFormProps> = ({ initialData }) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [toast, setToast] = useState<{
      state: "success" | "error" | "warn" | "info" | "custom";
      message: string;
    } | null>(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [nickname, setNickname] = useState(initialData.nickname);
    const { userData } = useUserData(); 
    const { result: nicknameAvailable, isEmpty } = useCheckNickname(nickname);

    // 취소 버튼 클릭 시 처리 함수
    const handleCancelClick = (e: React.FormEvent<HTMLFormElement>) => {
      const { nickname, jobTitle, experience } = extractFormData(e.currentTarget);
  
      const changed =
        nickname !== initialData.nickname ||
        jobTitle !== initialData.jobTitle ||
        experience !== initialData.experience ||
        userData?.profile_image_url !== initialData.profileImageUrl;
  
      if (changed) {
        setIsCancelModalOpen(true);
      } else {
        router.push("/");
      }
    };
  
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const { nickname, jobTitle, experience } = extractFormData(e.currentTarget);
    
      // 프로필 업데이트 비동기 처리
      startTransition(() => {
        updateProfile({
          nickname,
          jobTitle,
          experience,
          profileImageUrl: userData?.profile_image_url ?? "",
        })
        .then(() => {
          setToast({ state: "success", message: "프로필이 저장되었습니다." });
          setIsSaveModalOpen(true);
        })
        .catch((err) => {
          const message = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
          setToast({ state: "error", message });
        });
      });
    };

    return (
        <section>
          <form className="space-y-10" onSubmit={handleSubmit} onReset={handleCancelClick}>
            <fieldset>
              {/* 프로필 이미지 업로드 컴포넌트 */}
              <ProfileImage
                onToast={(state, message) => setToast({ state, message })}
              />
              {/* 닉네임, 직군, 경력 입력란 */}
              <div className="grid grid-cols-2 m:grid-cols-1 gap-10 pb-11 border-b-[1px] border-fillNormal">
                {/* 이메일 */}
                <div>
                  <label htmlFor="email" className="block text-sm text-labelDisabled font-medium mb-1">
                    이메일
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    defaultValue={initialData.email}
                    disabled
                    className="w-full shared-input-gray-2 border-[1px] border-fillLight"
                    style={{ color: "#5E5E5E" }}
                  />
                </div>
    
                {/* 닉네임 */}
                <div>
                  <label htmlFor="nickname" className="block text-baseS text-labelNormal font-medium mb-1">
                    닉네임 <span className="text-statusDestructive ml-1">*</span>
                  </label>
                  <input
                    id="nickname"
                    name="nickname"
                    type="text"
                    defaultValue={initialData.nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="닉네임을 입력해주세요."
                    className={`
                      w-full shared-input-gray-2 border
                      ${isEmpty || nicknameAvailable?.valid === false
                        ? "border-statusDestructive"
                        : "border-fillLight"}
                    `}
                  />
                  <p
                    className={`text-baseXs mt-1 ${
                      nickname && nicknameAvailable?.valid ? "text-statusPositive" : "text-statusDestructive"
                    }`}
                  >
                    {nickname && nicknameAvailable?.message}
                  </p>
                </div>
                  
                {/* 직군 */}
                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-labelNormal mb-1">
                    직군 <span className="text-statusDestructive ml-1">*</span>
                  </label>
                  <select
                    id="jobTitle"
                    name="jobTitle"
                    defaultValue={initialData.jobTitle}
                    className="w-full shared-select-gray-2 border border-fillLight"
                  >
                    <option value="">선택해주세요</option>
                    <option value="프론트엔드">프론트엔드</option>
                    <option value="백엔드">백엔드</option>
                    <option value="디자인">디자인</option>
                    <option value="IOS">IOS</option>
                    <option value="안드로이드">안드로이드</option>
                    <option value="데브옵스">데브옵스</option>
                    <option value="PM">PM</option>
                    <option value="기획">기획</option>
                    <option value="마케팅">마케팅</option>
                  </select>
                </div>
                  
                {/* 경력 */}
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-labelNormal mb-1">
                    경력 <span className="text-statusDestructive ml-1">*</span>
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    defaultValue={initialData.experience}
                    className="w-full shared-select-gray-2 border border-fillLight"
                  >
                    <option value="">선택해주세요</option>
                    <option value="1년 미만">1년 미만</option>
                    <option value="1년">1년</option>
                    <option value="2년">2년</option>
                    <option value="3년">3년</option>
                    <option value="4년">4년</option>
                    <option value="5년">5년</option>
                    <option value="6년">6년</option>
                    <option value="7년">7년</option>
                    <option value="8년 이상">8년 이상</option>
                  </select>
                </div>
              </div>
                  
              {/* 버튼 */}
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="reset"
                  disabled={isPending}
                  className="shared-button-gray w-[65px]"
                  aria-busy={isPending}
                >
                 취소
                </button>
                <button
                  type="submit"
                  disabled={
                    isPending ||
                    nickname.trim() === "" ||
                    nicknameAvailable?.valid !== true
                  }
                  className={`w-[65px] shared-button-green ${
                    isPending || nickname.trim() === "" || nicknameAvailable?.valid !== true
                      ? "!bg-fillLight !text-labelDisabled !border-fillLight !cursor-not-allowed"
                      : ""
                  }`}
                >
                  저장
                </button>
              </div>
            </fieldset>
          </form>
    
          {toast && (
            <Toast
              state={toast.state}
              message={toast.message}
              onClear={() => setToast(null)}
            />
          )}

          {isSaveModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
              <div className="bg-fillStrong p-6 rounded-xl text-center min-w-[320px]">
                <h2 className="text-lg font-baseBold text-fontWhite mb-2">저장되었습니다.</h2>
                <p className="text-labelNeutral text-baseS mb-5">변경 사항이 성공적으로 저장되었습니다.</p>
                <div className="flex gap-2 justify-center">
                  <button className="shared-button-green w-1/2" onClick={() => setIsSaveModalOpen(false)}>
                    확인
                  </button>
                  <button className="shared-button-gray w-1/2" onClick={() => router.push("/")}>
                    홈으로
                  </button>
                </div>
              </div>
            </div>
          )}
          {isCancelModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
              <div className="bg-fillStrong p-6 rounded-xl text-center min-w-[320px]">
                <h2 className="text-lg font-baseBold text-fontWhite mb-2">수정 중인 내용이 있어요.</h2>
                <p className="text-labelNeutral text-baseS mb-5">이 화면을 나가시면 변경한 내용이 저장되지 않아요.</p>
                <div className="flex gap-2 justify-center">
                  <button
                    className="shared-button-gray w-1/2"
                    onClick={() => setIsCancelModalOpen(false)}
                  >
                    마저 쓸래요
                  </button>
                  <button
                    className="shared-button-green w-1/2"
                    onClick={() => router.push("/")}
                  >
                    나갈래요
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      );
    };

export default UserProfileClientForm;