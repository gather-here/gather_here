"use client";

import React from "react";

const SelfIntroduction: React.FC<{ description: string; setDescription: (value: string) => void }> = ({
  description,
  setDescription,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  return (
    <section>
      <fieldset className="p-3 s:p-0">
        <h1 className="text-subtitle font-baseBold text-labelNeutral mb-3">허브 프로필</h1>
        <div className="mb-6">
          <h1 className="block text-sm font-medium text-labelNormal mb-1">한 줄 자기소개</h1>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={handleChange}
            placeholder="답변을 입력하세요."
            className="w-full h-24 p-2 shared-input-gray-2 border-[1px] border-fillLight"
          />
        </div>
      </fieldset>
    </section>
  );
};

export default SelfIntroduction;