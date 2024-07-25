import React, { FC, ReactNode } from "react";
import Modal from "react-modal";

interface CommonModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: ReactNode;
}

const CommonModal: FC<CommonModalProps> = ({ isOpen, onRequestClose, children }) => {
  return (
    <Modal
      isOpen={isOpen} // 모달 열려있는지 여부 결정
      onRequestClose={onRequestClose} // 모달 닫는 함수
      shouldCloseOnOverlayClick={true} // 바깥 영역 클릭시 닫힘모드
      className="flex items-center justify-center z-100"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
      contentLabel="모달"
    >
      <div className="relative bg-white rounded-lg p-8 max-w-lg mx-auto">
        {/* 모달 닫기 버튼 */}
        <button
          onClick={onRequestClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="모달 닫기 버튼"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </Modal>
  );
};

export default CommonModal;
