"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { setCookie, getCookie, deleteCookie } from "@/lib/cookies";
import toast from "react-hot-toast";
import { authAPI, profilesAPI } from "@/lib/api";
import { logger } from "@/lib/logger";

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggingOut: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Try to restore user from localStorage on mount
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("user_data");
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          localStorage.removeItem("user_data");
        }
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  // Helper to save user data
  const saveUserData = (userData: User | null) => {
    setUser(userData);
    if (typeof window !== "undefined") {
      if (userData) {
        localStorage.setItem("user_data", JSON.stringify(userData));
      } else {
        localStorage.removeItem("user_data");
      }
    }
  };

  // Background refresh without setting loading state
  const refreshUserInBackground = useCallback(async () => {
    try {
      const profile = await profilesAPI.getMyProfile();
      if (profile) {
        const userData = {
          id: profile.id,
          name: profile.full_name || "User",
          email: profile.email || "",
          avatarUrl: profile.avatar_url || undefined,
        };
        saveUserData(userData);
      }
    } catch (error) {
      logger.error("Background refresh failed", error, {
        context: "refreshUserInBackground",
      });
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      // Check for auth_session indicator (non-sensitive cookie)
      const hasSession = getCookie("auth_session");
      if (!hasSession) {
        saveUserData(null);
        setIsLoading(false);
        return;
      }

      // If we have cached user, return it immediately and update in background
      const cached =
        typeof window !== "undefined"
          ? localStorage.getItem("user_data")
          : null;
      if (cached && user) {
        setIsLoading(false);
        // Optionally refresh in background
        refreshUserInBackground();
        return;
      }

      // Get current user profile from backend (httpOnly cookie sent automatically)
      const profile = await profilesAPI.getMyProfile();

      if (profile) {
        const userData = {
          id: profile.id,
          name: profile.full_name || "User",
          email: profile.email || "",
          avatarUrl: profile.avatar_url || undefined,
        };
        saveUserData(userData);
      }
    } catch (error) {
      logger.error("Auth check failed", error, { context: "checkAuth" });
      // Clear invalid session indicator
      deleteCookie("auth_session");
      saveUserData(null);
    } finally {
      setIsLoading(false);
    }
  }, [refreshUserInBackground]); // ← KHÔNG include 'user' để tránh infinite loop

  // Check auth CHỈ MỘT LẦN khi component mount để tránh spam API
  useEffect(() => {
    checkAuth();
  }, []); // ← Empty deps = chỉ run 1 lần khi mount

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });

      if (response.authenticated) {
        // Backend has set httpOnly cookies, we just set a session indicator
        setCookie("auth_session", "1", 7);

        // Use profile from login response (no second API call needed)
        const profile = response.profile;

        if (profile) {
          // Set user data from profile
          const userData = {
            id: profile.id,
            name: profile.full_name || "User",
            email: profile.email || "",
            avatarUrl: profile.avatar_url || undefined,
          };

          saveUserData(userData);
        }

        toast.success(response.message || "Đăng nhập thành công!");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(response.message || "Đăng nhập thất bại.");
      }
    } catch (error) {
      logger.error("Login failed", error, { context: "login" });
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // Backend already validates email, no need for pre-check
      const res = await authAPI.register({
        full_name: name,
        email,
        password,
      });
      toast.success(
        res.message || "Đăng ký thành công! Vui lòng kiểm tra email.",
      );
      router.push("/login");
    } catch (error) {
      logger.error("Registration failed", error, { context: "register" });
      throw error;
    }
  };

  const logout = async () => {
    if (isLoggingOut) {
      return;
    }
    setIsLoggingOut(true);

    // Optimistic logout: clear local session immediately for snappy UX.
    deleteCookie("auth_session");
    saveUserData(null);
    router.push("/");
    router.refresh();

    try {
      const response = await authAPI.logout();
      toast.success(response.message || "Đã đăng xuất thành công!");
    } catch (error) {
      logger.error("Logout failed", error, { context: "logout" });
      // User is already logged out locally; do not block UX with an error toast.
      toast.success("Đã đăng xuất.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const refreshUser = async () => {
    try {
      const hasSession = getCookie("auth_session");
      if (!hasSession) {
        saveUserData(null);
        return;
      }

      const profile = await profilesAPI.getMyProfile();

      if (profile) {
        const userData = {
          id: profile.id,
          name: profile.full_name || "User",
          email: profile.email || user?.email || "",
          avatarUrl: profile.avatar_url || undefined,
        };
        saveUserData(userData);
      }
    } catch (error) {
      logger.error("Failed to refresh user", error, { context: "refreshUser" });
      deleteCookie("auth_session");
      saveUserData(null);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const response = await authAPI.getOAuthUrl("google");
      if (response?.url) {
        window.location.href = response.url;
      } else {
        throw new Error("Invalid OAuth response");
      }
    } catch (error) {
      logger.error("Google login failed", error, {
        context: "loginWithGoogle",
      });
      toast.error("Không thể đăng nhập bằng Google. Vui lòng thử lại!");
      throw error;
    }
  };

  const loginWithFacebook = async () => {
    try {
      const response = await authAPI.getOAuthUrl("facebook");
      if (response?.url) {
        window.location.href = response.url;
      } else {
        throw new Error("Invalid OAuth response");
      }
    } catch (error) {
      logger.error("Facebook login failed", error, {
        context: "loginWithFacebook",
      });
      toast.error("Không thể đăng nhập bằng Facebook. Vui lòng thử lại!");
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggingOut,
        login,
        register,
        logout,
        refreshUser,
        loginWithGoogle,
        loginWithFacebook,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
