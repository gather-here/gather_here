import { createServerSupabaseClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export const GET = async () => {
  const supabase = createServerSupabaseClient();

  const { data: IT_Events, error } = await supabase
    .from('IT_Events')
    .select('*')
    .order('date_start', { ascending: false });

  if (error) {
    throw Error('게시글을 불러오는 과정에 문제가 발생했습니다.');
  }

  return NextResponse.json({ IT_Events });
};
