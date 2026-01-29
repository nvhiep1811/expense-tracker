"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "@/lib/cookies";
import { profilesAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { logger } from "@/lib/logger";

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    // Ngăn chạy nhiều lần
    if (hasProcessedRef.current) return;
    hasProcessedRef.current = true;

    const handleCallback = async () => {
      try {
        // Lấy params từ hash hoặc query string
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1),
        );
        const queryParams = new URLSearchParams(window.location.search);

        const getParam = (key: string) =>
          hashParams.get(key) || queryParams.get(key);

        const accessToken = getParam("access_token");
        const refreshToken = getParam("refresh_token");
        const type = getParam("type");
        const error = getParam("error");
        const errorDescription = getParam("error_description");

        // Xử lý lỗi
        if (error) {
          logger.error("Auth error in callback", undefined, {
            error,
            errorDescription,
          });
          setStatus("error");

          // Parse error description for better user message
          let userMessage = "Xác thực không thành công. Vui lòng thử lại.";
          if (errorDescription) {
            const decoded = decodeURIComponent(
              errorDescription.replace(/\+/g, " "),
            );
            userMessage = decoded;
          }

          toast.error(userMessage, { duration: 5000 });
          setTimeout(() => router.push("/login"), 3000);
          return;
        }

        // Kiểm tra token
        if (!accessToken) {
          logger.error("No access token found in callback", undefined, {
            context: "callback",
          });
          setStatus("error");
          toast.error("Không tìm thấy token xác thực.");
          setTimeout(() => router.push("/login"), 2000);
          return;
        }

        setStatus("success");

        // Xóa hash/query khỏi URL
        window.history.replaceState(null, "", window.location.pathname);

        // Xử lý theo loại xác thực
        if (type === "recovery") {
          // QUAN TRỌNG: Với recovery, KHÔNG lưu vào cookie
          // Chỉ lưu tạm vào sessionStorage để dùng khi reset password
          sessionStorage.setItem("recovery_token", accessToken);
          if (refreshToken) {
            sessionStorage.setItem("recovery_refresh_token", refreshToken);
          }

          toast.success("Xác thực thành công! Vui lòng đặt lại mật khẩu.");
          router.replace("/reset-password");
        } else if (type === "email_change") {
          // Xử lý xác nhận thay đổi email
          setCookie("access_token", accessToken, 7);
          if (refreshToken) {
            setCookie("refresh_token", refreshToken, 30);
          }

          toast.success(
            "Thay đổi email thành công! Email của bạn đã được cập nhật.",
            { duration: 5000 },
          );
          setTimeout(() => router.replace("/dashboard/profile"), 1000);
        } else {
          // Với signup, login bình thường hoặc OAuth, lưu vào cookie
          setCookie("access_token", accessToken, 7);
          if (refreshToken) {
            setCookie("refresh_token", refreshToken, 30);
          }

          // Lấy profile (không chặn flow nếu thất bại)
          try {
            await profilesAPI.getMyProfile();
          } catch (err) {
            logger.warn("Failed to fetch profile in callback", { error: err });
            // Continue anyway, profile will be fetched on dashboard
          }

          if (type === "signup") {
            toast.success(
              "Xác thực email thành công! Chào mừng bạn đến với ứng dụng.",
            );
          } else if (!type) {
            // OAuth login - không có type parameter
            toast.success("Đăng nhập thành công!");
          } else {
            toast.success("Xác thực thành công!");
          }

          setTimeout(() => router.replace("/dashboard"), 1000);
        }
      } catch (error) {
        logger.error("Callback error", error, { context: "handleCallback" });
        setStatus("error");
        toast.error("Có lỗi xảy ra trong quá trình xác thực.");
        setTimeout(() => router.push("/login"), 2000);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <div className="flex justify-center mb-4">
              <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Đang xác thực...
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Vui lòng đợi trong giây lát
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Xác thực thành công!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Đang chuyển hướng...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Xác thực thất bại
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Đang chuyển về trang đăng nhập...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
