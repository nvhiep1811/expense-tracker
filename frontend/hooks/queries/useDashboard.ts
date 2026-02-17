import { useQuery } from "@tanstack/react-query";
import { dashboardAPI } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";

/**
 * Hook để fetch dashboard statistics
 * Sử dụng optimized database views
 */
export function useDashboardStatsQuery() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: dashboardAPI.getStats,
    staleTime: 2 * 60 * 1000, // 2 phút
  });
}

/**
 * Hook để fetch monthly cashflow data
 */
export function useCashflowQuery(months = 6) {
  return useQuery({
    queryKey: queryKeys.dashboard.cashflow(months),
    queryFn: () => dashboardAPI.getCashflow(months),
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook để fetch net worth
 */
export function useNetWorthQuery() {
  return useQuery({
    queryKey: queryKeys.dashboard.netWorth(),
    queryFn: dashboardAPI.getNetWorth,
    staleTime: 2 * 60 * 1000,
  });
}
