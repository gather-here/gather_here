export interface UserData {
    nickname?: string;
    job_title?: string;
    experience?: string;
    blog?: string;
    profile_image_url?: string;
    hubCard?: boolean;
    answer1?: string;
    answer2?: string;
    answer3?: string;
    description?: string;
  }
  
  export interface MemberCardProps {
    nickname: string;
    jobTitle: string;
    experience: string;
    backgroundImageUrl: string;
    profileImageUrl: string;
    blog: string;
    notionLink: string;
    instagramLink: string;
    liked: boolean;
    toggleLike: () => void;
    description: string;
    answer1: string;
    answer2: string;
    answer3: string;
  }