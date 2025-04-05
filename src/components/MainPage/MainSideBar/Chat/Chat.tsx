'use client';

import Image from 'next/image';
import dayjs from 'dayjs';
import LoginForm from '@/components/Login/LoginForm';
import useChat from '@/hooks/useChat';
import { secureImageUrl } from '@/utils/imageUtils';

const Chat = () => {
  const {
    user,
    messages,
    inputValue,
    setInputValue,
    isModalOpen,
    setIsModalOpen,
    chatContentDivRef,
    formRef,
    handleSubmit,
    handleEnterKeyDown,
    handleDelete,
  } = useChat();

  return (
    <>
      <div className="w-[375px] h-[731px] s:h-screen shadow flex-col justify-start items-start inline-flex">
        <div className="justify-between items-center inline-flex self-stretch p-5 bg-fillStrong rounded-t-[20px] border-l border-r border-t border-fillNormal ">
          <div className="grow shrink basis-0 h-6 justify-start items-center gap-1 flex">
            <div className="w-6 h-6 p-1 justify-center items-center flex">
              <div className="flex-col justify-center items-center inline-flex">
                <Image src="/Chat/people.svg" width={16} height={12} alt="People Icon" />
              </div>
            </div>
            <div className="text-[#c4c4c4] text-sm font-medium font-pretendard leading-[21px]">
              실시간 채팅에 참여해보세요
            </div>
          </div>
        </div>
        <div
          className="self-stretch h-full px-5 py-3 bg-fillStrong border-l border-r border-fillNormal flex-col justify-start items-start gap-5 flex overflow-y-scroll scrollbar-hide"
          ref={chatContentDivRef}
        >
          {messages.map((message) => (
            <div key={`${message.message_id}`} className="w-full mb-3">
              {message.user_id === user?.id ? (
                <div id="mine" className="self-stretch px-3 flex-col justify-center items-end flex">
                  <div className="flex-col justify-center items-end gap-1 flex">
                    <div className="flex items-end">
                      <button className="mr-2 pointer" onClick={() => void handleDelete(message.message_id)}>
                        삭제
                      </button>
                      <div className="max-w-[190px] p-3 bg-primary rounded-tl-[20px] rounded-tr rounded-bl-[20px] rounded-br-[20px] justify-center items-center gap-2.5 inline-flex">
                        <div className="w-full text-[#2b2b2b] text-sm font-normal font-pretendard leading-snug whitespace-pre-wrap break-words overflow-hidden">
                          {message.content}
                        </div>
                      </div>
                    </div>
                    <div className="mt-1 self-stretch text-right text-[#919191] text-xs font-normal font-pretendard leading-none">
                      {dayjs(message.sent_at).format('YY.MM.DD HH:mm')}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="self-stretch justify-start items-start gap-2 inline-flex">
                  <div className="w-8 h-8 bg-[#3b3d3f] rounded-[9px] justify-center items-center flex">
                    <div className="justify-center items-center flex">
                      <div className="relative" style={{ width: '32px', height: '32px' }}>
                        <Image
                          className="rounded-xl"
                          src={secureImageUrl(message.Users?.profile_image_url) ?? '/assets/header/user.svg'}
                          alt="Profile image"
                          fill
                          sizes="(max-width: 32px) 100vw, 32px"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="max-w-[190px] flex-col justify-start items-start gap-2 inline-flex">
                    <div className="self-stretch text-labelStrong text-sm font-medium font-pretendard leading-[21px]">
                      {message.Users?.nickname}
                    </div>
                    <div className="w-full p-3 bg-fillNormal rounded-tl rounded-tr-[20px] rounded-bl-[20px] rounded-br-[20px] justify-center items-center gap-2.5 inline-flex">
                      <div className="w-full text-labelStrong text-sm font-normal font-pretendard leading-snug whitespace-pre-wrap break-words overflow-hidden">
                        {message.content}
                      </div>
                    </div>
                    <div className="mt-1 self-stretch text-labelAssistive text-xs font-normal font-pretendard leading-none">
                      {dayjs(message.sent_at).format('YY.MM.DD HH:mm')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <form action="" className="w-full" onSubmit={(evt) => void handleSubmit(evt)} ref={formRef}>
          {user ? (
            <div
              id="input"
              className="self-stretch h-[88px] w-full p-5 bg-fillStrong rounded-b-[20px] border-l border-r border-b border-fillNormal"
            >
              <div className="w-full h-full flex justify-center items-center bg-fillNeutral rounded-xl">
                <textarea
                  value={inputValue}
                  onChange={(evt) => setInputValue(evt.target.value)}
                  onKeyDown={(evt) => handleEnterKeyDown(evt)}
                  placeholder="메시지를 입력해보세요"
                  className="w-full h-12 bg-fillNeutral rounded-lg justify-start items-start inline-flex border self-stretch text-fontWhite overflow-auto scrollbar-hide resize-none mr-4 p-3 focus:outline-none"
                />
                <button
                  type="submit"
                  className={`w-5 h-5 m-3 text-fontWhite ${
                    inputValue.trim() ? 'cursor-pointer' : 'hover:cursor-default'
                  }`}
                >
                  <Image src="/Chat/send.svg" alt="Send Button" width={30} height={30} />
                </button>
              </div>
            </div>
          ) : (
            <div
              id="input"
              className="self-stretch h-[145px] w-full p-5 bg-fillStrong border-l border-r border-b border-fillNormal rounded-b-[20px] flex-col justify-center items-center flex cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <div className="w-full h-full p-3 bg-fillNeutral rounded-lg self-stretch justify-between items-start inline-flex">
                <div className="w-full h-full grow shrink basis-0 text-labelAssistive text-sm font-normal mr-2 font-pretendard leading-[21px] break-all overflow-y-hidden whitespace-pre-wrap break-words">
                  채팅을 이용하시려면 로그인을 해주세요.
                </div>
              </div>

              <div className="rounded-md justify-center items-center flex">
                <div className="w-6 h-6 p-1 justify-center items-center flex">
                  <div className="justify-center items-center flex" />
                </div>
              </div>
            </div>
          )}
          {isModalOpen && (
            <>
              <div className="fixed inset-0 bg-black opacity-80 z-40" onClick={() => setIsModalOpen(false)}></div>
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background rounded-[20px] p-4 z-50">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="ml-auto mt-1 mr-1 block text-right p-1 text-3xl text-fontWhite hover:text-[#777]"
                >
                  &times;
                </button>
                <LoginForm />
              </div>
            </>
          )}
        </form>
      </div>
    </>
  );
};

export default Chat;
