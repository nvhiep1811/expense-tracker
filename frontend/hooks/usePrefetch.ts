import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { queryKeys } from "@/lib/queryKeys";
import {
  accountsAPI,
  categoriesAPI,
  transactionsAPI,
  budgetsAPI,
  dashboardAPI,
} from "@/lib/api";

type PrefetchTarget =
  | "accounts"
  | "categories"
  | "transactions"
  | "budgets"
  | "dashboard";

/**
 * Hook để prefetch data khi hover
 * Giúp trang load nhanh hơn khi user navigate
 *
 * @example
 * const prefetch = usePrefetch();
 * <Link onMouseEnter={() => prefetch('accounts')} href="/dashboard/accounts">
 */
export function usePrefetch() {
  const queryClient = useQueryClient();

  const prefetch = useCallback(
    async (target: PrefetchTarget) => {
      switch (target) {
        case "accounts":
          await queryClient.prefetchQuery({
            queryKey: queryKeys.accounts.list(),
            queryFn: accountsAPI.getAll,
            staleTime: 5 * 60 * 1000, // 5 minutes
          });
          break;

        case "categories":
          await queryClient.prefetchQuery({
            queryKey: queryKeys.categories.list(),
            queryFn: categoriesAPI.getAll,
            staleTime: 10 * 60 * 1000, // 10 minutes
          });
          break;

        case "transactions":
          await queryClient.prefetchQuery({
            queryKey: queryKeys.transactions.list({}),
            queryFn: () => transactionsAPI.getAll({ limit: 20 }),
            staleTime: 2 * 60 * 1000, // 2 minutes
          });
          break;

        case "budgets":
          await queryClient.prefetchQuery({
            queryKey: queryKeys.budgets.status(),
            queryFn: budgetsAPI.getStatus,
            staleTime: 5 * 60 * 1000, // 5 minutes
          });
          break;

        case "dashboard":
          await Promise.all([
            queryClient.prefetchQuery({
              queryKey: queryKeys.dashboard.stats(),
              queryFn: dashboardAPI.getStats,
              staleTime: 1 * 60 * 1000, // 1 minute
            }),
            queryClient.prefetchQuery({
              queryKey: queryKeys.budgets.status(),
              queryFn: budgetsAPI.getStatus,
              staleTime: 5 * 60 * 1000,
            }),
          ]);
          break;
      }
    },
    [queryClient],
  );

  return prefetch;
}

/**
 * Prefetch multiple targets at once
 */
export function usePrefetchMultiple() {
  const prefetch = usePrefetch();

  return useCallback(
    async (targets: PrefetchTarget[]) => {
      await Promise.all(targets.map((target) => prefetch(target)));
    },
    [prefetch],
  );
}
