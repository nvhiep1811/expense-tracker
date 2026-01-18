"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authAPI, profilesAPI } from "@/lib/api";
import { setCookie, getCookie, deleteCookie } from "@/lib/cookies";
import toast from "react-hot-toast";

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = getCookie("access_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Get current user profile from backend
      const profile = await profilesAPI.getMyProfile();

      if (profile) {
        setUser({
          id: profile.id,
          name: profile.full_name || "User",
          email: profile.email || "",
          avatarUrl: profile.avatar_url || undefined,
        });
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // Clear invalid token
      deleteCookie("access_token");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });

      if (response.session?.access_token) {
        // Save token to cookie only
        setCookie("access_token", response.session.access_token, 7);

        // Fetch user profile from profiles/me
        const profile = await profilesAPI.getMyProfile();

        // Set user data from profile
        const userData = {
          id: profile.id,
          name: profile.full_name || "User",
          email: response.session.user.email || "",
          avatarUrl: profile.avatar_url || undefined,
        };

        setUser(userData);

        toast.success(response.message || "Đăng nhập thành công!");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(response.message || "Đăng nhập thất bại.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const emailCheck = await authAPI.checkEmail(email);
      if (emailCheck.exists) {
        toast.error(emailCheck.message || "Email đã được đăng ký.");
        return;
      }
      const res = await authAPI.register({
        full_name: name,
        email,
        password,
      });
      toast.success(
        res.message || "Đăng ký thành công! Vui lòng kiểm tra email."
      );
      router.push("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await authAPI.logout();

      deleteCookie("access_token");
      deleteCookie("refresh_token");
      setUser(null);

      toast.success(response.message || "Đã đăng xuất thành công!");
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      deleteCookie("access_token");
      deleteCookie("refresh_token");
      setUser(null);
      toast.error("Đăng xuất thất bại!");
      router.push("/");
    }
  };

  const refreshUser = async () => {
    try {
      const token = getCookie("access_token");
      if (!token) {
        setUser(null);
        return;
      }

      const profile = await profilesAPI.getMyProfile();

      if (profile) {
        setUser({
          id: profile.id,
          name: profile.full_name || "User",
          email: profile.email || "",
          avatarUrl: profile.avatar_url || undefined,
        });
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      deleteCookie("access_token");
      deleteCookie("refresh_token");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout, refreshUser }}
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
