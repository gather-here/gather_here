// // 회원가입 상태와 관련된 로직을 훅으로 분리
// import { useState, useCallback } from "react";

// export const useSignupForm = () => {
//   const [step, setStep] = useState<number>(1);
//   const [job_title, setJobTitle] = useState<string>("");
//   const [experience, setExperience] = useState<string>("");
//   const [nickname, setNickname] = useState<string>("");
//   const [blog, setBlog] = useState<string>("");
//   const [profile_image_url, setProfileImageUrl] = useState<string>("");

//   // 범용적인 상태 업데이트 함수
//   const updateField = (field: string, value: string) => {
//     switch (field) {
//       case "experience":
//         setExperience(value);
//         break;
//       case "nickname":
//         setNickname(value);
//         break;
//       case "blog":
//         setBlog(value);
//         break;
//       case "profile_image_url":
//         setProfileImageUrl(value);
//         break;
//       default:
//         console.warn(`Unknown field: ${field}`);
//     }
//   };

//   const nextStep = () => setStep((prevStep) => prevStep + 1);
//   const prevStep = () => setStep((prevStep) => prevStep - 1);

//   // 회원가입 관련 상태 초기화
//   const resetSignupUser = useCallback(() => {
//     setStep(1);
//     setJobTitle("");
//     setExperience("");
//     setNickname("");
//     setBlog("");
//     setProfileImageUrl("");
//   }, []);

//   return {
//     step,
//     job_title,
//     experience,
//     nickname,
//     blog,
//     profile_image_url,
//     setJobTitle,
//     updateField,
//     nextStep,
//     prevStep,
//     resetSignupUser,
//   };
// };