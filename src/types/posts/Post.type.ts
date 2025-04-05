import { Tables } from '../supabase';

// 게시글 정보 타입
export interface Post {
  category: string;
  content: string;
  created_at: string;
  deadline: string;
  duration: number;
  location: string | null;
  personal_link: string | null;
  place: string;
  post_id: string;
  recruitments: number;
  target_position: string[];
  tech_stack: string[];
  title: string | null;
  total_members: number;
  user_id: string;
}

// 유저 정보 타입 (Posts에 연결된 작성자)
export interface User {
  nickname: string | null;
  profile_image_url: string | null;
}

// 유저 정보가 포함된 게시글 타입
export type PostWithUser = Post & {
  user: User;
};

// 게시글을 필터링할 때 사용하는 조건들
export interface FetchPostsFilters {
  targetPosition?: string[];
  place?: string;
  location?: string;
  duration?: { gt?: number; lte?: number } | null;
  user_id?: string;
}

// 게시글 정렬 조건
export interface FetchPostsOptions {
  order?: { column: string; ascending: boolean };
}

// IT 이벤트 정렬 조건 (구조는 게시글 정렬과 동일)
export interface FetchEventsPostsOptions {
  order?: { column: string; ascending: boolean };
}

// IT 행사 테이블 타입 (Supabase 테이블 자동 타입 추론 기반)
export type ITEvent = Tables<'IT_Events'>;
