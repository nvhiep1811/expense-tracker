"use client";

import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import AlertsDropdown from "./AlertsDropdown";

export default function Header({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-header-bg border-b border-header-border px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-muted-text mt-1 truncate">
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <AlertsDropdown />
          <div className="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-4 border-l border-header-border">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              {mounted && user?.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                  unoptimized
                />
              ) : (
                <span className="text-sm sm:text-base text-blue-600 dark:text-blue-400 font-semibold">
                  {mounted ? user?.name?.charAt(0).toUpperCase() || "U" : "U"}
                </span>
              )}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-foreground">
                {mounted ? user?.name || "User" : "User"}
              </p>
              <p className="text-xs text-muted-text">Premium</p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-muted-text hover:text-red-600 dark:hover:text-red-400 transition cursor-pointer"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
