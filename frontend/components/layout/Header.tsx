"use client";

import { Bell, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Header({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const { user, logout } = useAuth();

  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button className="relative p-2 text-gray-400 hover:text-gray-600">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-4 border-l border-gray-200">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm sm:text-base text-blue-600 font-semibold">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-800">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500">Premium</p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-red-600 transition"
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
