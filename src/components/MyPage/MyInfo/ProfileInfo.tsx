"use client";

import Image from "next/image";
import { useModal } from "@/provider/ContextProvider";

const ProfileInfo: React.FC = () => {
  const { openModal, closeModal } = useModal();

  // 회원 탈퇴 모달
  const handleOpenModal = () => {
    const onRequestClose = () => {
      closeModal();
    };

    openModal(
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 text-center">
        <div className="relative w-80 p-6 bg-white rounded-lg shadow-lg">
          <button
            onClick={onRequestClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            aria-label="모달 닫기"
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
          <div className="mb-4 w-auto flex justify-center">
            <Image src="/Common/caution_icon.png" alt="Profile Image" width={70} height={70} />
          </div>
          <h2 className="mb-2 text-lg font-semibold">정말 탈퇴하시겠어요?</h2>
          <div className="mb-5">
            <p className="text-gray-500 text-sm">
              회원 탈퇴 시 계정은 삭제되며
              <br /> 복구되지 않습니다.
            </p>
          </div>
          <div className="flex justify-center space-x-2">
            <button
              onClick={onRequestClose}
              className="px-4 py-3 bg-gray-100 rounded-md text-sm w-40"
              aria-label="회원 탈퇴 취소"
            >
              취소
            </button>
            <button type="submit" className="px-4 py-3 bg-gray-900 text-white rounded-md text-sm  w-40">
              탈퇴
            </button>
          </div>
        </div>
      </div>,
    );
  };

  return (
    <section>
      <form className="space-y-6">
        <fieldset className="bg-white rounded-2xl border border-gray-200 s:border-none shadow-sm p-7 s:p-0">
          <h1 className="text-lg font-semibold mb-4">기본 정보</h1>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
                닉네임
              </label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                placeholder="닉네임을 입력해주세요."
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="blog" className="block text-sm font-medium text-gray-700 mb-1">
                블로그 <span className="text-gray-400">(선택)</span>
              </label>
              <input
                type="url"
                id="blog"
                name="blog"
                placeholder="링크를 입력해주세요."
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="job" className="block text-sm font-medium text-gray-700 mb-1">
                직군
              </label>
              <select id="job" name="job" className="w-full p-2 border border-gray-300 rounded-md">
                <option>프론트엔드 개발자</option>
              </select>
            </div>
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                경력
              </label>
              <select id="experience" name="experience" className="w-full p-2 border border-gray-300 rounded-md">
                <option>N년</option>
              </select>
            </div>
          </div>
          <div className="mt-6">
            <button type="button" aria-label=" 회원 탈퇴" onClick={handleOpenModal} className="mb-6">
              회원 탈퇴
            </button>
            <div className="space-x-2">
              <button type="button" aria-label=" 회원 정보 취소" className="px-4 py-2 bg-gray-100 rounded-md text-sm">
                취소
              </button>
              <button
                type="submit"
                aria-label=" 회원 정보 저장"
                className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm"
              >
                저장
              </button>
            </div>
          </div>
        </fieldset>
      </form>
    </section>
  );
};

export default ProfileInfo;
