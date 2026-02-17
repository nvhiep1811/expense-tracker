import { useMutation, useQueryClient } from "@tanstack/react-query";
import { alertsAPI, Alert } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";

/**
 * Hook để đánh dấu alert đã đọc
 * Sử dụng optimistic update
 */
export function useMarkAlertAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => alertsAPI.markAsRead(id),
    onMutate: async (alertId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.alerts.all });

      const previousAlerts = queryClient.getQueryData<Alert[]>(
        queryKeys.alerts.list(),
      );
      const previousCount = queryClient.getQueryData<number>(
        queryKeys.alerts.unreadCount(),
      );

      // Optimistically update alert
      if (previousAlerts) {
        queryClient.setQueryData<Alert[]>(
          queryKeys.alerts.list(),
          previousAlerts.map((alert) =>
            alert.id === alertId ? { ...alert, is_read: true } : alert,
          ),
        );
      }

      // Decrement unread count
      if (previousCount !== undefined) {
        queryClient.setQueryData<number>(
          queryKeys.alerts.unreadCount(),
          Math.max(0, previousCount - 1),
        );
      }

      return { previousAlerts, previousCount };
    },
    onError: (_, __, context) => {
      if (context?.previousAlerts) {
        queryClient.setQueryData(
          queryKeys.alerts.list(),
          context.previousAlerts,
        );
      }
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(
          queryKeys.alerts.unreadCount(),
          context.previousCount,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts.all });
    },
  });
}

/**
 * Hook để đánh dấu tất cả alerts đã đọc
 */
export function useMarkAllAlertsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => alertsAPI.markAllAsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.alerts.all });

      const previousAlerts = queryClient.getQueryData<Alert[]>(
        queryKeys.alerts.list(),
      );

      // Optimistically mark all as read
      if (previousAlerts) {
        queryClient.setQueryData<Alert[]>(
          queryKeys.alerts.list(),
          previousAlerts.map((alert) => ({ ...alert, is_read: true })),
        );
      }
      queryClient.setQueryData<number>(queryKeys.alerts.unreadCount(), 0);

      return { previousAlerts };
    },
    onError: (_, __, context) => {
      if (context?.previousAlerts) {
        queryClient.setQueryData(
          queryKeys.alerts.list(),
          context.previousAlerts,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts.all });
    },
  });
}

/**
 * Hook để dismiss (ẩn) một alert
 * Sử dụng optimistic update
 */
export function useDismissAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => alertsAPI.dismiss(id),
    onMutate: async (alertId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.alerts.all });

      const previousAlerts = queryClient.getQueryData<Alert[]>(
        queryKeys.alerts.list(),
      );
      const previousCount = queryClient.getQueryData<number>(
        queryKeys.alerts.unreadCount(),
      );

      // Find if alert was unread
      const dismissedAlert = previousAlerts?.find((a) => a.id === alertId);
      const wasUnread = dismissedAlert && !dismissedAlert.is_read;

      // Optimistically remove from list
      if (previousAlerts) {
        queryClient.setQueryData<Alert[]>(
          queryKeys.alerts.list(),
          previousAlerts.filter((alert) => alert.id !== alertId),
        );
      }

      // Decrement unread count if was unread
      if (wasUnread && previousCount !== undefined) {
        queryClient.setQueryData<number>(
          queryKeys.alerts.unreadCount(),
          Math.max(0, previousCount - 1),
        );
      }

      return { previousAlerts, previousCount };
    },
    onError: (_, __, context) => {
      if (context?.previousAlerts) {
        queryClient.setQueryData(
          queryKeys.alerts.list(),
          context.previousAlerts,
        );
      }
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(
          queryKeys.alerts.unreadCount(),
          context.previousCount,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts.all });
    },
  });
}

/**
 * Hook để dismiss tất cả alerts
 */
export function useDismissAllAlerts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => alertsAPI.dismissAll(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.alerts.all });

      const previousAlerts = queryClient.getQueryData<Alert[]>(
        queryKeys.alerts.list(),
      );

      // Optimistically clear all
      queryClient.setQueryData<Alert[]>(queryKeys.alerts.list(), []);
      queryClient.setQueryData<number>(queryKeys.alerts.unreadCount(), 0);

      return { previousAlerts };
    },
    onError: (_, __, context) => {
      if (context?.previousAlerts) {
        queryClient.setQueryData(
          queryKeys.alerts.list(),
          context.previousAlerts,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts.all });
    },
  });
}

/**
 * Hook để xóa một alert
 */
export function useDeleteAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => alertsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts.all });
    },
  });
}

/**
 * Hook để xóa tất cả alerts
 */
export function useDeleteAllAlerts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => alertsAPI.deleteAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts.all });
    },
  });
}

/**
 * Hook để trigger kiểm tra budget alerts
 */
export function useCheckBudgetAlerts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => alertsAPI.checkBudgets(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts.all });
    },
  });
}
