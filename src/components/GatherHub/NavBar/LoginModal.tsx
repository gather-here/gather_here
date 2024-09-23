import React from 'react';
import dynamic from 'next/dynamic';
import { createPortal } from 'react-dom';

const LoginForm = dynamic(() => import('../../Login/LoginForm'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

interface LoginModalProps {
  isModalOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isModalOpen, onClose }) => {
  if (!isModalOpen) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black opacity-80 z-40" onClick={onClose}></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background rounded-[20px] p-4 z-50" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="ml-auto mt-1 mr-1 block text-right p-1 text-3xl text-[fontWhite] hover:text-[#777]"
        >
          &times;
        </button>
        <LoginForm />
      </div>
    </>,
    document.body
  );
};

export default LoginModal;