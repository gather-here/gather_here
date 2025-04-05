import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

export function createServerSupabaseClient(): SupabaseClient<Database> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !(supabaseServiceKey || supabaseAnonKey)) {
    throw new Error('Supabase 환경 변수가 누락되었습니다.');
  }

  const cookieStore = cookies();

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch (err) {
          console.error('쿠키 설정 중 오류 발생:', err);
        }
      },
    },
  });
}
