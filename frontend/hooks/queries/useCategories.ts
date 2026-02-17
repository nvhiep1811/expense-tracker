import { useQuery } from "@tanstack/react-query";
import { categoriesAPI } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { Category } from "@/types";

/**
 * Hook để fetch tất cả categories
 */
export function useCategoriesQuery(options?: { side?: "income" | "expense" }) {
  return useQuery({
    queryKey: queryKeys.categories.list(options),
    queryFn: categoriesAPI.getAll,
    staleTime: 10 * 60 * 1000, // 10 phút - categories rất ít thay đổi
    select: (data) => {
      // Filter by side nếu có option
      if (options?.side) {
        return data.filter((cat) => cat.side === options.side);
      }
      return data;
    },
  });
}

/**
 * Hook để fetch một category theo ID
 */
export function useCategoryQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => categoriesAPI.getOne(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Helper hook để lấy category theo ID từ cached data
 */
export function useCategoryByIdQuery(id: string): Category | undefined {
  const { data: categories } = useCategoriesQuery();
  return categories?.find((category) => category.id === id);
}

/**
 * Helper hook để lấy categories theo side
 */
export function useCategoriesBySideQuery(
  side: "income" | "expense",
): Category[] {
  const { data: categories } = useCategoriesQuery();
  return categories?.filter((cat) => cat.side === side) ?? [];
}
