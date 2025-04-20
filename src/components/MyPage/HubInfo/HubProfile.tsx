import { createServerSupabaseClient } from "@/utils/supabase/server";
import HubProfileClientForm from "@/components/MyPage/HubInfo/HubProfileClientForm";

const HubProfile = async () => {
  // Supabase 서버 클라이언트 생성
  const supabase = createServerSupabaseClient();

  // 현재 로그인된 유저 세션 정보 가져오기
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return null; // 세션이 없는 경우 렌더링 중단

  // 해당 유저의 HubProfile 데이터 조회
  const { data, error } = await supabase
    .from("Users")
    .select(
      "hubCard, description, blog, first_link_type, first_link, second_link_type, second_link, answer1, answer2, answer3, tech_stacks"
    )
    .eq("user_id", session.user.id)
    .single();

  // 데이터 조회 실패 시 null 반환
  if (error || !data) {
    console.error("사용자 데이터를 불러오는 데 실패했습니다:", error);
    return null;
  }

  return (
    <section>
      <HubProfileClientForm
        initialIsActive={data.hubCard ?? false}
        initialData={{
          description: data.description ?? "",
          blog: data.blog ?? "",
          firstLinkType: data.first_link_type ?? "",
          firstLink: data.first_link ?? "",
          secondLinkType: data.second_link_type ?? "",
          secondLink: data.second_link ?? "",
          answer1: data.answer1 ?? "",
          answer2: data.answer2 ?? "",
          answer3: data.answer3 ?? "",
          techStacks: data.tech_stacks ?? [],
        }}
      />
    </section>
  );
};

export default HubProfile;