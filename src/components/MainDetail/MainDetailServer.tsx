import { createServerSupabaseClient } from '@/utils/supabase/server';
import MainDetailClient from './MainDetailClient';
import { notFound } from 'next/navigation';

interface MainDetailProps {
    postId: string;
}

const MainDetailServer = async ({ postId }: MainDetailProps) => {
    const supabase = createServerSupabaseClient();

    const { data: post, error: postError } = await supabase
        .from('Posts')
        .select('*')
        .eq('post_id', postId)
        .single();

    if (postError || !post) return notFound();

    const { data: user } = await supabase
        .from('Users')
        .select('profile_image_url, nickname')
        .eq('user_id', post.user_id)
        .single();

    if (!user) return notFound(); 

    return <MainDetailClient post={post} user={user} />;
};

export default MainDetailServer;