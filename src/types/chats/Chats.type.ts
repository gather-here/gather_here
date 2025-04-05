import { Tables } from '@/types/supabase';

interface ChatUserInfo {
  Users: {
    profile_image_url: string;
    nickname: string;
  };
}

export type MessageRow = Tables<'Messages'> & ChatUserInfo;
