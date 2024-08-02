"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

interface UserContextType {
  user: User | null;
  userData: any;
  setUserData: (data: any) => void;
  fetchUserData: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const supabase = createClient();

  // 사용자 객체 가져옴
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, [supabase]);

  // 사용자 데이터를 가져옴
  const fetchUserData = async () => {
    if (!user) return;
    const { data, error } = await supabase.from("Users").select("*").eq("user_id", user.id).single();
    if (error) {
      console.error("사용자 데이터 불러오기 실패:", error);
    } else {
      setUserData(data);
    }
  };

  // 사용자 객체가 변경될 때마다 사용자 데이터를 가져옴
  useEffect(() => {
    fetchUserData();
  }, [user]);

  return <UserContext.Provider value={{ user, userData, setUserData, fetchUserData }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser는 UserProvider 내에서만 사용될 수 있습니다.");
  }
  return context;
};