import { createServerSupabaseClient } from "@/utils/supabase/server";
import UserProfileClientForm from "./UserProfileClientForm";

const UserProfileForm = async () => {
  const supabase = createServerSupabaseClient();

  // 유저 세션 가져오기
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>사용자 정보를 불러올 수 없습니다.</div>;
  }

  // 유저 상세 정보 가져오기
  const { data: userData, error } = await supabase
    .from("Users")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !userData) {
    console.error("유저 데이터 불러오기 실패:", error);
    return <div>사용자 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <UserProfileClientForm
      initialData={{
        email: userData.email ?? "",
        profileImageUrl: userData.profile_image_url ?? "",
        nickname: userData.nickname ?? "",
        jobTitle: userData.job_title ?? "",
        experience: userData.experience ?? "",
      }}
    />
  );
};

export default UserProfileForm;