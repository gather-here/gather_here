import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/provider/UserContextProvider';
import HubRegistrationButton from './NavBar/HubRegistrationButton';
import JobSelector from './NavBar/JobSelector';
import LoginModal from './NavBar/LoginModal';

interface JobDirectoryProps {
  setFilteredJob: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}

const JobDirectory: React.FC<JobDirectoryProps> = ({ setFilteredJob, className }) => {
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, userData } = useUser();
  
  // 사용자가 Hub에 등록되어 있는지 확인
  const isHubRegistered = useMemo(() => userData?.hubCard || false, [userData]);
  // 직업군 리스트 캐싱
  const jobCategories = useMemo(() => [
    { name: '전체 보기', value: 'all', hoverClass: 'hover:bg-primary hover:text-black text-black' },
    { name: '프론트엔드', value: 'frontend', hoverClass: 'hover:bg-primaryStrong hover:text-black' },
    { name: '백엔드', value: 'backend', hoverClass: 'hover:bg-accentOrange hover:text-black' },
    { name: 'iOS', value: 'ios', hoverClass: 'hover:bg-accentMaya hover:text-black' },
    { name: '안드로이드', value: 'android', hoverClass: 'hover:bg-accentPurple hover:text-black' },
    { name: '데브옵스', value: 'devops', hoverClass: 'hover:bg-accentRed hover:text-black' },
    { name: '디자인', value: 'design', hoverClass: 'hover:bg-accentMint hover:text-black' },
    { name: 'PM', value: 'pm', hoverClass: 'hover:bg-accentColumbia hover:text-black' },
    { name: '기획', value: 'planning', hoverClass: 'hover:bg-accentPink hover:text-black' },
    { name: '마케팅', value: 'marketing', hoverClass: 'hover:bg-accentYellow hover:text-black' }
  ], []);

  // 로컬 스토리지에서 선택된 직업군을 가져와 상태를 설정
  useEffect(() => {
    const storedJob = localStorage.getItem('selectedJob') || 'all';
    setSelectedJob(storedJob);
    setFilteredJob(storedJob);
  }, [setFilteredJob]);

  // 직업군 선택 핸들러
  const handleSelectJob = useCallback((jobValue: string) => {
    setSelectedJob(jobValue);
    setFilteredJob(jobValue);
    localStorage.setItem('selectedJob', jobValue);
  }, [setFilteredJob]);

  // 카드 추가 핸들러
  const handleAddCard = useCallback(() => {
    if (!isAuthenticated) {
      setIsModalOpen(true);
    } else {
      router.push(isHubRegistered ? '/mypage/' : '/mypage'); // Hub 등록 상태에 따라 페이지 이동
    }
  }, [isAuthenticated, isHubRegistered, router]);

  const handleCloseLoginModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <aside className={`${className} p-4 rounded-lg sticky top-4`}>
      {/* 모바일 화면용 */}
      <div className="block lg:hidden">
        <HubRegistrationButton
          isHubRegistered={isHubRegistered}
          onClick={handleAddCard}
        />
        <JobSelector
          jobCategories={jobCategories}
          selectedJob={selectedJob}
          onSelectJob={handleSelectJob}
        />
      </div>

      {/* 큰 화면용 */}
      <div className="hidden lg:block">
        <JobSelector
          jobCategories={jobCategories}
          selectedJob={selectedJob}
          onSelectJob={handleSelectJob}
        />
        <HubRegistrationButton
          isHubRegistered={isHubRegistered}
          onClick={handleAddCard}
        />
      </div>

      <LoginModal isModalOpen={isModalOpen} onClose={handleCloseLoginModal} />
    </aside>
  );
};

export default JobDirectory;