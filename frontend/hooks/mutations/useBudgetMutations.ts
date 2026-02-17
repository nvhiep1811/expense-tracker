import { useMutation, useQueryClient } from "@tanstack/react-query";
import { budgetsAPI } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { CreateBudgetRequest, UpdateBudgetRequest } from "@/types";
import toast from "react-hot-toast";

/**
 * Hook để tạo budget mới
 */
export function useCreateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBudgetRequest) => budgetsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      toast.success("Thêm ngân sách thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Không thể thêm ngân sách");
    },
  });
}

/**
 * Hook để cập nhật budget
 */
export function useUpdateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBudgetRequest }) =>
      budgetsAPI.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      toast.success("Cập nhật ngân sách thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Không thể cập nhật ngân sách");
    },
  });
}

/**
 * Hook để xóa budget
 */
export function useDeleteBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => budgetsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      toast.success("Xóa ngân sách thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Không thể xóa ngân sách");
    },
  });
}

/**
 * Hook để renew budget (tạo mới cho kỳ tiếp theo)
 */
export function useRenewBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => budgetsAPI.renew(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      toast.success("Gia hạn ngân sách thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Không thể gia hạn ngân sách");
    },
  });
}
