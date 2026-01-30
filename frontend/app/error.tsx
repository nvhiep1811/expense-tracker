"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console (hoặc gửi lên error tracking service)
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
            <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-500" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Đã có lỗi xảy ra
          </h1>
          <p className="text-muted-text">
            Xin lỗi vì sự bất tiện này. Chúng tôi đang khắc phục sự cố.
          </p>
        </div>

        {/* Error Details (only in development) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg text-left">
            <p className="text-sm font-mono text-red-800 dark:text-red-200 break-all">
              {error.message || "Unknown error"}
            </p>
            {error.digest && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <RefreshCw className="w-5 h-5" />
            Thử lại
          </button>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3 bg-card-bg border border-card-border text-foreground rounded-lg hover:bg-hover-bg transition-colors font-medium"
          >
            <Home className="w-5 h-5" />
            Về trang chủ
          </Link>
        </div>

        {/* Help Info */}
        <div className="mt-12 pt-8 border-t border-card-border">
          <p className="text-sm text-muted-text mb-4">
            Nếu lỗi vẫn tiếp diễn, vui lòng:
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
            <button
              onClick={() => window.location.reload()}
              className="text-blue-600 dark:text-blue-500 hover:underline"
            >
              Tải lại trang
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
              className="text-blue-600 dark:text-blue-500 hover:underline"
            >
              Xóa cache và đăng nhập lại
            </button>
          </div>
        </div>

        {/* Technical Support */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 Nếu vấn đề không được giải quyết, vui lòng liên hệ bộ phận hỗ trợ
            kỹ thuật.
          </p>
        </div>
      </div>
    </div>
  );
}
