"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
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
      const token = localStorage.getItem("auth-token");
      if (token) {
        setUser({
          id: "1",
          name: "Võ Hiệp",
          email: "vohiep@example.com",
        });
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = async (email: string, _password: string) => {
    try {
      const mockUser = {
        id: "1",
        name: "Võ Hiệp",
        email: email,
      };

      setUser(mockUser);
      localStorage.setItem("auth-token", "mock-token-123");
      document.cookie = "auth-token=mock-token-123; path=/";

      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const register = async (name: string, email: string, _password: string) => {
    try {
      console.log("Registered:", { name, email });
      router.push("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth-token");
    document.cookie =
      "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
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
