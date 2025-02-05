import axios from "axios";
import { createClient } from "./supabase/client";

const supabase = createClient();

const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_API_URL
      : "",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return Promise.reject(new Error("Not logged in"));
    }

    const token = session.access_token;

    config.headers["Authorization"] = `Bearer ${token}`;

    return config;
  } catch (error) {
    return Promise.reject(error);
  }
});

export default axiosInstance;
