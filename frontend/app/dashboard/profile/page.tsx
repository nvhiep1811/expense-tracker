"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  useProfileQuery,
  useUpdateProfile,
  useChangeEmail,
  useChangePassword,
  useUploadAvatar,
} from "@/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProfileSchema,
  changeEmailSchema,
  changePasswordSchema,
  type UpdateProfileFormData,
  type ChangeEmailFormData,
  type ChangePasswordFormData,
} from "@/lib/validations";
import toast from "react-hot-toast";
import { User, Mail, Lock, Camera, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Use React Query to fetch profile (cached, auto deduped)
  const { data: profile, isLoading } = useProfileQuery();

  // Mutations
  const updateProfileMutation = useUpdateProfile();
  const changeEmailMutation = useChangeEmail();
  const changePasswordMutation = useChangePassword();
  const uploadAvatarMutation = useUploadAvatar();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form for updating profile info
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    setValue: setProfileValue,
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
  });

  // Form for changing email
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
    reset: resetEmail,
    setValue: setEmailValue,
  } = useForm<ChangeEmailFormData>({
    resolver: zodResolver(changeEmailSchema),
  });

  // Form for changing password
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  // Set form values khi profile data load xong
  useEffect(() => {
    if (profile) {
      setProfileValue("full_name", profile.full_name || "");
      setEmailValue("new_email", profile.email || user?.email || "");
      setAvatarPreview(profile.avatar_url || null);
    }
  }, [profile, setProfileValue, setEmailValue, user?.email]);

  const onSubmitProfile = async (data: UpdateProfileFormData) => {
    await updateProfileMutation.mutateAsync({ full_name: data.full_name });
    await refreshUser(); // Update header display
  };

  const onSubmitEmail = async (data: ChangeEmailFormData) => {
    await changeEmailMutation.mutateAsync(data.new_email);
    resetEmail();
  };

  const onSubmitPassword = async (data: ChangePasswordFormData) => {
    await changePasswordMutation.mutateAsync({
      currentPassword: data.current_password,
      newPassword: data.new_password,
    });
    resetPassword();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước file không được vượt quá 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setAvatarPreview(base64String);

      try {
        await uploadAvatarMutation.mutateAsync({
          fileName: file.name,
          fileType: file.type,
          base64Data: base64String,
        });
        await refreshUser();
      } catch {
        // Reset preview on error
        setAvatarPreview(profile?.avatar_url || null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Wait for both auth and profile to load
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 pb-12">
      {/* Header with Avatar */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-4 sm:p-8 mb-6 sm:mb-8 text-white">
        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:space-x-6">
          <div className="relative group">
            {avatarPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-white/20 border-4 border-white shadow-lg flex items-center justify-center text-2xl sm:text-4xl font-bold">
                {user?.name?.[0]?.toUpperCase() ||
                  user?.email?.[0]?.toUpperCase() ||
                  "?"}
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadAvatarMutation.isPending}
              className="absolute bottom-0 right-0 p-1.5 sm:p-2 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg disabled:bg-gray-400 transition-colors disabled:cursor-not-allowed"
            >
              {uploadAvatarMutation.isPending ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">
              {profile?.full_name || "Người dùng"}
            </h1>
            <p className="text-white/80 flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base">
              <Mail className="w-4 h-4" />
              <span className="truncate max-w-50 sm:max-w-none">
                {profile?.email || user?.email || "Chưa có email"}
              </span>
            </p>
            <p className="text-white/60 text-xs sm:text-sm mt-1 sm:mt-2">
              Quản lý thông tin cá nhân và bảo mật tài khoản của bạn
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <div className="bg-card-bg rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Thông tin cơ bản
            </h2>
          </div>
          <form onSubmit={handleSubmitProfile(onSubmitProfile)}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Họ và tên
              </label>
              <input
                type="text"
                {...registerProfile("full_name")}
                className="w-full px-4 py-3 border border-input-border bg-input-bg text-foreground rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Nhập họ và tên"
              />
              {profileErrors.full_name && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠</span>
                  {profileErrors.full_name.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 dark:disabled:from-gray-600 dark:disabled:to-gray-600 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                "Cập nhật thông tin"
              )}
            </button>
          </form>
        </div>

        {/* Change Email */}
        <div className="bg-card-bg rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Thay đổi email
            </h2>
          </div>
          <form onSubmit={handleSubmitEmail(onSubmitEmail)}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Email mới
              </label>
              <input
                type="email"
                {...registerEmail("new_email")}
                className="w-full px-4 py-3 border border-input-border bg-input-bg text-foreground rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Nhập email mới"
              />
              {emailErrors.new_email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠</span>
                  {emailErrors.new_email.message}
                </p>
              )}
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                💡 Bạn sẽ nhận được email xác nhận tại địa chỉ mới. Email chỉ
                được thay đổi sau khi xác nhận.
              </p>
            </div>
            <button
              type="submit"
              disabled={changeEmailMutation.isPending}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-400 dark:disabled:from-gray-600 dark:disabled:to-gray-600 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {changeEmailMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                "Gửi yêu cầu thay đổi"
              )}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-card-bg rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Thay đổi mật khẩu
            </h2>
          </div>
          <form
            onSubmit={handleSubmitPassword(onSubmitPassword)}
            className="grid grid-cols-1 lg:grid-cols-3 gap-4"
          >
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-foreground mb-2">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                {...registerPassword("current_password")}
                className="w-full px-4 py-3 border border-input-border bg-input-bg text-foreground rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Nhập mật khẩu hiện tại"
              />
              {passwordErrors.current_password && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠</span>
                  {passwordErrors.current_password.message}
                </p>
              )}
            </div>
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-foreground mb-2">
                Mật khẩu mới
              </label>
              <input
                type="password"
                {...registerPassword("new_password")}
                className="w-full px-4 py-3 border border-input-border bg-input-bg text-foreground rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Nhập mật khẩu mới"
              />
              {passwordErrors.new_password && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠</span>
                  {passwordErrors.new_password.message}
                </p>
              )}
            </div>
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-foreground mb-2">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                {...registerPassword("confirm_password")}
                className="w-full px-4 py-3 border border-input-border bg-input-bg text-foreground rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Nhập lại mật khẩu mới"
              />
              {passwordErrors.confirm_password && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠</span>
                  {passwordErrors.confirm_password.message}
                </p>
              )}
            </div>
            <div className="lg:col-span-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3 mb-2">
              <p className="text-xs text-purple-800 dark:text-purple-300">
                🔒 Mật khẩu phải có ít nhất 8 ký tự bao gồm chữ hoa, chữ thường,
                số và ký tự đặc biệt (@$!%*?&#)
              </p>
            </div>
            <div className="lg:col-span-3">
              <button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-400 dark:disabled:from-gray-600 dark:disabled:to-gray-600 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {changePasswordMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  "Thay đổi mật khẩu"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
