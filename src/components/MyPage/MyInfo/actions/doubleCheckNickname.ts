"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";

export async function doubleCheckNickname(nickname: string) {
  const supabase = createServerSupabaseClient();

  // 세션에서 유저 ID 가져오기
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const currentUserId = session?.user?.id;

  if (!currentUserId) {
    return {
      valid: false,
      message: "로그인이 필요합니다.",
    };
  }

  // 닉네임 정규식 검사 (2~11자, 특수문자 제외)
  const trimmed = nickname.trim();
  const regex = /^[a-zA-Z0-9가-힣_]{2,11}$/;

  if (!regex.test(trimmed)) {
    return {
      valid: false,
      message: "닉네임은 2~11자 이내의 한글, 영문, 숫자, 언더바(_)만 사용할 수 있습니다.",
    };
  }

  // 본인의 기존 닉네임인지 확인 => 중복 검사 제외 대상
  const { data: currentUserData } = await supabase
    .from("Users")
    .select("nickname")
    .eq("user_id", currentUserId)
    .single();

  if (currentUserData?.nickname === trimmed) {
    return {
      valid: true,
      message: "현재 사용 중인 닉네임입니다.",
    };
  }

  // 숫자로만 구성된 닉네임 제한
  if (/^\d+$/.test(trimmed)) {
    return {
      valid: false,
      message: "닉네임은 숫자만으로 구성할 수 없습니다.",
    };
  }

  // 숫자로 시작하는 닉네임 제한
  if (/^\d/.test(trimmed)) {
    return {
      valid: false,
      message: "닉네임은 한글 또는 영문으로 시작해야 합니다.",
    };
  }

  // 중복 확인
  const { data: existing, error } = await supabase
    .from("Users")
    .select("user_id")
    .eq("nickname", trimmed)
    .neq("user_id", currentUserId);

  if (error) {
    return {
      valid: false,
      message: "닉네임 중복 확인 중 오류가 발생했습니다.",
    };
  }

  if (existing && existing.length > 0) {
    return {
      valid: false,
      message: "이미 사용 중인 닉네임입니다.",
    };
  }

  return {
    valid: true,
    message: "사용 가능한 닉네임입니다.",
  };
}