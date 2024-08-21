import { create } from "zustand";

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    avatar_url?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  resetAuthUser: () => void;
}

interface SignupState {
  step: number;
  job_title: string;
  experience: string;
  nickname: string;
  blog: string;
  profile_image_url: string;
  setJob: (job: string) => void;
  setExperience: (experience: string) => void;
  setNickname: (nickname: string) => void;
  setBlog: (blog: string) => void;
  setProfileImageUrl: (url: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetSignupUser: () => void;
}

interface StoreState extends AuthState, SignupState {}

const useSignupStore = create<StoreState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  resetAuthUser: () => set({ user: null }),

  step: 1,
  job_title: "",
  experience: "",
  nickname: "",
  blog: "",
  profile_image_url: "",

  setJob: (job) => set({ job_title: job }),
  setExperience: (experience) => set({ experience }),
  setNickname: (nickname) => set({ nickname }),
  setBlog: (blog) => set({ blog }),
  setProfileImageUrl: (url) => set({ profile_image_url: url }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),
  resetSignupUser: () =>
    set({
      step: 1,
      job_title: "",
      experience: "",
      nickname: "",
      blog: "",
      profile_image_url: "",
      user: null,
    }),
}));

export default useSignupStore;
