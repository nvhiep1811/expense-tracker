import { useQuery } from "@tanstack/react-query";
import { transactionsAPI } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { TransactionFilters } from "@/types";

/**
 * Hook để fetch transactions với filters và pagination
 */
export function useTransactionsQuery(filters?: TransactionFilters) {
  return useQuery({
    queryKey: queryKeys.transactions.list(filters),
    queryFn: () => transactionsAPI.getAll(filters),
    staleTime: 1 * 60 * 1000, // 1 phút - transactions thường xuyên thay đổi
  });
}

/**
 * Hook để fetch một transaction theo ID
 */
export function useTransactionQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.transactions.detail(id),
    queryFn: () => transactionsAPI.getOne(id),
    enabled: !!id,
    staleTime: 1 * 60 * 1000,
  });
}
