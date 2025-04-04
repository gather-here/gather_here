import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { User } from '@supabase/supabase-js';
import { throttle } from "lodash";

export const useSessionManager = (resetAuthUser: () => Promise<void>, rememberMe: boolean, user: User | null) => {
  const router = useRouter();
  const lastActivityTimeRef = useRef<number>(Date.now()); // 마지막 사용자 활동 시간을 저장하는 변수
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null); // 자동 로그아웃 타이머를 관리하는 변수
  const activityCheckIntervalRef = useRef<NodeJS.Timeout | null>(null); // 비활성 탭 체크 타이머를 관리하는 변수
  const startTimeRef = useRef<number>(Date.now()); // 사용자가 앱을 실행한 시점을 기록하는 변수

  // 일정 시간 동안의 활동을 기반으로 스로틀링 주기를 결정하는 함수
  const calculateThrottleDelay = (elapsed: number) => {
    if (elapsed > 60 * 60 * 1000) return null; // 1시간 이상 연속 활동 시 감지 중단
    if (elapsed > 30 * 60 * 1000) return 60 * 60 * 1000; // 30분 초과 시 1시간 주기
    if (elapsed > 10 * 60 * 1000) return 30 * 60 * 1000; // 10분 초과 시 30분 주기
    return 10 * 60 * 1000; // 초기값 10분
  };

  // 자동 로그인 사용자는 활동 감지를 하지 않음. 대신 55분마다 세션 갱신.
  useEffect(() => {
    if (rememberMe) {
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
        }, 55 * 60 * 1000); // 55분마다 세션 갱신 시도

      return () => clearInterval(interval);
    }
  }, [rememberMe, resetAuthUser, user]);

  // 사용자의 활동이 감지될 때마다 세션 타이머를 리셋하여 1시간 동안 활동이 없을 때만 로그아웃되도록 설정
  const resetSessionTimer = () => {
    if (!user) return; // 유저 없으면 아예 감지 무시
    console.log("사용자 활동 감지됨: 세션 연장");
    lastActivityTimeRef.current = Date.now(); // 마지막 활동 시간 업데이트

    // 기존 세션 타이머 제거
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }

    // 1시간 후 자동 로그아웃 설정
    sessionTimeoutRef.current = setTimeout(() => {
      void (async () => {
        const timeSinceLastActivity = Date.now() - lastActivityTimeRef.current;
        
        // 1시간 동안 추가 활동이 없으면 로그아웃 처리
        if (timeSinceLastActivity >= 60 * 60 * 1000) {
          console.log("1시간 동안 활동 없음: 자동 로그아웃");
          await resetAuthUser();

          // 로그아웃 후 세션 만료 여부를 최종 확인 후 페이지 이동
          const { data } = await supabase.auth.getSession();
          if (!data.session) {
            router.push("/");
          }
        }
      })();
    }, 60 * 60 * 1000); // 1시간 후 로그아웃
  };

  // 사용자의 활동을 감지하고 동적 스로틀링을 적용하여 CPU 부담을 최소화
  useEffect(() => {
    if (rememberMe) return; // 자동 로그인 사용자는 이벤트 감지 불필요

    let elapsed = Date.now() - startTimeRef.current;
    let throttleDelay = calculateThrottleDelay(elapsed);
    if (!throttleDelay) return;

    // 동적 스로틀링을 적용하여 점진적으로 감지 주기를 늘림
    const activityHandler = throttle(() => {
      resetSessionTimer();
      elapsed = Date.now() - startTimeRef.current;
      throttleDelay = calculateThrottleDelay(elapsed);
    }, throttleDelay);

    // 감지할 이벤트 등록
    const events = ["mousemove", "keydown", "mousedown", "wheel"];
    events.forEach((event) => document.addEventListener(event, activityHandler));

    return () => {
      // 이벤트 리스너 제거 및 타이머 정리
      events.forEach((event) => document.removeEventListener(event, activityHandler));
      activityHandler.cancel();
      if (sessionTimeoutRef.current) clearTimeout(sessionTimeoutRef.current);
    };
  }, [resetAuthUser, rememberMe, user]);

  // 사용자가 탭을 비활성화할 경우, 동적 스로틀링을 적용하여 감지 간격을 점진적으로 증가
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("탭이 비활성화됨: 로그아웃 감지 시작");

        let elapsedInactiveTime = 0;
        let checkDelay = 10 * 60 * 1000; // 초기 감지 간격 10분

        activityCheckIntervalRef.current = setInterval(() => {
          void (async () => {

            elapsedInactiveTime += checkDelay;
            
            // 10분 → 30분 → 60분으로 감지 간격 증가
            checkDelay = calculateThrottleDelay(elapsedInactiveTime) ?? checkDelay;
            
            const timeSinceLastActivity = Date.now() - lastActivityTimeRef.current;
            if (timeSinceLastActivity >= 60 * 60 * 1000) {
              console.log("1시간 동안 활동 없음 (비활성 탭 포함): 자동 로그아웃");
              
              await resetAuthUser();
              
              // 로그아웃 후 세션 만료 여부를 최종 확인 후 페이지 이동
              const { data } = await supabase.auth.getSession();
              if (!data.session) {
                router.push("/");
              }
            }
          })();
          }, checkDelay);
      } else {
        // 사용자가 다시 탭을 활성화하면 감지 중단
        if (activityCheckIntervalRef.current) {
          clearInterval(activityCheckIntervalRef.current);
          activityCheckIntervalRef.current = null;
          console.log("탭이 다시 활성화됨: 자동 로그아웃 감지 중지");
        }
      }
    };

    // visibilitychange 이벤트 등록
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      // 이벤트 리스너 제거 및 타이머 정리
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (activityCheckIntervalRef.current) clearInterval(activityCheckIntervalRef.current);
    };
  }, [resetAuthUser, router]);

  return {};
};

