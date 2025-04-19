import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { User } from '@supabase/supabase-js';

export const useSessionManager = (resetAuthUser: () => Promise<void>, rememberMe: boolean, user: User | null) => {
  const router = useRouter();
  const lastActivityTimeRef = useRef<number>(Date.now()); // 마지막 사용자 활동 시간을 저장하는 변수
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null); // 자동 로그아웃 타이머를 관리하는 변수
  const activityCheckIntervalRef = useRef<NodeJS.Timeout | null>(null); // 비활성 탭 체크 타이머를 관리하는 변수
  const isCheckingRef = useRef(false);
  const activityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inactivatedAtRef = useRef<number | null>(null); // ⬅️ 비활성화 시점 저장용

  // 일정 시간 동안의 활동을 기반으로 스로틀링 주기를 결정하는 함수
  const calculateThrottleDelay = (elapsed: number) => {
    if (elapsed >= 3 * 60 * 60 * 1000) return null;         // 3시간 이상 → 로그아웃 처리
    if (elapsed >= 2 * 60 * 60 * 1000) return 60 * 60 * 1000; // 120분 경과 → 60분 후 체크
    if (elapsed >= 60 * 60 * 1000) return 60 * 60 * 1000;     // 60분 경과 → 60분 후 체크
    return 60 * 60 * 1000;                                    // 처음부터 60분 단위
  };

  // 자동 로그인 사용자는 활동 감지를 하지 않음. 대신 3시간마다 세션확인.
  useEffect(() => {
    if (!rememberMe) return;
  
    console.log("자동 로그인 활성화됨: 세션 유지 중...");
  
    const interval = setInterval(() => {
      void (async () => {
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session) {
          console.error("세션 갱신 실패:", error);
          await resetAuthUser(); // 세션 만료 시 로그아웃 처리
          } else {
          console.log("세션이 정상 유지됨.");
          }
        }) ();
        }, 3 * 60 * 60 * 1000); // 3시간마다 세션 상태확인

      return () => clearInterval(interval);
  }, [rememberMe]);

  // 사용자의 활동이 감지될 때마다 세션 타이머를 리셋하여 1시간 동안 활동이 없을 때만 로그아웃되도록 설정
  const resetSessionTimer = () => {
    if (!user) return; // 유저 없으면 아예 감지 무시

    const now = Date.now();
    // 마지막 활동 이후 10분 미만이면 무시
    if (now - lastActivityTimeRef.current < 10 * 60 * 1000) return;

    console.log("사용자 활동 감지됨: 세션 연장");
    lastActivityTimeRef.current = Date.now(); // 마지막 활동 시간 업데이트

    // 기존 세션 타이머 제거
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }

    // 3시간 후 자동 로그아웃 설정
    sessionTimeoutRef.current = setTimeout(() => {
      void (async () => {
        const timeSinceLastActivity = Date.now() - lastActivityTimeRef.current;
        
        // 3시간 동안 추가 활동이 없으면 로그아웃 처리
        if (timeSinceLastActivity >= 3 * 60 * 60 * 1000) {
          console.log("3시간 동안 활동 없음: 자동 로그아웃");
          await resetAuthUser();

          // 로그아웃 후 세션 만료 여부를 최종 확인 후 페이지 이동
          const { data } = await supabase.auth.getSession();
          if (!data.session) {
            router.push("/");
          }
        }
      })();
    }, 3 * 60 * 60 * 1000); // 3시간 후 로그아웃
  };

  // 사용자의 활동을 감지하고 동적 스로틀링을 적용하여 CPU 부담을 최소화
  useEffect(() => {
    if (rememberMe) return;
  
    // 사용자 활동 발생 시 세션 타이머를 리셋하고, 다음 감지 주기를 설정
    const handleActivity = () => {
      resetSessionTimer();
  
      const elapsed = Date.now() - lastActivityTimeRef.current;
      const delay = calculateThrottleDelay(elapsed) ?? 60 * 60 * 1000;
  
      // 기존 타이머가 있다면 제거
      if (activityTimerRef.current) {
        clearTimeout(activityTimerRef.current);
      }
  
      // 다음 감지 주기 설정
      activityTimerRef.current = setTimeout(() => {
        handleActivity();
      }, delay);
    };
  
    // 이벤트 리스너 등록
    const events = ["mousemove", "keydown", "mousedown", "wheel"];
    events.forEach((event) => document.addEventListener(event, handleActivity));
  
    console.log("세션 활동 감지 시작됨");
    handleActivity(); // 초기 감지 1회 실행
  
    return () => {
      
      events.forEach((event) => document.removeEventListener(event, handleActivity)); // 이벤트 리스너 제거
  
      // 타이머 제거
      if (activityTimerRef.current) {
        clearTimeout(activityTimerRef.current);
      }
  
      // 세션 타이머 제거
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
    };
  }, [rememberMe]);

  // 사용자가 탭을 비활성화할 경우, 동적 스로틀링을 적용하여 감지 간격을 점진적으로 증가
  useEffect(() => {
    if (!rememberMe && user) {
  
      const handleVisibilityChange = () => {
        // 1. 탭이 비활성화되었을 때
        if (document.hidden && !activityCheckIntervalRef.current && !isCheckingRef.current) {
          inactivatedAtRef.current = Date.now(); // 활성화 시점 기록
          isCheckingRef.current = true;
  
          console.log("탭이 비활성화됨: 로그아웃 감지 타이머 시작");
  
          activityCheckIntervalRef.current = setTimeout(() => {
            const now = Date.now();
            const inactiveDuration = now - (inactivatedAtRef.current ?? now);
  
            // 정확히 60분 이상 지난 경우에만 startInactivityCheck 시작
            if (inactiveDuration >= 60 * 60 * 1000) {
              console.log("60분 경과됨: 로그아웃 감지 루틴 시작");
  
              let elapsedInactiveTime = inactiveDuration;
  
              const startInactivityCheck = () => {
                const delay = calculateThrottleDelay(elapsedInactiveTime) ?? 60 * 60 * 1000;
                elapsedInactiveTime += delay;
  
                const timeSinceLastActivity = Date.now() - lastActivityTimeRef.current;
  
                if (timeSinceLastActivity >= 3 * 60 * 60 * 1000) {
                  console.log("3시간 동안 활동 없음: 자동 로그아웃");
                  void (async () => {
                    await resetAuthUser();
                    const { data } = await supabase.auth.getSession();
                    if (!data.session) {
                      router.push("/");
                    }
                  })();
                } else {
                  activityCheckIntervalRef.current = setTimeout(startInactivityCheck, delay);
                }
              };
  
              startInactivityCheck();
            } else {
              console.log(`아직 ${Math.floor(inactiveDuration / 60000)}분 경과됨: 감지 루틴 보류`);
              isCheckingRef.current = false;
              activityCheckIntervalRef.current = null;
            }
          }, 60 * 60 * 1000); // 1시간 후 최초 경과 확인
        }
  
        // 2. 탭이 다시 활성화되었을 때
        if (!document.hidden && activityCheckIntervalRef.current) {
          clearTimeout(activityCheckIntervalRef.current);
          activityCheckIntervalRef.current = null;
          isCheckingRef.current = false;
          inactivatedAtRef.current = null;
          console.log("탭이 다시 활성화됨: 자동 로그아웃 감지 중지");
        }
      };
  
      document.addEventListener("visibilitychange", handleVisibilityChange);
  
      return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        if (activityCheckIntervalRef.current) {
          clearTimeout(activityCheckIntervalRef.current);
          activityCheckIntervalRef.current = null;
        }
        isCheckingRef.current = false;
      };
    }
  }, [rememberMe, user, resetAuthUser, router]);

  return {};
};

