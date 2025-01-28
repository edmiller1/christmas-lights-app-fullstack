"use client";

import { createContext, useContext, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { api } from "@/api";
import { toast } from "sonner";

interface UserContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: session,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user-session"],
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("No active session");
      }

      return {
        user: session.user,
        accessToken: session.access_token,
      };
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  const {
    data: dbUser,
    isLoading: isDbLoading,
    isError: isDbError,
    error: dbError,
  } = useQuery({
    queryKey: ["get-database-sync-status", session?.user?.id],
    queryFn: async () => {
      if (!session?.user || !session?.accessToken) {
        throw new Error("No session available");
      }
      return api.auth.getDatabaseSyncStatus(session.accessToken);
    },
    enabled: !!session?.user && !!session?.accessToken,
    retry: 3,
  });

  const refetchUser = async () => {
    await refetch();
  };

  // Listen for auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN") {
        // Invalidate queries to refetch data
        queryClient.invalidateQueries({ queryKey: ["user-session"] });
        queryClient.invalidateQueries({
          queryKey: ["get-database-sync-status"],
        });
      } else if (event === "SIGNED_OUT") {
        queryClient.setQueryData(["user-session"], {
          user: null,
          accessToken: null,
        });
        queryClient.setQueryData(["get-database-sync-status"], null);
        router.push("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        user: session?.user || null,
        accessToken: session?.accessToken || null,
        isLoading,
        isError,
        error: error as Error | null,
        refetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
