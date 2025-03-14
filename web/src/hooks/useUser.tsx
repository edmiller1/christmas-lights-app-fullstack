import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/api/auth";
import { User } from "@/lib/types";

export function useUser() {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["get-user"],
    queryFn: getUser,
    retry: false,
  });

  return {
    user: user as User | null,
    loading: isLoading,
    error: error as Error | null,
  };
}
