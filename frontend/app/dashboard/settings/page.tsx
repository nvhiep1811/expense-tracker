"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import type { Theme } from "@/contexts/ThemeContext";
import { profilesAPI } from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import Header from "@/components/layout/Header";
import {
  User,
  Mail,
  Lock,
  Globe,
  Calendar,
  DollarSign,
  Bell,
  Shield,
  Database,
  Loader2,
  Sun,
  Moon,
  Monitor,
  Save,
  AlertCircle,
} from "lucide-react";

// Validation schemas
const profileSettingsSchema = z.object({
  full_name: z.string().min(1, "Tên không được để trống"),
});

const emailSettingsSchema = z.object({
  new_email: z.string().email("Email không hợp lệ"),
});

const passwordSettingsSchema = z
  .object({
    current_password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    new_password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirm_password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirm_password"],
  });

const preferencesSchema = z.object({
  default_currency: z.string().min(1, "Vui lòng chọn loại tiền"),
  timezone: z.string().min(1, "Vui lòng chọn múi giờ"),
  month_start_day: z.number().min(1).max(28),
});

type ProfileFormData = z.infer<typeof profileSettingsSchema>;
type EmailFormData = z.infer<typeof emailSettingsSchema>;
type PasswordFormData = z.infer<typeof passwordSettingsSchema>;
type PreferencesFormData = z.infer<typeof preferencesSchema>;

interface Profile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  default_currency: string;
  timezone: string;
  month_start_day: number;
  created_at: string;
  updated_at: string;
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "preferences" | "notifications" | "data"
  >("profile");

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors, isSubmitting: profileSubmitting },
    setValue: setProfileValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSettingsSchema),
  });

  // Email form
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors, isSubmitting: emailSubmitting },
    reset: resetEmail,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSettingsSchema),
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors, isSubmitting: passwordSubmitting },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSettingsSchema),
  });

  // Preferences form
  const {
    register: registerPreferences,
    handleSubmit: handleSubmitPreferences,
    formState: {
      errors: preferencesErrors,
      isSubmitting: preferencesSubmitting,
    },
    setValue: setPreferencesValue,
  } = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
  });

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await profilesAPI.getMyProfile();
      setProfile(data);
      setProfileValue("full_name", data.full_name || "");
      setPreferencesValue("default_currency", data.default_currency || "VND");
      setPreferencesValue("timezone", data.timezone || "Asia/Ho_Chi_Minh");
      setPreferencesValue("month_start_day", data.month_start_day || 1);
    } catch {
      toast.error("Không thể tải thông tin cài đặt");
    } finally {
      setLoading(false);
    }
  };

  const onUpdateProfile = async (data: ProfileFormData) => {
    try {
      await profilesAPI.updateMyProfile({ full_name: data.full_name });
      toast.success("Cập nhật thông tin thành công!");
      fetchProfile();
    } catch {
      toast.error("Không thể cập nhật thông tin");
    }
  };

  const onChangeEmail = async (data: EmailFormData) => {
    try {
      await profilesAPI.changeEmail(data.new_email);
      toast.success(
        "Yêu cầu thay đổi email đã được gửi. Vui lòng kiểm tra hộp thư!",
      );
      resetEmail();
    } catch {
      toast.error("Không thể thay đổi email");
    }
  };

  const onChangePassword = async (data: PasswordFormData) => {
    try {
      await profilesAPI.changePassword(
        data.current_password,
        data.new_password,
      );
      toast.success("Mật khẩu đã được thay đổi thành công!");
      resetPassword();
    } catch {
      toast.error(
        "Không thể thay đổi mật khẩu. Vui lòng kiểm tra mật khẩu hiện tại.",
      );
    }
  };

  const onUpdatePreferences = async (data: PreferencesFormData) => {
    try {
      await profilesAPI.updateMyProfile({
        default_currency: data.default_currency,
        timezone: data.timezone,
        month_start_day: data.month_start_day,
      });
      toast.success("Cập nhật tùy chọn thành công!");
      fetchProfile();
    } catch {
      toast.error("Không thể cập nhật tùy chọn");
    }
  };

  const tabs = [
    { id: "profile", label: "Hồ sơ", icon: User },
    { id: "security", label: "Bảo mật", icon: Shield },
    { id: "preferences", label: "Tùy chọn", icon: Globe },
    { id: "notifications", label: "Thông báo", icon: Bell },
    { id: "data", label: "Dữ liệu", icon: Database },
  ];

  const currencies = [
    { value: "VND", label: "₫ - Việt Nam Đồng" },
    { value: "USD", label: "$ - US Dollar" },
    { value: "EUR", label: "€ - Euro" },
    { value: "GBP", label: "£ - British Pound" },
    { value: "JPY", label: "¥ - Japanese Yen" },
    { value: "CNY", label: "¥ - Chinese Yuan" },
  ];

  const timezones = [
    { value: "Asia/Ho_Chi_Minh", label: "Việt Nam (GMT+7)" },
    { value: "Asia/Bangkok", label: "Thailand (GMT+7)" },
    { value: "Asia/Singapore", label: "Singapore (GMT+8)" },
    { value: "Asia/Tokyo", label: "Japan (GMT+9)" },
    { value: "America/New_York", label: "New York (GMT-5)" },
    { value: "America/Los_Angeles", label: "Los Angeles (GMT-8)" },
    { value: "Europe/London", label: "London (GMT+0)" },
  ];

  const themeOptions = [
    { value: "light", label: "Sáng", icon: Sun },
    { value: "dark", label: "Tối", icon: Moon },
    { value: "system", label: "Hệ thống", icon: Monitor },
  ];

  if (loading) {
    return (
      <>
        <Header title="Cài đặt" subtitle="Quản lý cài đặt tài khoản của bạn" />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="Cài đặt" subtitle="Quản lý cài đặt tài khoản của bạn" />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card-bg rounded-xl border border-card-border overflow-hidden">
            <div className="flex border-b border-card-border overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                      isActive
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-muted-text hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="p-6">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Thông tin cá nhân
                    </h3>
                    <form
                      onSubmit={handleSubmitProfile(onUpdateProfile)}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-text" />
                          <input
                            type="email"
                            value={profile?.email || ""}
                            disabled
                            className="w-full pl-10 pr-4 py-2.5 bg-hover-bg border border-card-border rounded-lg text-muted-text cursor-not-allowed"
                          />
                        </div>
                        <p className="text-xs text-muted-text mt-1">
                          Email không thể chỉnh sửa ở đây. Vui lòng sử dụng tab
                          Bảo mật để thay đổi.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Họ và tên
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-text" />
                          <input
                            {...registerProfile("full_name")}
                            type="text"
                            className="w-full pl-10 pr-4 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                            placeholder="Nhập họ tên"
                          />
                        </div>
                        {profileErrors.full_name && (
                          <p className="text-xs text-red-500 mt-1">
                            {profileErrors.full_name.message}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={profileSubmitting}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {profileSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          {profileSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Thay đổi Email
                    </h3>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                      <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
                        <div className="text-sm text-yellow-800 dark:text-yellow-200">
                          <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                          <p>
                            Sau khi thay đổi email, bạn sẽ cần xác nhận email
                            mới qua link được gửi đến hộp thư. Bạn sẽ cần đăng
                            nhập lại sau khi xác nhận.
                          </p>
                        </div>
                      </div>
                    </div>
                    <form
                      onSubmit={handleSubmitEmail(onChangeEmail)}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email hiện tại
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-text" />
                          <input
                            type="email"
                            value={profile?.email || ""}
                            disabled
                            className="w-full pl-10 pr-4 py-2.5 bg-hover-bg border border-card-border rounded-lg text-muted-text cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email mới
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-text" />
                          <input
                            {...registerEmail("new_email")}
                            type="email"
                            className="w-full pl-10 pr-4 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                            placeholder="Nhập email mới"
                          />
                        </div>
                        {emailErrors.new_email && (
                          <p className="text-xs text-red-500 mt-1">
                            {emailErrors.new_email.message}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={emailSubmitting}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {emailSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Mail className="w-4 h-4" />
                          )}
                          {emailSubmitting ? "Đang xử lý..." : "Thay đổi email"}
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="border-t border-card-border pt-8">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Thay đổi mật khẩu
                    </h3>
                    <form
                      onSubmit={handleSubmitPassword(onChangePassword)}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Mật khẩu hiện tại
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-text" />
                          <input
                            {...registerPassword("current_password")}
                            type="password"
                            className="w-full pl-10 pr-4 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                            placeholder="Nhập mật khẩu hiện tại"
                          />
                        </div>
                        {passwordErrors.current_password && (
                          <p className="text-xs text-red-500 mt-1">
                            {passwordErrors.current_password.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Mật khẩu mới
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-text" />
                          <input
                            {...registerPassword("new_password")}
                            type="password"
                            className="w-full pl-10 pr-4 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                            placeholder="Nhập mật khẩu mới"
                          />
                        </div>
                        {passwordErrors.new_password && (
                          <p className="text-xs text-red-500 mt-1">
                            {passwordErrors.new_password.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Xác nhận mật khẩu mới
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-text" />
                          <input
                            {...registerPassword("confirm_password")}
                            type="password"
                            className="w-full pl-10 pr-4 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                            placeholder="Nhập lại mật khẩu mới"
                          />
                        </div>
                        {passwordErrors.confirm_password && (
                          <p className="text-xs text-red-500 mt-1">
                            {passwordErrors.confirm_password.message}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={passwordSubmitting}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {passwordSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Lock className="w-4 h-4" />
                          )}
                          {passwordSubmitting
                            ? "Đang xử lý..."
                            : "Thay đổi mật khẩu"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === "preferences" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Giao diện
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-3">
                          Chế độ giao diện
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {themeOptions.map((option) => {
                            const Icon = option.icon;
                            const isSelected = theme === option.value;
                            return (
                              <button
                                key={option.value}
                                onClick={() => setTheme(option.value as Theme)}
                                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                                  isSelected
                                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                                    : "border-card-border bg-background hover:border-blue-300"
                                }`}
                              >
                                <Icon
                                  className={`w-6 h-6 ${isSelected ? "text-blue-600" : "text-muted-text"}`}
                                />
                                <span
                                  className={`text-sm font-medium ${isSelected ? "text-blue-600" : "text-foreground"}`}
                                >
                                  {option.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-card-border pt-8">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Tùy chọn khu vực
                    </h3>
                    <form
                      onSubmit={handleSubmitPreferences(onUpdatePreferences)}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Loại tiền mặc định
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-text" />
                          <select
                            {...registerPreferences("default_currency")}
                            className="w-full pl-10 pr-4 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground appearance-none"
                          >
                            {currencies.map((curr) => (
                              <option key={curr.value} value={curr.value}>
                                {curr.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        {preferencesErrors.default_currency && (
                          <p className="text-xs text-red-500 mt-1">
                            {preferencesErrors.default_currency.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Múi giờ
                        </label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-text" />
                          <select
                            {...registerPreferences("timezone")}
                            className="w-full pl-10 pr-4 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground appearance-none"
                          >
                            {timezones.map((tz) => (
                              <option key={tz.value} value={tz.value}>
                                {tz.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        {preferencesErrors.timezone && (
                          <p className="text-xs text-red-500 mt-1">
                            {preferencesErrors.timezone.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Ngày bắt đầu tháng
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-text" />
                          <select
                            {...registerPreferences("month_start_day", {
                              valueAsNumber: true,
                            })}
                            className="w-full pl-10 pr-4 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground appearance-none"
                          >
                            {Array.from({ length: 28 }, (_, i) => i + 1).map(
                              (day) => (
                                <option key={day} value={day}>
                                  Ngày {day}
                                </option>
                              ),
                            )}
                          </select>
                        </div>
                        <p className="text-xs text-muted-text mt-1">
                          Chọn ngày bắt đầu chu kỳ tháng cho báo cáo và ngân
                          sách
                        </p>
                        {preferencesErrors.month_start_day && (
                          <p className="text-xs text-red-500 mt-1">
                            {preferencesErrors.month_start_day.message}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={preferencesSubmitting}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {preferencesSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          {preferencesSubmitting
                            ? "Đang lưu..."
                            : "Lưu thay đổi"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Cài đặt thông báo
                    </h3>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex gap-3">
                        <Bell className="w-5 h-5 text-blue-600 dark:text-blue-500 shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800 dark:text-blue-200">
                          <p className="font-medium mb-1">
                            Tính năng đang phát triển
                          </p>
                          <p>
                            Cài đặt thông báo sẽ sớm được bổ sung. Bạn sẽ có thể
                            tùy chỉnh thông báo qua email, push notification và
                            nhiều kênh khác.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Tab */}
              {activeTab === "data" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Quản lý dữ liệu
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-card-bg border border-card-border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-foreground mb-1">
                              Xuất dữ liệu
                            </h4>
                            <p className="text-sm text-muted-text">
                              Tải xuống toàn bộ dữ liệu của bạn dưới dạng file
                              JSON
                            </p>
                          </div>
                          <button
                            disabled
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed"
                          >
                            Sắp có
                          </button>
                        </div>
                      </div>

                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-red-700 dark:text-red-400 mb-1">
                              Xóa tài khoản
                            </h4>
                            <p className="text-sm text-red-600 dark:text-red-300">
                              Xóa vĩnh viễn tài khoản và toàn bộ dữ liệu của
                              bạn. Hành động này không thể hoàn tác.
                            </p>
                          </div>
                          <button
                            disabled
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed whitespace-nowrap"
                          >
                            Sắp có
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-card-border pt-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Thông tin tài khoản
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-text">ID tài khoản:</span>
                        <span className="text-foreground font-mono text-xs">
                          {profile?.id}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-text">Ngày tạo:</span>
                        <span className="text-foreground">
                          {profile?.created_at
                            ? new Date(profile.created_at).toLocaleDateString(
                                "vi-VN",
                              )
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-text">
                          Cập nhật lần cuối:
                        </span>
                        <span className="text-foreground">
                          {profile?.updated_at
                            ? new Date(profile.updated_at).toLocaleDateString(
                                "vi-VN",
                              )
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
