import { createServerSupabaseClient } from "@/utils/supabase/server";

export async function getCurrentUserWithData() {
  const supabase = createServerSupabaseClient();

  // 1. 유저 세션 가져오기
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, userData: null };

  // 2. 유저 상세 정보 가져오기
  const { data: userData, error } = await supabase
    .from("Users")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !userData) {
    console.error("유저 데이터 불러오기 실패:", error);
    return { user, userData: null };
  }

  return { user, userData };
}