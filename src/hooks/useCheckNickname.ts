import { useEffect, useState } from "react";
import { doubleCheckNickname } from "@/components/MyPage/MyInfo/actions/doubleCheckNickname";

const useCheckNickname = (nickname: string | undefined) => {
  const [result, setResult] = useState<null | { valid: boolean; message: string }>(null);
  const isEmpty = (nickname ?? "").trim() === "";

  useEffect(() => {
    // 닉네임이 비어있으면 검사 초기화
    if (isEmpty) {
      setResult(null);
      return;
    }

    // 서버 액션을 통해 닉네임 검사 실행
    const checkNickname = async () => {
      const res = await doubleCheckNickname(nickname!); // nickname은 이 시점에 undefined 아님
      setResult(res);
    };
    
    // 디바운스 처리
    const timer = setTimeout(() => {
      void checkNickname();
    }, 300);

     // 닉네임이 변경될 때 이전 타이머 제거
    return () => clearTimeout(timer);
  }, [nickname]);

  return { result, isEmpty };
};

export default useCheckNickname;