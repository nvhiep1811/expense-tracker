"use client";

import Link from "next/link";
import { Home, Search, ArrowLeft, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function NotFound() {
  const { user, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600 dark:text-blue-500 mb-4">
            404
          </h1>
          <div className="flex items-center justify-center gap-2 text-muted-text">
            <Search className="w-6 h-6" />
            <p className="text-xl">Trang không tồn tại</p>
          </div>
        </div>

        {/* Message */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            Rất tiếc, chúng tôi không tìm thấy trang này
          </h2>
          <p className="text-muted-text max-w-md mx-auto">
            Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời
            không khả dụng.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={user ? "/dashboard" : "/"}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Home className="w-5 h-5" />
            Về trang chủ
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-card-bg border border-card-border text-foreground rounded-lg hover:bg-hover-bg transition-colors font-medium cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
        </div>

        {/* Helpful Links - Conditional based on auth */}
        {!isLoading && (
          <div className="mt-12 pt-8 border-t border-card-border">
            {user ? (
              // Logged in users - Show dashboard links
              <>
                <p className="text-sm text-muted-text mb-4">
                  Hoặc bạn có thể truy cập:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                  <Link
                    href="/dashboard/transactions"
                    className="text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Giao dịch
                  </Link>
                  <Link
                    href="/dashboard/budgets"
                    className="text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Ngân sách
                  </Link>
                  <Link
                    href="/dashboard/accounts"
                    className="text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Tài khoản
                  </Link>
                  <Link
                    href="/dashboard/reports"
                    className="text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Báo cáo
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Cài đặt
                  </Link>
                </div>
              </>
            ) : (
              // Not logged in - Show auth links
              <>
                <p className="text-sm text-muted-text mb-4">
                  Bạn chưa đăng nhập?
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <LogIn className="w-4 h-4" />
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-2 px-6 py-2.5 border border-blue-600 text-blue-600 dark:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm font-medium"
                  >
                    <UserPlus className="w-4 h-4" />
                    Đăng ký
                  </Link>
                </div>
              </>
            )}
          </div>
        )}

        {/* Support Info */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ với chúng tôi để
            được hỗ trợ.
          </p>
        </div>
      </div>
    </div>
  );
}
