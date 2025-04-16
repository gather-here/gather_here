"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { useAuth } from "@/provider/user/UserAuthProvider";
import { useUserData } from "@/provider/user/UserDataProvider";
import SelfIntroduction from "@/components/MyPage/HubInfo/Introductioin";
import HubProfileForm from "@/components/MyPage/HubInfo/HubProfileInfo";
import TeamworkQuestions from "@/components/MyPage/HubInfo/TeamQuestions";
import BackgroundPicture from "@/components/MyPage/HubInfo/BackgroundPicture";
import Toast from "@/components/Common/Toast/Toast";
import TechStack from "@/components/MyPage/HubInfo/TechStack";

const HubProfile: React.FC = () => {
  const { user } = useAuth(); 
  const { fetchUserData } = useUserData();
  const [description, setDescription] = useState("");
  const [blog, setBlog] = useState("");
  const [firstLinkType, setFirstLinkType] = useState("");
  const [firstLink, setFirstLink] = useState("");
  const [secondLinkType, setSecondLinkType] = useState("");
  const [secondLink, setSecondLink] = useState("");
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [answer3, setAnswer3] = useState("");
  const [techStacks, setTechStacks] = useState<string[]>([]);
  const [toast, setToast] = useState<{
    state: "success" | "error" | "warn" | "info" | "custom" | "";
    message: string;
  }>({ state: "", message: "" });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("Users")
        .select(
          "description, blog, first_link_type, first_link, second_link_type, second_link, answer1, answer2, answer3, tech_stacks",
        )
        .eq("user_id", user.id)
        .single();

      if (data) {
        setDescription(data.description ?? "");
        setBlog(data.blog ?? "");
        setFirstLinkType(data.first_link_type ?? "");
        setFirstLink(data.first_link ?? "");
        setSecondLinkType(data.second_link_type ?? "");
        setSecondLink(data.second_link ?? "");
        setAnswer1(data.answer1 ?? "");
        setAnswer2(data.answer2 ?? "");
        setAnswer3(data.answer3 ?? "");
        setTechStacks(data.tech_stacks ?? []);
      }

      if (error) {
        console.error("사용자 데이터를 가져오지 못했습니다:", error);
      }
    };

    void fetchUserProfile();
  }, [user, supabase]);

  const handleSave = async () => {
    if (!blog) {
      setToast({ state: "error", message: "포트폴리오 링크를 작성해주세요!" });
      return;
    }

    if (!user) return;

    const { error } = await supabase
      .from("Users")
      .update({
        hubCard: true,
        description,
        blog,
        first_link_type: firstLinkType,
        first_link: firstLink,
        second_link_type: secondLinkType,
        second_link: secondLink,
        answer1,
        answer2,
        answer3,
        tech_stacks: techStacks,
      })
      .eq("user_id", user.id);

    if (error) {
      setToast({ state: "error", message: `저장에 실패했습니다: ${error.message}` });
    } else {
      setToast({ state: "success", message: "저장되었습니다." });
      if (user?.id) {
        void fetchUserData(user.id);
      }
    }
  };

  return (
    <section>
      <BackgroundPicture />
      <div className="border-b-[1px] border-fillNormal my-6" />
      <SelfIntroduction description={description} setDescription={setDescription} />
      <div className="border-b-[1px] border-fillNormal my-6" />
      <TeamworkQuestions
        answer1={answer1}
        setAnswer1={setAnswer1}
        answer2={answer2}
        setAnswer2={setAnswer2}
        answer3={answer3}
        setAnswer3={setAnswer3}
      />
      <div className="border-b-[1px] border-fillNormal my-6" />
      <TechStack selectedStacks={techStacks} setSelectedStacks={setTechStacks} />
      <div className="border-t border-labelAssistive my-6" />
      <HubProfileForm
        blog={blog}
        setBlog={setBlog}
        firstLinkType={firstLinkType}
        setFirstLinkType={setFirstLinkType}
        firstLink={firstLink}
        setFirstLink={setFirstLink}
        secondLinkType={secondLinkType}
        setSecondLinkType={setSecondLinkType}
        secondLink={secondLink}
        setSecondLink={setSecondLink}
      />
      <div className="border-b-[1px] border-fillNormal my-6" />
      <div className="mt-6 mb-12">
        <div className="flex justify-center">
          <button onClick={() => void handleSave()} aria-label="저장" className="shared-button-green w-[65px]">
            저장
          </button>
        </div>
      </div>
      {toast.state && (
            <Toast
              state={toast.state}
              message={toast.message}
              onClear={() => setToast({ state: "", message: "" })}
            />
          )}
    </section>
  );
};

export default HubProfile;