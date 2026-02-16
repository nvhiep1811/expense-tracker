"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getCookie } from "@/lib/cookies";
import { useRouter } from "next/navigation";
import {
  User,
  Cookie,
  Database,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Home,
  LogOut,
} from "lucide-react";

interface DebugInfo {
  user: {
    id?: string;
    name?: string;
    email?: string;
    avatarUrl?: string;
  } | null;
  cookies: {
    accessToken: string | null;
    refreshToken: string | null;
  };
  localStorage: {
    userData: string | null;
  };
  timestamp: string;
}

export default function AuthDebugPage() {
  const { user, isLoading, refreshUser, logout } = useAuth();
  const router = useRouter();
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const collectDebugInfo = () => {
    const accessToken = getCookie("access_token");
    const refreshToken = getCookie("refresh_token");
    const userData = localStorage.getItem("user_data");

    setDebugInfo({
      user: user
        ? {
            id: user.id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
          }
        : null,
      cookies: {
        accessToken: accessToken || null,
        refreshToken: refreshToken || null,
      },
      localStorage: {
        userData: userData || null,
      },
      timestamp: new Date().toISOString(),
    });
  };

  useEffect(() => {
    collectDebugInfo();
  }, [user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshUser();
      collectDebugInfo();
    } catch (error) {
      console.error("Failed to refresh user:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const hasValidAuth =
    user && debugInfo?.cookies.accessToken && debugInfo?.cookies.refreshToken;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Auth Debug
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Thông tin chi tiết về trạng thái xác thực
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {hasValidAuth ? (
                <>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Authenticated
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      All authentication checks passed
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-8 h-8 text-red-500" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Authentication Issues Detected
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Please check the details below
                    </p>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing || isLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              User Information
            </h3>
            {user ? (
              <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 ml-auto" />
            )}
          </div>
          {isLoading ? (
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          ) : user ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    User ID
                  </p>
                  <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
                    {user.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Name
                  </p>
                  <p className="font-mono text-sm text-gray-900 dark:text-white">
                    {user.name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Email
                  </p>
                  <p className="font-mono text-sm text-gray-900 dark:text-white">
                    {user.email || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Avatar URL
                  </p>
                  <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
                    {user.avatarUrl || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-red-600 dark:text-red-400">
              <p>❌ No user data found</p>
            </div>
          )}
        </div>

        {/* Cookies */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Cookie className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Cookies
            </h3>
            {debugInfo?.cookies.accessToken &&
            debugInfo?.cookies.refreshToken ? (
              <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 ml-auto" />
            )}
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Access Token
                </p>
                {debugInfo?.cookies.accessToken ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
              <p className="font-mono text-xs text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 p-2 rounded break-all">
                {debugInfo?.cookies.accessToken
                  ? `${debugInfo.cookies.accessToken.substring(0, 50)}...`
                  : "Not found"}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Refresh Token
                </p>
                {debugInfo?.cookies.refreshToken ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
              <p className="font-mono text-xs text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 p-2 rounded break-all">
                {debugInfo?.cookies.refreshToken
                  ? `${debugInfo.cookies.refreshToken.substring(0, 50)}...`
                  : "Not found"}
              </p>
            </div>
          </div>
        </div>

        {/* Local Storage */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Local Storage
            </h3>
            {debugInfo?.localStorage.userData ? (
              <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-500 ml-auto" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm text-gray-500 dark:text-gray-500">
                user_data
              </p>
              {debugInfo?.localStorage.userData ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-500" />
              )}
            </div>
            <p className="font-mono text-xs text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 p-2 rounded break-all">
              {debugInfo?.localStorage.userData || "Not found"}
            </p>
          </div>
        </div>

        {/* Timestamp */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-500">
          Last updated:{" "}
          {debugInfo?.timestamp
            ? new Date(debugInfo.timestamp).toLocaleString()
            : "N/A"}
        </div>
      </div>
    </div>
  );
}
