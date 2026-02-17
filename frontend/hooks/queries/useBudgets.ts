import { useQuery } from "@tanstack/react-query";
import { budgetsAPI } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";

/**
 * Hook để fetch tất cả budgets
 */
export function useBudgetsQuery() {
  return useQuery({
    queryKey: queryKeys.budgets.list(),
    queryFn: budgetsAPI.getAll,
    staleTime: 2 * 60 * 1000, // 2 phút
  });
}

/**
 * Hook để fetch budget status với spending info
 * Sử dụng v_budget_status database view
 */
export function useBudgetStatusQuery() {
  return useQuery({
    queryKey: queryKeys.budgets.status(),
    queryFn: budgetsAPI.getStatus,
    staleTime: 2 * 60 * 1000, // 2 phút - cập nhật khi có transactions
  });
}

/**
 * Hook để fetch một budget theo ID
 */
export function useBudgetQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.budgets.detail(id),
    queryFn: () => budgetsAPI.getOne(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}
