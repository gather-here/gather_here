import { Tables } from '@/types/supabase';
import dayjs from 'dayjs';

const SearchResultCard = ({ post }: { post: Tables<'Posts'> }) => {
  return (
    <div className="w-[335px] h-64 p-5 bg-[#141415] rounded-[20px] flex-col justify-center items-center gap-3 inline-flex">
      <div className="self-stretch justify-between items-center inline-flex">
        <div className="justify-start items-center gap-2 flex">
          <div className="px-2 py-1 bg-[#3b3d3f] rounded-full flex-col justify-center items-center inline-flex">
            <div className="justify-center items-center gap-1 inline-flex">
              <div className="text-[#c3e88d] text-xs font-semibold font-['Pretendard'] leading-none">
                D-N{dayjs(post.deadline).format('YY.MM.DD (ddd)')}
              </div>
            </div>
          </div>
          <div className="text-[#c4c4c4] text-sm font-normal font-['Pretendard'] leading-[21px]">~MM. DD.</div>
        </div>
        <div className="w-6 h-6 p-1 justify-center items-center flex">
          <div className="justify-center items-center flex" />
        </div>
      </div>
      <div className="self-stretch h-[83px] flex-col justify-start items-start gap-1 flex">
        <div className="self-stretch text-[#f7f7f7] text-xl font-semibold font-['Pretendard'] leading-7">
          {post.title}
        </div>
        <div className="self-stretch h-[51px] text-[#919191] text-base font-medium font-['Pretendard'] leading-relaxed">
          {post.content}
        </div>
      </div>
      <div className="self-stretch justify-start items-center gap-2 inline-flex">
        <div className="h-6 p-1.5 bg-[#3b3d3f] rounded-md justify-center items-center gap-1.5 flex" />
        <div className="text-[#919191] text-sm font-normal font-['Pretendard'] leading-[21px]">User</div>
      </div>
      <div className="self-stretch p-3 bg-[#212121] rounded-[10px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.12)] justify-between items-center inline-flex">
        <div className="grow shrink basis-0 h-[25px] justify-start items-center gap-4 flex">
          <div className="grow shrink basis-0 h-[25px] justify-between items-center flex">
            <div className="justify-start items-center gap-2 flex">
              <div className="justify-start items-center gap-2 flex">
                <div className="text-[#c792e9] text-lg font-medium font-['Pretendard'] leading-[25.20px]">직군</div>
              </div>
              <div className="justify-start items-center gap-2 flex">
                <div className="w-px h-4 bg-[#28282a] rounded-[999px]" />
                <div className="text-[#fac66a] text-lg font-medium font-['Pretendard'] leading-[25.20px]">직군</div>
              </div>
              <div className="justify-start items-center gap-2 flex">
                <div className="w-px h-4 bg-[#28282a] rounded-[999px]" />
                <div className="text-[#82aaff] text-lg font-medium font-['Pretendard'] leading-[25.20px]">직군</div>
              </div>
            </div>
            <div className="text-[#f7f7f7] text-lg font-medium font-['Pretendard'] leading-[25.20px]"></div>
          </div>
          <div className="justify-center items-center flex" />
        </div>
      </div>
    </div>
  );
};

export default SearchResultCard;
