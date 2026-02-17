import { useQuery } from "@tanstack/react-query";
import { alertsAPI } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";

/**
 * Hook để fetch tất cả alerts
 */
export function useAlertsQuery(options?: { isRead?: boolean; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.alerts.list(options),
    queryFn: () => alertsAPI.getAll(options),
    staleTime: 30 * 1000, // 30 giây - alerts cần real-time
  });
}

/**
 * Hook để fetch số lượng alerts chưa đọc
 * Có polling mỗi 60 giây
 */
export function useUnreadAlertCountQuery() {
  return useQuery({
    queryKey: queryKeys.alerts.unreadCount(),
    queryFn: alertsAPI.getUnreadCount,
    staleTime: 30 * 1000, // 30 giây
    refetchInterval: 60 * 1000, // Poll mỗi 60 giây
  });
}
