'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';

export async function deletePost(postId: string, currentUserId: string) {
  const supabase = createServerSupabaseClient();

  const { data: post } = await supabase.from('Posts').select('user_id').eq('post_id', postId).single();

  if (!post || post.user_id !== currentUserId) {
    return { success: false, error: '권한이 없습니다.' };
  }

  const { error } = await supabase.from('Posts').delete().eq('post_id', postId);
  if (error) return { success: false, error: error.message };

  return { success: true };
}