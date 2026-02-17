import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsAPI } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type {
  CreateTransactionRequest,
  UpdateTransactionRequest,
} from "@/types";
import toast from "react-hot-toast";

/**
 * Hook để tạo transaction mới
 * Invalidates: transactions, accounts (balance), dashboard, budgets status
 */
export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionRequest) =>
      transactionsAPI.create(data),
    onSuccess: () => {
      // Invalidate tất cả queries liên quan
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.status() });
      toast.success("Thêm giao dịch thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Không thể thêm giao dịch");
    },
  });
}

/**
 * Hook để cập nhật transaction
 */
export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateTransactionRequest;
    }) => transactionsAPI.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.transactions.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.status() });
      toast.success("Cập nhật giao dịch thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Không thể cập nhật giao dịch");
    },
  });
}

/**
 * Hook để xóa transaction
 */
export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transactionsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.status() });
      toast.success("Xóa giao dịch thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Không thể xóa giao dịch");
    },
  });
}
