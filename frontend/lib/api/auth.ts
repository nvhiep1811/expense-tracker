import api from "./client";
import type { Profile } from "@/types";

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

  getOAuthUrl: async (provider: "google" | "facebook") => {
    const response = await api.post("/auth/oauth", { provider });
    return response.data;
  },
};

export const profilesAPI = {
  getMyProfile: async (): Promise<Profile> => {
    const response = await api.get("/profiles/me");
    return response.data;
  },

  updateMyProfile: async (data: {
    full_name?: string;
    avatar_url?: string;
  }): Promise<Profile> => {
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
