"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import SignupForm from "@/components/Signup/SigupForm";


const SignupPage = () => {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error fetching logged-in user:", userError);
        return;
      }

      if (!user) {
        router.push("/");
        return;
      }
    };

    void checkUser();
  }, [router]);

  return <SignupForm />;
};

export default SignupPage;