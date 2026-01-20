import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const API_BASE_URL = `${API_URL}/api`;

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
    const apiError = new Error(errorMessage);
    (apiError as any).response = error.response;
    (apiError as any).status = error.response?.status;

    return Promise.reject(apiError);
  },
);

// Auth API
export const authAPI = {
  register: async (data: {
    email: string;
    password: string;
    full_name: string;
  }) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  checkEmail: async (email: string) => {
    const response = await api.post("/auth/check-email", { email });
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (newPassword: string, accessToken: string) => {
    const response = await api.post(
      "/auth/reset-password",
      { new_password: newPassword },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  },

  // OAuth login - get redirect URL
  getOAuthUrl: async (provider: "google" | "facebook") => {
    const response = await api.post("/auth/oauth", { provider });
    return response.data;
  },
};

// Profiles API
export const profilesAPI = {
  getMyProfile: async () => {
    const response = await api.get("/profiles/me");
    return response.data;
  },

  updateMyProfile: async (data: {
    full_name?: string;
    avatar_url?: string;
  }) => {
    const response = await api.put("/profiles/me", data);
    return response.data;
  },

  changeEmail: async (new_email: string) => {
    const response = await api.post("/profiles/change-email", { new_email });
    return response.data;
  },

  changePassword: async (current_password: string, new_password: string) => {
    const response = await api.post("/profiles/change-password", {
      current_password,
      new_password,
    });
    return response.data;
  },

  uploadAvatar: async (
    file_name: string,
    file_type: string,
    base64_data: string,
  ) => {
    const response = await api.post("/profiles/upload-avatar", {
      file_name,
      file_type,
      base64_data,
    });
    return response.data;
  },
};

export default api;
