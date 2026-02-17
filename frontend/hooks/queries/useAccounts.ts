import { useQuery } from "@tanstack/react-query";
import { accountsAPI } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { Account } from "@/types";

/**
 * Hook để fetch tất cả accounts
 */
export function useAccountsQuery(options?: { includeArchived?: boolean }) {
  return useQuery({
    queryKey: queryKeys.accounts.list(options),
    queryFn: accountsAPI.getAll,
    staleTime: 5 * 60 * 1000, // 5 phút - accounts ít thay đổi
  });
}

/**
 * Hook để fetch một account theo ID
 */
export function useAccountQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.accounts.detail(id),
    queryFn: () => accountsAPI.getOne(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Helper hook để lấy account theo ID từ cached data
 */
export function useAccountByIdQuery(id: string): Account | undefined {
  const { data: accounts } = useAccountsQuery();
  return accounts?.find((account) => account.id === id);
}
