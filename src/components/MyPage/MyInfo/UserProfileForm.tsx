import { getCurrentUserWithData } from "@/lib/server/user";
import UserProfileClientForm from "./UserProfileClientForm";

export default async function UserProfileForm() {
  const { user, userData } = await getCurrentUserWithData();

  if (!user || !userData) {
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
}