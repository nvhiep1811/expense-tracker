import axios from "axios";

const API_BASE_URL = `${
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
}`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  },
  withCredentials: true, // Automatically send httpOnly cookies
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear client-side auth indicator
      if (typeof document !== "undefined") {
        document.cookie =
          "auth_session=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax";
      }
      if (typeof window !== "undefined") {
        localStorage.removeItem("user_data");
        window.location.href = "/login";
      }
    }

    // Extract error message from response
    const errorMessage =
      error.response?.data?.message || error.message || "Đã xảy ra lỗi";

    // Create a new error with the message for better handling
    const apiError = new Error(errorMessage) as Error & {
      response?: typeof error.response;
      status?: number;
    };
    apiError.response = error.response;
    apiError.status = error.response?.status;

    return Promise.reject(apiError);
  },
);

export default api;
