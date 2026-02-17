import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profilesAPI } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import toast from "react-hot-toast";

interface UpdateProfileData {
  full_name?: string;
  avatar_url?: string;
  default_currency?: string;
  timezone?: string;
  month_start_day?: number;
}

/**
 * Hook để cập nhật profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileData) => profilesAPI.updateMyProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
      toast.success("Cập nhật thông tin thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Không thể cập nhật thông tin");
    },
  });
}

/**
 * Hook để thay đổi email
 */
export function useChangeEmail() {
  return useMutation({
    mutationFn: (newEmail: string) => profilesAPI.changeEmail(newEmail),
    onSuccess: (data) => {
      toast.success(data.message || "Đã gửi email xác nhận!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Không thể thay đổi email");
    },
  });
}

/**
 * Hook để thay đổi password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => profilesAPI.changePassword(currentPassword, newPassword),
    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Không thể đổi mật khẩu");
    },
  });
}

/**
 * Hook để upload avatar
 */
export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      fileName,
      fileType,
      base64Data,
    }: {
      fileName: string;
      fileType: string;
      base64Data: string;
    }) => profilesAPI.uploadAvatar(fileName, fileType, base64Data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
      toast.success("Cập nhật avatar thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Không thể upload avatar");
    },
  });
}
