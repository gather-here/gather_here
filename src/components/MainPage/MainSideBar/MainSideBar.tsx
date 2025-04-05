'use client';

import Chat from '@/components/MainPage/MainSideBar/Chat/Chat';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import ChatModal from './Chat/ChatModal';
import PRCard from './PrCard/PrCard';
import Footer from './Footer/Footer';

const MainSideBar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    const handleScroll = () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        if (window.scrollY > 200) {
          setShowScrollToTop(true);
        } else {
          setShowScrollToTop(false);
        }
      }, 200);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="col-span-1 m:hidden">
        <div className="sticky top-4">
          <PRCard />
          {/* <Calender /> */}
          <Footer />
        </div>
      </div>
      <ChatModal isOpen={isModalOpen} onRequestClose={closeModal}>
        <Chat />
      </ChatModal>
      {showScrollToTop && (
        <button onClick={scrollToTop} className="m:hidden fixed flex bottom-20 right-1 hover:animate-bounce">
          <Image src="/assets/top.svg" alt="상단으로 이동 버튼" width={90} height={60} className="w-auto h-auto" />
        </button>
      )}
      {isModalOpen ? (
        <button onClick={closeModal} className="s:hidden fixed flex bottom-7 right-4 z-10 hover:animate-bounce">
          <Image
            src="/Chat/close.svg"
            alt="채팅창 닫기 버튼"
            width={90}
            height={60}
            priority
            className="w-auto h-auto"
          />
        </button>
      ) : (
        <button onClick={openModal} className="fixed bottom-4 right-1 z-10 hover:animate-bounce">
          <Image
            src="/Chat/chat.svg"
            alt="채팅창 열기 버튼"
            width={90}
            height={60}
            priority
            className="w-auto h-auto"
          />
        </button>
      )}
    </>
  );
};

export default MainSideBar;
