import axios from "axios";

const API_BASE_URL = `${
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
}`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Helper to get cookie value
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = getCookie("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear cookie
      if (typeof document !== "undefined") {
        document.cookie =
          "access_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
      }
      if (typeof window !== "undefined") {
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
