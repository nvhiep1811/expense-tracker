import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesAPI, CreateCategoryRequest } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import toast from "react-hot-toast";

/**
 * Hook để tạo category mới
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoriesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      toast.success("Tạo danh mục thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Không thể tạo danh mục");
    },
  });
}

/**
 * Hook để cập nhật category
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateCategoryRequest>;
    }) => categoriesAPI.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.detail(id),
      });
      toast.success("Cập nhật danh mục thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Không thể cập nhật danh mục");
    },
  });
}

/**
 * Hook để xóa category
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      toast.success("Xóa danh mục thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Không thể xóa danh mục");
    },
  });
}
