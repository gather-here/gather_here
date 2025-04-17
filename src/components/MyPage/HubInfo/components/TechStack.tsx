"use client";

import Image from "next/image";

interface TechStackProps {
  selectedStacks: string[]; // 현재 선택된 기술 스택 ID 목록
  setSelectedStacks: (value: string[]) => void; // useReducer와 호환
}

// 기술 스택 데이터
const techStacks = [
  { id: "aws", name: "AWS", image: "/Stacks/AWS.svg" },
  { id: "django", name: "Django", image: "/Stacks/Django.svg" },
  { id: "docker", name: "Docker", image: "/Stacks/Docker.svg" },
  { id: "express", name: "Express", image: "/Stacks/Express.svg" },
  { id: "figma", name: "Figma", image: "/Stacks/Figma.svg" },
  { id: "firebase", name: "Firebase", image: "/Stacks/Firebase.svg" },
  { id: "flutter", name: "Flutter", image: "/Stacks/Flutter.svg" },
  { id: "git", name: "Git", image: "/Stacks/Git.svg" },
  { id: "go", name: "Go", image: "/Stacks/Go.svg" },
  { id: "graphql", name: "GraphQL", image: "/Stacks/GraphQL.svg" },
  { id: "java", name: "Java", image: "/Stacks/Java.svg" },
  { id: "javascript", name: "JavaScript", image: "/Stacks/JavaScript.svg" },
  { id: "jest", name: "Jest", image: "/Stacks/Jest.svg" },
  { id: "kotlin", name: "Kotlin", image: "/Stacks/Kotlin.svg" },
  { id: "kubernetes", name: "Kubernetes", image: "/Stacks/Kubernetes.svg" },
  { id: "mongodb", name: "MongoDB", image: "/Stacks/MongoDB.svg" },
  { id: "mysql", name: "MySQL", image: "/Stacks/MySQL.svg" },
  { id: "nestjs", name: "NestJS", image: "/Stacks/Nestjs.svg" },
  { id: "nextjs", name: "NextJS", image: "/Stacks/Nextjs.svg" },
  { id: "nodejs", name: "NodeJS", image: "/Stacks/Nodejs.svg" },
  { id: "php", name: "PHP", image: "/Stacks/Php.svg" },
  { id: "python", name: "Python", image: "/Stacks/Python.svg" },
  { id: "react", name: "React", image: "/Stacks/React.svg" },
  { id: "reactnative", name: "React Native", image: "/Stacks/ReactNative.svg" },
  { id: "spring", name: "Spring", image: "/Stacks/Spring.svg" },
  { id: "svelte", name: "Svelte", image: "/Stacks/Svelte.svg" },
  { id: "swift", name: "Swift", image: "/Stacks/Swift.svg" },
  { id: "typescript", name: "TypeScript", image: "/Stacks/TypeScript.svg" },
  { id: "unity", name: "Unity", image: "/Stacks/Unity.svg" },
  { id: "vue", name: "Vue", image: "/Stacks/Vue.svg" },
  { id: "zeplin", name: "Zeplin", image: "/Stacks/Zeplin.svg" },
];

// TechStack 컴포넌트
const TechStack: React.FC<TechStackProps> = ({ selectedStacks, setSelectedStacks }) => {
  // 기술 스택 선택/해제 핸들러
  const handleSelectStack = (stackId: string) => {
    if (selectedStacks.includes(stackId)) {
      // 이미 선택된 경우 제거
      setSelectedStacks(selectedStacks.filter((id) => id !== stackId));
    } else if (selectedStacks.length < 10) {
      // 최대 10개까지 선택 허용
      setSelectedStacks([...selectedStacks, stackId]);
    } else {
      alert("최대 10개의 기술 스택만 선택할 수 있습니다.");
    }
  };

  return (
    <div className="ml-5 mb-5">
      <h1 className="text-subtitle font-baseBold text-labelNeutral mb-5">기술 스택 선택</h1>

      {/* 스택 선택 UI */}
      <div className="flex flex-wrap gap-4">
        {techStacks.map((stack) => (
          <button
            key={stack.id}
            onClick={() => handleSelectStack(stack.id)}
            className={`tech-stack-button flex items-center justify-center px-4 py-2 rounded-xl cursor-pointer gap-2
              ${selectedStacks.includes(stack.id)
                ? "border-primary border-2 bg-fillLight text-primary"
                : "bg-fillLight text-labelNormal"}`}
          >
            <Image
              src={stack.image}
              alt={stack.name}
              width={20}
              height={20}
              style={{ objectFit: "contain" }}
            />
            <span className="tech-stack-text">{stack.name}</span>
          </button>
        ))}
      </div>

      {/* 텍스트 숨김 처리 */}
      <style jsx>{`
        .tech-stack-button {
          white-space: nowrap;
          min-height: 50px;
          padding: 8px 16px;
        }

        @media (max-width: 734px) {
          .tech-stack-text {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default TechStack;