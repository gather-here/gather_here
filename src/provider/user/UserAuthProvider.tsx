import React, { createContext, useState, useEffect, useCallback, ReactNode, useContext } from "react";
import { supabase } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useSessionManager } from "@/hooks/useSessionManager";
import { useRouter } from "next/navigation";
import { useLikeStore } from "@/stores/useLikeStore";

// 사용자 인증 상태를 정의하는 인터페이스
interface AuthState {
  user: User | null; // 현재 로그인된 사용자 정보
  isAuthenticated: boolean; // 인증 여부 확인
  setUser: (user: User | null, rememberMe?: boolean) => Promise<void>; // 사용자 정보를 설정하는 함수
  resetAuthUser: () => Promise<void>; // 사용자 로그아웃 및 상태 초기화 함수
  authError: string | null; // 인증 과정에서 발생한 오류 메시지 저장
}

// 인증 관련 컨텍스트 생성
const AuthContext = createContext<AuthState | undefined>(undefined);

// 인증 제공 컴포넌트
export const UserAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();

  // 사용자 상태 관리
  const [user, setUserState] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  // localStorage에서 rememberMe 값 가져오기
  useEffect(() => {
    try {
      const savedRememberMe = localStorage.getItem("rememberMe");
      setRememberMe(savedRememberMe ? (JSON.parse(savedRememberMe) as boolean) : false);
    } catch (error) {
      console.error("rememberMe 상태 로드 오류:", error);
      setRememberMe(false);
    }
  }, []);

  // 사용자 정보를 설정하는 함수
  const setAuthUser = useCallback(async (user: User | null, remember = false) => {
    setUserState(user);
    setIsAuthenticated(!!user); // user가 존재하면 true, 없으면 false
    setRememberMe(remember);

    // rememberMe 값 localStorage에 저장
    localStorage.setItem("rememberMe", JSON.stringify(remember));

    // 로그인 성공 시, 좋아요 상태를 서버와 동기화
    if (user) {
      await useLikeStore.getState().syncLikesWithServer(user.id);
    }
  }, []);

  // 사용자 로그아웃 및 상태 초기화 함수
  const resetAuthUser = useCallback(async () => {
    try {
      // Supabase에서 세션을 종료
      await supabase.auth.signOut();

      // 사용자 상태 초기화
      setUserState(null);
      setIsAuthenticated(false);
      setAuthError(null);
      setRememberMe(false);

      // localStorage에서 rememberMe 값 삭제
      localStorage.removeItem("rememberMe");

      // Zustand 상태 초기화 
      useLikeStore.setState({ likedMembers: {} });

      router.push("/"); // 홈 화면으로 이동
    } catch (error) {
      console.error("Supabase 로그아웃 실패:", error);
    }
  }, [router]);

  // 자동 로그인 여부에 따라 세션을 관리하는 훅 실행
  useSessionManager(resetAuthUser, rememberMe, user);

  // 앱 로드 시, 기존 세션이 있는지 확인
  useEffect(() => {
    void (async () => {
      try {
        // 현재 세션 정보를 가져옴
        const { data, error } = await supabase.auth.getSession();

        // 세션이 만료되었거나 존재하지 않으면 로그아웃 처리
        if (error || !data.session?.user) {
          console.warn("세션 만료 또는 로그인 안 됨, 로그아웃 처리");
          await resetAuthUser();
          return;
        }

        // 유저 정보 설정
        await setAuthUser(data.session.user, rememberMe);
      } catch (error) {
        console.error("세션 확인 중 오류 발생:", error);
      }
    })();
  }, [setAuthUser, rememberMe, resetAuthUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        setUser: setAuthUser,
        resetAuthUser,
        authError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 컨텍스트를 쉽게 사용할 수 있도록 하는 훅
export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 UserAuthProvider 내부에서만 사용할 수 있습니다.");
  }
  return context;
};

