import React from 'react';
import AllPage from './(mainpage)/all/page';
import NavTabs from '@/components/MainPage/NavTab/NavTabs';

const MainPage = () => {
  return (
    <div className="w-full mx-auto max-w-container-l m:max-w-container-m s:max-w-container-s">
      <NavTabs />
      <AllPage />
    </div>
  );
};

export default MainPage;
