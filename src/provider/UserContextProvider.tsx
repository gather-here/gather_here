import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { createClient } from "@/utils/supabase/client"; // Supabase 클라이언트
import { User } from "@supabase/supabase-js"; // Supabase User 타입

// 사용자 인증 상태 인터페이스
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  resetAuthUser: () => void;
}

// 사용자 데이터 상태 인터페이스
interface UserData {
  nickname: string;
  job_title: string;
  experience: string;
  profile_image_url: string;
  blog: string;
}

// 회원가입 상태 인터페이스
interface SignupState {
  step: number;
  job_title: string;
  experience: string;
  nickname: string;
  blog: string;
  profile_image_url: string;
  setField: (field: keyof SignupState, value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetSignupUser: () => void;
  setJob: (job_title: string) => void;
  setProfileImageUrl: (url: string) => void;
  setBlog: (blog: string) => void;
  setNickname: (nickname: string) => void;
}

// 전체 상태 인터페이스 (AuthState + SignupState + UserData)
interface StoreState extends AuthState, SignupState {
  userData: UserData | null;
  setUserData: (data: UserData) => void;
  fetchUserData: () => Promise<void>;
  initializationUser: () => void;
}

// Context 생성
const UserContext = createContext<StoreState | undefined>(undefined);

// Provider 컴포넌트
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const supabase = createClient(); // Supabase 클라이언트 생성

  // 사용자 인증 상태
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // 인증 여부 관리

  // 사용자 데이터 상태
  const [userData, setUserData] = useState<UserData | null>(null);  // userData 상태

  // 회원가입 상태
  const [step, setStep] = useState<number>(1);
  const [job_title, setJobTitle] = useState<string>("");
  const [experience, setExperience] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [blog, setBlog] = useState<string>("");
  const [profile_image_url, setProfileImageUrl] = useState<string>(""); 

  // 사용자 데이터 가져오기 함수
  const fetchUserData = useCallback(async () => {
    if (!user || !user.id) return;

    const { data, error } = await supabase
      .from('Users')
      .select('nickname, job_title, experience, profile_image_url, blog') 
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error('Error fetching user data:', error.message);
      return;
    }

    if (data) {
      setUserData(data as UserData);
    }
  }, [user, supabase]);

  // 사용자 인증 상태 업데이트 및 초기화
  const setAuthUser = useCallback((user: User | null) => {
    setUser(user);
    setIsAuthenticated(!!user); // user가 있으면 true, 없으면 false로 인증 상태 설정
  }, []);

  const resetAuthUser = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false); // 인증 상태 초기화
    setUserData(null); // 사용자 데이터도 초기화
  }, []);

  // 회원가입 필드 업데이트
  const setField = useCallback((field: keyof SignupState, value: string) => {
    switch (field) {
      case "job_title":
        setJobTitle(value);
        break;
      case "experience":
        setExperience(value);
        break;
      case "nickname":
        setNickname(value);
        break;
      case "blog":
        setBlog(value);
        break;
      case "profile_image_url":
        setProfileImageUrl(value);
        break;
      default:
        break;
    }
  }, []);

  // job_title 업데이트 함수 추가
  const setJob = useCallback((job_title: string) => {
    setJobTitle(job_title);
  }, []);

  // setUserData 함수 정의
  const setUserDataHandler = useCallback((data: UserData) => {
    setUserData(data);
  }, []);

  // 회원가입 단계 제어
  const nextStep = useCallback(() => setStep((prev) => prev + 1), []);
  const prevStep = useCallback(() => setStep((prev) => prev - 1), []);
  
  // 회원가입 상태 초기화
  const resetSignupUser = useCallback(() => {
    setStep(1);
    setJobTitle("");
    setExperience("");
    setNickname("");
    setBlog("");
    setProfileImageUrl("");
  }, []);

  // 사용자 상태 초기화
  const initializationUser = useCallback(() => {
    resetAuthUser();
    resetSignupUser();
  }, [resetAuthUser, resetSignupUser]);

  // Context에 제공할 값
  const contextValue: StoreState = {
    // AuthState
    user,
    isAuthenticated, // 인증 여부 추가
    setUser: setAuthUser,
    resetAuthUser,

    // 사용자 데이터
    userData,
    setUserData: setUserDataHandler,
    fetchUserData,
    initializationUser,

    // SignupState
    step,
    job_title,
    experience,
    nickname,
    blog,
    profile_image_url,
    setField,
    nextStep,
    prevStep,
    resetSignupUser,
    setJob,
    setProfileImageUrl,
    setBlog,
    setNickname, 
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

// Hook을 통한 Context 사용
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser는 UserProvider 내부에서만 사용할 수 있습니다.");
  }
  return context;
};