"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const useSignOut = () => {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const signOut = async () => {
    setIsLoading(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("Error signing out. Please try again.");
      setIsLoading(false);
    } else {
      toast.success("Signed out successfully");
      setIsLoading(false);
      router.refresh();
    }
  };

  return { signOut, isLoading };
};
