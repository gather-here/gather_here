"use client";

import React from "react";

const TeamworkQuestions: React.FC<{
  answer1: string;
  setAnswer1: (value: string) => void;
  answer2: string;
  setAnswer2: (value: string) => void;
  answer3: string;
  setAnswer3: (value: string) => void;
}> = ({ answer1, setAnswer1, answer2, setAnswer2, answer3, setAnswer3 }) => {
  return (
    <section>
      <form className="space-y-6 ml-2">
        <fieldset className="p-3 s:p-0">
          <h1 className="text-subtitle font-baseBold text-labelNeutral mb-5">공통 질문</h1>

          <div className="mb-6">
            <h2 className="text-lg font-bold text-labelStrong mb-2">
              Q1. 팀으로 일할 때 나는 어떤 팀원인지 설명해 주세요.
            </h2>
            <p className="text-sm text-labelNeutral mb-2">핵심포인트: 자신의 팀 내 역할과 협력 방식을 설명해 주세요.</p>
            <textarea
              id="answer1"
              name="answer1"
              value={answer1}
              onChange={(e) => setAnswer1(e.target.value)}
              placeholder="답변을 입력하세요."
              className="w-full p-2 shared-input-gray-2 border-[1px] border-fillLight"
            />
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold text-labelStrong mb-2">
              Q2. 팀과 함께 목표를 이루기 위해 가장 중요하다고 생각하는 점은 무엇인가요?
            </h2>
            <p className="text-sm text-labelNeutral mb-2">
              핵심포인트: 팀워크에서 중요하게 생각하는 요소를 설명해 주세요.
            </p>
            <textarea
              id="answer2"
              name="answer2"
              value={answer2}
              onChange={(e) => setAnswer2(e.target.value)}
              placeholder="답변을 입력하세요."
              className="w-full p-2 shared-input-gray-2 border-[1px] border-fillLight"
            />
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold text-labelStrong mb-2">
              Q3. 자신이 부족하다고 느낀 부분을 어떻게 보완하고 학습하는지 이야기해주세요.
            </h2>
            <p className="text-sm text-labelNeutral mb-2">
              핵심포인트: 새로운 도전에 어떻게 대응하고 발전해 왔는지 알려주세요.
            </p>
            <textarea
              id="answer3"
              name="answer3"
              value={answer3}
              onChange={(e) => setAnswer3(e.target.value)}
              placeholder="답변을 입력하세요."
              className="w-full p-2 shared-input-gray-2 border-[1px] border-fillLight"
            />
          </div>
        </fieldset>
      </form>
    </section>
  );
};

export default TeamworkQuestions;
