import React from 'react';

interface QnASectionProps {
  answer1: string;
  answer2: string;
  answer3: string;
}

const QnASection: React.FC<QnASectionProps> = ({ answer1, answer2, answer3 }) => {
  return (
    <div className="mt-1 p-6">
      <h3 className="text-lg font-bold text-white">✅ 공통 질문</h3>
      <p className="text-white mt-3">↪️ 서로를 더 알아갈 수 있도록 공통 질문을 준비했어요</p>
      <br />
      <div className="mt-2 space-y-6">
        <div>
          <h4 className="text-md font-bold text-white">1️⃣ 팀으로 일할 때 나는 어떤 팀원인지 설명해 주세요.</h4>
          <p className="bg-gray-200 p-4 rounded-lg mt-2 text-black">
            {answer1}
          </p>
        </div>
        <div>
          <h4 className="text-md font-bold text-white">2️⃣ 팀과 함께 목표를 이루기 위해 무엇이 가장 중요하다고 생각하는지 알려 주세요.</h4>
          <p className="bg-gray-200 p-4 rounded-lg mt-2 text-black">
            {answer2}
          </p>
        </div>
        <div>
          <h4 className="text-md font-bold text-white">3️⃣ 자신이 부족하다고 느낀 부분을 어떻게 보완하거나 학습해 왔는지 이야기해 주세요.</h4>
          <p className="bg-gray-200 p-4 rounded-lg mt-2 text-black">
            {answer3}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QnASection;