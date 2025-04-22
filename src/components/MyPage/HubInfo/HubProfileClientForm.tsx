"use client";

import { useReducer } from "react";
import BackgroundPicture from "./components/BackgroundPicture";
import HubProfileForm from "./components/HubProfileInfo";
import SelfIntroduction from "@/components/MyPage/HubInfo/components/Introductioin";
import TeamworkQuestions from "@/components/MyPage/HubInfo/components/TeamQuestions";
import TechStack from "@/components/MyPage/HubInfo/components/TechStack";
import { HubProfileState, hubProfileReducer, } from "@/components/MyPage/HubInfo/reducer/hubProfileReducer";
import HubProfileToggle from "./HubProfileToggle";

interface HubProfileClientFormProps {
  initialIsActive: boolean;
  initialData: HubProfileState;
}

const HubProfileClientForm: React.FC<HubProfileClientFormProps> = ({ initialIsActive,  initialData }) => {
  const [state, dispatch] = useReducer(hubProfileReducer, initialData); // useReducer를 통해 상태 초기화 및 디스패치 함수 생성

  return (
    <>
      <BackgroundPicture />
      <SelfIntroduction
        description={state.description}
        setDescription={(value) => dispatch({ type: "SET_DESCRIPTION", payload: value })}
      />

      <div className="border-b-[1px] border-fillNormal my-6" />

      <TeamworkQuestions
        answer1={state.answer1}
        setAnswer1={(value) => dispatch({ type: "SET_ANSWER1", payload: value })}
        answer2={state.answer2}
        setAnswer2={(value) => dispatch({ type: "SET_ANSWER2", payload: value })}
        answer3={state.answer3}
        setAnswer3={(value) => dispatch({ type: "SET_ANSWER3", payload: value })}
      />

      <div className="border-b-[1px] border-fillNormal my-6" />

      <TechStack
        selectedStacks={state.techStacks}
        setSelectedStacks={(value) =>
          dispatch({ type: "SET_TECH_STACKS", payload: value })
        }
      />

      <div className="border-t border-labelAssistive my-6" />

      <HubProfileForm
        blog={state.blog}
        setBlog={(value) => dispatch({ type: "SET_BLOG", payload: value })}
        firstLinkType={state.firstLinkType}
        setFirstLinkType={(value) => dispatch({ type: "SET_FIRST_LINK_TYPE", payload: value })}
        firstLink={state.firstLink}
        setFirstLink={(value) => dispatch({ type: "SET_FIRST_LINK", payload: value })}
        secondLinkType={state.secondLinkType}
        setSecondLinkType={(value) => dispatch({ type: "SET_SECOND_LINK_TYPE", payload: value })}
        secondLink={state.secondLink}
        setSecondLink={(value) => dispatch({ type: "SET_SECOND_LINK", payload: value })}
      />

      <div className="border-b-[1px] border-fillNormal my-6" />

      {/* 상태를 넘겨서 HubProfileToggle 렌더링 */}
      <HubProfileToggle
        initialIsActive={initialIsActive}
        state={state}
      />
    </>
  );
};

export default HubProfileClientForm;