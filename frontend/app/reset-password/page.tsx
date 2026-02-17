"use client";

import { useState, useEffect } from "react";
import { Lock, ArrowLeft, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { authAPI } from "@/lib/api";
import { setCookie } from "@/lib/cookies";
import PasswordStrengthMeter from "@/components/ui/PasswordStrengthMeter";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/lib/validations";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const newPassword = watch("newPassword");

  useEffect(() => {
    // Kiểm tra có recovery token không
    const token = sessionStorage.getItem("recovery_token");
    if (!token) {
      toast.error("Phiên đặt lại mật khẩu đã hết hạn hoặc không hợp lệ.");
      router.push("/forgot-password");
    } else {
      setHasToken(true);
    }
  }, [router]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);

    try {
      const accessToken = sessionStorage.getItem("recovery_token");
      const refreshToken = sessionStorage.getItem("recovery_refresh_token");

      if (!accessToken) {
        toast.error("Token không hợp lệ. Vui lòng thử lại.");
        router.push("/forgot-password");
        return;
      }

      // Gọi API reset password với token
      const response = await authAPI.resetPassword(
        data.newPassword,
        accessToken,
      );

      toast.success(response.message);

      // Sau khi reset thành công, LƯU token vào cookie
      setCookie("access_token", accessToken, 7);
      if (refreshToken) {
        setCookie("refresh_token", refreshToken, 30);
      }

      // Xóa token khỏi sessionStorage
      sessionStorage.removeItem("recovery_token");
      sessionStorage.removeItem("recovery_refresh_token");

      // Chuyển hướng đến dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error && "response" in err
          ? (err as Error & { response?: { data?: { message?: string } } })
              .response?.data?.message
          : undefined;
      toast.error(
        errorMessage || "Không thể đặt lại mật khẩu. Vui lòng thử lại.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasToken) {
    return null; // hoặc loading spinner
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <Lock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Đặt lại mật khẩu
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Nhập mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Mật khẩu mới
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                autoComplete="new-password"
                {...register("newPassword")}
                className={`block w-full pl-10 pr-10 py-2 border ${
                  errors.newPassword
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                } rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-gray-100`}
                placeholder="Nhập mật khẩu mới"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.newPassword.message}
              </p>
            )}
            {newPassword && <PasswordStrengthMeter password={newPassword} />}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                {...register("confirmPassword")}
                className={`block w-full pl-10 pr-10 py-2 border ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                } rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-gray-100`}
                placeholder="Nhập lại mật khẩu mới"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
              Yêu cầu mật khẩu:
            </p>
            <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
              <li className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Ít nhất 8 ký tự
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Có chữ hoa và chữ thường
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Có ít nhất một chữ số
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Có ít nhất một ký tự đặc biệt (@$!%*?&#)
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                Đang xử lý...
              </>
            ) : (
              "Đặt lại mật khẩu"
            )}
          </button>
        </form>

        {/* Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sau khi đặt lại mật khẩu, bạn sẽ được chuyển đến dashboard.
          </p>
        </div>

        {/* Back to Login */}
        <div className="mt-4">
          <Link
            href="/login"
            className="flex items-center justify-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
