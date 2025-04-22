"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import useCheckNickname from "@/hooks/useCheckNickname";
import useSubmitProfile from "@/hooks/useSubmitProfile"; 
import { useSignup } from "@/provider/user/UserSignupProvider";
import { useUserData } from "@/provider/user/UserDataProvider";

export interface FormValues {
  nickname: string; 
  job_title: string;
  experience: string;
}

const Signup03: React.FC = () => {
  const { prevStep } = useSignup();
  const { setUserData } = useUserData();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<FormValues>(); 

  const watchNickname = watch("nickname");
  const { result: nicknameAvailable, isEmpty } = useCheckNickname(watchNickname);
  const { onSubmit } = useSubmitProfile(setUserData);

  const onSubmitForm: SubmitHandler<FormValues> = async (data: FormValues) => {
    const isValid = nicknameAvailable?.valid ?? false;
  
    if (!isValid) {
      setError("nickname", {
        message: nicknameAvailable?.message ?? "닉네임 확인이 필요합니다.",
      });
      return;
    }
  
    await onSubmit(data, isValid, setError);
  };

  const handleConfirmSkip = async () => {
    document.body.classList.remove("page-disabled");
    await handleSubmit(onSubmitForm)();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black bg-opacity-50" style={{ marginTop: '-30px' }}>
      <div className="s:w-[370px] s:h-[580px] w-[430px] h-[610px] relative bg-background rounded-[20px] p-4 select-none border border-background shadow-lg">
        {prevStep && (
          <button 
            onClick={prevStep} 
            className="absolute left-9 top-10 text-primary transition-transform duration-300 ease-in-out hover:text-[white] hover:scale-110"
          >
            &larr;
          </button>
        )}

        <div className="absolute left-1/2 transform -translate-x-1/2 top-4 flex space-x-2">
          <div className="w-[136px] s:h-18 h-20 justify-start items-center gap-2 inline-flex">
            <div className="w-10 h-10 p-2.5 rounded-[11px] border border-[#28282a] flex justify-center items-center">
              <span className="text-[#5e5e5e] text-sm font-medium">1</span>
            </div>
            <div className="w-10 h-10 p-2.5 rounded-[11px] border border-[#28282a] flex justify-center items-center">
              <span className="text-[#5e5e5e] text-sm font-medium">2</span>
            </div>
            <div className="w-10 h-10 p-2.5 rounded-[11px] border border-[#c3e88d] flex justify-center items-center">
              <span className="text-[#c3e88d] text-sm font-medium">3</span>
            </div>
          </div>
        </div>

        <div className="text-center text-2xl font-medium text-white leading-9 mt-20">
          거의 다 왔어요!
        </div>
        <div className="text-center text-[#9a9a9a] s:mt-1 mt-3">
          커뮤니티에서 나를 나타낼 이름을 설정해 주세요. <br /> 기억하기 쉬운 닉네임일수록 좋아요!
        </div>

        <form onSubmit={(e) => { e.preventDefault(); void handleConfirmSkip(); }} className="max-h-[380px] s:mt-26 mt-20">
          {/* 닉네임  */}
          <div className="s:mt-6 mt-9">
            <label className="block text-sm ml-5 font-medium text-[#bebec1]">
              닉네임 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="닉네임을 입력해주세요"
              {...register("nickname", {
                required: "닉네임을 입력해주세요.",
              })}
              className={`
                block focus:outline-primaryHeavy s:w-[300px] w-[350px] s:mt-1 mt-3 ml-5 h-[50px] p-2
                bg-background rounded-xl border-2
                ${
                  isEmpty || nicknameAvailable?.valid === false
                    ? "border-statusDestructive"
                    : "border-fillLight"
                }
              `}
            />
            {/* 서버 메시지 or react-hook-form 메시지 */}
            {errors.nickname?.message && (
              <p className="text-xs text-statusDestructive mt-2 ml-5">{errors.nickname.message}</p>
            )}
            {!errors.nickname?.message && nicknameAvailable?.message && (
              <p className={`text-xs mt-2 ml-5 ${nicknameAvailable.valid ? "text-statusPositive" : "text-statusDestructive"}`}>
                {nicknameAvailable.message}
              </p>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex justify-center items-center s:mt-10 mt-12">
            <button
              type="submit"
              className={`
                s:w-[300px] w-[350px] h-[45px] mt-24 py-3 flex justify-center items-center rounded-2xl
                transition-transform transform hover:scale-105 active:scale-95 active:bg-gray-800 active:text-gray-200
                bg-[#343437]
                ${
                  watchNickname && watchNickname.trim() !== "" && nicknameAvailable?.valid
                    ? "text-[#C3E88D]"
                    : "text-[#FFFFFF]"
                }
              `}
              disabled={!watchNickname || watchNickname.trim() === "" || !nicknameAvailable?.valid}
            >
              등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup03;