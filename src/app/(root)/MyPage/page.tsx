import React from "react";

const MyInfo = () => {
  return (
    <section>
      <form className="space-y-6">
        <fieldset className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
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
                placeholder="user"
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
                placeholder="링크를 입력해주세요"
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
            <label htmlFor="delete-account" className="sr-only">
              회원 탈퇴
            </label>
            <button type="button" className="px-4 py-2 bg-gray-100 rounded-md text-sm">
              회원 탈퇴
            </button>
            <div className="space-x-2">
              <button type="button" className="px-4 py-2 bg-gray-100 rounded-md text-sm">
                취소
              </button>
              <button type="submit" className="px-4 py-2 bg-gray-800 text-white rounded-md text-sm">
                저장
              </button>
            </div>
          </div>
        </fieldset>
      </form>
    </section>
  );
};

export default MyInfo;
