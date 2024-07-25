import React from "react";

const ProfilePictureUpload = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 s:border-none shadow-sm p-7 s:p-0 s:pb-4">
      <label className="block text-lg font-semibold text-gray-700 mb-3">프로필 사진</label>
      <div className="flex items-center s:flex-col s:items-start s:mb-3 gap-4">
        <div className="w-40 h-40 border rounded-[20px] overflow-hidden bg-gray-200 flex items-center justify-center s:mb-3">
          <span className="text-gray-400">이미지</span>
        </div>
        <div className="grid grid-cols-5 gap-2 s:mb-4">
          {/* 예시 아이콘들 */}
          {/* 기능 구현시 리팩토링 예정 (map) */}
          <button
            type="button"
            className="w-16 h-16 m:w-12 m:h-12 rounded-full overflow-hidden border-2 border-gray-200"
          >
            1
          </button>
          <button
            type="button"
            className="w-16 h-16 m:w-12 m:h-12 rounded-full overflow-hidden border-2 border-gray-200"
          >
            2
          </button>
          <button
            type="button"
            className="w-16 h-16  m:w-12 m:h-12 rounded-full overflow-hidden border-2 border-gray-200"
          >
            3
          </button>
          <button
            type="button"
            className="w-16 h-16 m:w-12 m:h-12 rounded-full overflow-hidden border-2 border-gray-200"
          >
            4
          </button>
          <button
            type="button"
            className="w-16 h-16 m:w-12 m:h-12 rounded-full overflow-hidden border-2 border-gray-200"
          >
            5
          </button>
          <button
            type="button"
            className="w-16 h-16 m:w-12 m:h-12 rounded-full overflow-hidden border-2 border-gray-200"
          >
            6
          </button>
          <button
            type="button"
            className="w-16 h-16 m:w-12 m:h-12 rounded-full overflow-hidden border-2 border-gray-200"
          >
            7
          </button>
          <button
            type="button"
            className="w-16 h-16 m:w-12 m:h-12 rounded-full overflow-hidden border-2 border-gray-200"
          >
            8
          </button>
          <button
            type="button"
            className="w-16 h-16 m:w-12 m:h-12 rounded-full overflow-hidden border-2 border-gray-200"
          >
            9
          </button>
          <button
            type="button"
            className="w-16 h-16 m:w-12 m:h-12 rounded-full overflow-hidden border-2 border-gray-200"
          >
            10
          </button>
        </div>
      </div>
      <div className="mt-5 flex space-x-2">
        <button type="button" className="px-4 py-2 bg-gray-100 rounded-md text-sm">
          수정
        </button>
        <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm">
          저장
        </button>
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
