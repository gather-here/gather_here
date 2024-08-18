"use client";
import useSignupStore from "@/store/useSignupStore";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import NicknameInput from "@/components/Signup/components/NicknameInput";
import BlogInput from "@/components/Signup/components/BlogInput";
import useCheckNickname from "@/hooks/useCheckNickname";
import useSubmitProfile from "@/hooks/useSubmitProfile";
import AlertModal from "./components/AlertModal";

export interface FormValues {
  nickname: string;
  blog?: string;
}

interface Signup03Type {
  setUserData: (data: any) => void;
}

const Signup03: React.FC<Signup03Type> = ({ setUserData }) => {
  const { prevStep } = useSignupStore();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<FormValues>();
  const watchNickname = watch("nickname");
  const nicknameAvailable = useCheckNickname(watchNickname);
  const { onSubmit, blogError, blogSuccess, setBlogError, setBlogSuccess, validateUrl } = useSubmitProfile(setUserData);

  const handleFormSubmit = (data: FormValues) => {
    document.body.classList.remove("page-disabled");

    if (!data.blog || data.blog.trim() === "") {
      AlertModal({
        title: "URL 주소가 비어 있습니다.",
        text: "URL 주소를 입력하지 않으셨습니다.\n그래도 프로필을 저장하시겠습니까?",
        icon: "warning",
        confirmButtonText: "네, 저장하기",
        cancelButtonText: "아니요, 다시 입력하기",
        onConfirm: () => onSubmit(data, nicknameAvailable, setError),
        onCancel: () => document.body.classList.add("page-disabled"),
      });
    } else {
      onSubmit(data, nicknameAvailable, setError);
    }
  };

  useEffect(() => {
    console.log(`
      .d8888888b.                        888    888                                888
     d88P"   "Y88b                       888    888                                888
     888  d8b  888                       888    888                                888
     888  888  888      .d88b.   8888b.  888888 88888b.   .d88b.  888d888          88888b.   .d88b.  888d888  .d88b.
     888  888bd88P     d88P"88b     "88b 888    888 "88b d8P  Y8b 888P"            888 "88b d8P  Y8b 888P"   d8P  Y8b
     888  Y8888P"      888  888 .d888888 888    888  888 88888888 888              888  888 88888888 888     88888888
     Y88b.     .d8     Y88b 888 888  888 Y88b.  888  888 Y8b.     888              888  888 Y8b.     888     Y8b.
      "Y88888888P"      "Y88888 "Y888888  "Y888 888  888  "Y8888  888     88888888 888  888  "Y8888  888      "Y8888
                            888
                       Y8b d88P
                        "Y88P"
       `);
  }, []);

  return (
    <div className="s:w-[370px] s:h-[590px] xs:h-[630px] w-[430px] h-[630px] relative bg-background rounded-[20px] p-4 select-none">
      {prevStep && (
        <button onClick={prevStep} className="absolute left-9 top-10 text-[c4c4c4]">
          &larr;
        </button>
      )}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-4 flex space-x-2">
        <div className="w-[136px] s:h-18 h-20 justify-start items-center gap-2 inline-flex">
          <div className="w-10 h-10 p-2.5 rounded-[11px] border border-[#28282a] flex-col justify-center items-center gap-2.5 inline-flex">
            <div className="self-stretch text-center text-[#5e5e5e] text-sm font-medium leading-[21px]">1</div>
          </div>
          <div className="w-10 h-10 p-2.5 rounded-[11px] border border-[#28282a] flex-col justify-center items-center gap-2.5 inline-flex">
            <div className="self-stretch text-center text-[#5e5e5e] text-sm font-medium leading-[21px]">2</div>
          </div>
          <div className="w-10 h-10 p-2.5 rounded-[11px] border border-[#c3e88d] flex-col justify-center items-center gap-2.5 inline-flex">
            <div className="self-stretch text-center text-[#c3e88d] text-sm font-medium leading-[21px]">3</div>
          </div>
        </div>
      </div>

      <div className="text-center text-2xl font-medium text-[#ffffff] leading-9 mt-20">거의 다 왔어요!</div>
      <div className="text-center text-[#9a9a9a] s:mt-1 mt-3">
        자신을 나타낼 수 있는 포트폴리오 링크를 알려주시면 <br className="s:hidden" /> 함께 할 동료를 만나는 데 큰
        도움이 될거예요.
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <NicknameInput register={register} errors={errors} nicknameAvailable={nicknameAvailable} watch={watch} />
        <BlogInput
          register={register}
          watch={watch}
          blogError={blogError}
          blogSuccess={blogSuccess}
          setBlogError={setBlogError}
          setBlogSuccess={setBlogSuccess}
          validateUrl={validateUrl}
        />
        <div className="s:bottom-8 bottom-9 w-full px-4 mt-9 flex justify-center items-center">
          <button
            type="submit"
            className={`s:w-[300px] w-[350px] h-[45px] py-3 flex justify-center items-center rounded-md transition-transform transform hover:scale-105 active:scale-95 active:bg-gray-800 active:text-gray-200 ${
              watchNickname && watchNickname.trim() !== ""
                ? "bg-[#C3E88D] text-[#343437] hover:bg-[#C3E88D] hover:text-[#343437]"
                : "bg-[#343437] text-[#FFFFFF]"
            }`}
          >
            프로필 저장하기
          </button>
        </div>
      </form>
    </div>
  );
};
export default Signup03;
