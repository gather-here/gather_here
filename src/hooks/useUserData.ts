// //  Supabase에서 사용자 데이터를 가져오는 로직을 훅으로 분리
// import { useState, useCallback } from "react";
// import { createClient } from "@/utils/supabase/client";
// import { User } from "@supabase/supabase-js";

// export const useUserData = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [userData, setUserData] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const supabase = createClient();

//   // Supabase로부터 사용자 정보를 가져오는 함수
//   // 인증된 사용자 정보와 추가 사용자 데이터를 함께 가져옴
//   const fetchUserAndData = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const { data, error } = await supabase.auth.getUser();  // 사용자 인증 정보 가져옴
//       if (error) throw error;

//       setUser(data.user);

//       if (data.user) {
//         // Users 테이블에서 사용자 데이터를 가져옴
//         const { data: userData, error: dataError } = await supabase
//           .from("Users")
//           .select("*")
//           .eq("user_id", data.user.id)
//           .limit(1)
//           .single();

//         if (dataError) throw dataError;

//         setUserData(userData); 
//       }
//     } catch (error) {
//       setError("Error fetching user data");
//       console.error("Error fetching user data:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // 닉네임 업데이트 함수
//   const setNickname = useCallback((nickname: string) => {
//     if (!nickname) {
//       setError("Nickname cannot be empty");
//       return;
//     }
//     setUserData((prevData: any) => ({
//       ...prevData,
//       nickname,
//     }));
//   }, []);

//   // 블로그 업데이트 함수
//   const setBlog = useCallback((blog: string) => {
//     if (!blog) {
//       setError("Blog URL cannot be empty");
//       return;
//     }
//     setUserData((prevData: any) => ({
//       ...prevData,
//       blog,
//     }));
//   }, []);

//   // 프로필 이미지 URL 업데이트 함수
//   const setProfileImageUrl = useCallback((url: string) => {
//     if (!url) {
//       setError("Profile image URL cannot be empty");
//       return;
//     }
//     setUserData((prevData: any) => ({
//       ...prevData,
//       profile_image_url: url,
//     }));
//   }, []);

//   // 사용자 데이터를 초기화하는 함수
//   const initializationUser = useCallback(() => {
//     setUserData(null);
//     setUser(null);
//     setLoading(true);
//     setError(null);
//   }, []);

//   return {
//     user,
//     setUser,
//     userData,
//     loading,
//     error,
//     setUserData,
//     fetchUserAndData,
//     setNickname,
//     setBlog,
//     setProfileImageUrl,
//     initializationUser,
//   };
// };