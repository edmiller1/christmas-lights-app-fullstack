import { useUser } from "@/components/auth-context";

// Helper hook to make authenticated API calls
export function useAuthenticatedFetch() {
  const { accessToken } = useUser();

  return async (url: string, options: RequestInit = {}) => {
    if (!accessToken) {
      throw new Error("No access token available");
    }

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      throw new Error("Session expired");
    }

    return response;
  };
}
