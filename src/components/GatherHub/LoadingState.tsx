import React from 'react';

interface LoadingStateProps {
  count?: number; // 표시할 로딩 아이템의 개수 (기본값: 6)
}

const LoadingState: React.FC<LoadingStateProps> = ({ count = 6 }) => {
  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center" 
      aria-busy="true" 
      aria-live="polite"
    >
      {/* 로딩 아이템을 표시하는 배열 생성 */}
      {[...Array(6)].map((_, index) => (
        <div key={index} className="w-full h-48 bg-gray-200 animate-pulse"></div>
      ))}
    </div>
  );
};

export default LoadingState;