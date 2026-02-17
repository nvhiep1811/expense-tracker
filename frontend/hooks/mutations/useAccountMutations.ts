import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountsAPI } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type {
  Account,
  CreateAccountRequest,
  UpdateAccountRequest,
} from "@/types";
import toast from "react-hot-toast";

/**
 * Hook để tạo account mới
 */
export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAccountRequest) => accountsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
      toast.success("Thêm tài khoản thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Không thể thêm tài khoản");
    },
  });
}

/**
 * Hook để cập nhật account
 */
export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountRequest }) =>
      accountsAPI.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.accounts.detail(id),
      });
      toast.success("Cập nhật tài khoản thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Không thể cập nhật tài khoản");
    },
  });
}

/**
 * Hook để xóa account
 * Sử dụng optimistic update để UI phản hồi ngay lập tức
 */
export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => accountsAPI.delete(id),
    onMutate: async (deletedId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.accounts.list() });

      // Snapshot previous value
      const previousAccounts = queryClient.getQueryData<Account[]>(
        queryKeys.accounts.list(),
      );

      // Optimistically remove from the list
      if (previousAccounts) {
        queryClient.setQueryData<Account[]>(
          queryKeys.accounts.list(),
          previousAccounts.filter((account) => account.id !== deletedId),
        );
      }

      return { previousAccounts };
    },
    onError: (error: Error, _, context) => {
      // Rollback on error
      if (context?.previousAccounts) {
        queryClient.setQueryData(
          queryKeys.accounts.list(),
          context.previousAccounts,
        );
      }
      toast.error(error.message || "Không thể xóa tài khoản");
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
    },
    onSuccess: () => {
      toast.success("Xóa tài khoản thành công!");
    },
  });
}
