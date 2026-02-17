"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, EyeOff, AlertTriangle, X, Loader2 } from "lucide-react";
import { Alert } from "@/lib/api";
import {
  useCurrency,
  useAlertsQuery,
  useUnreadAlertCountQuery,
  useMarkAlertAsRead,
  useMarkAllAlertsAsRead,
  useDismissAlert,
  useDismissAllAlerts,
} from "@/hooks";

// Format time distance in Vietnamese
function formatTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return "Vừa xong";
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`;
    return `${Math.floor(diffDays / 365)} năm trước`;
  } catch {
    return "";
  }
}

export default function AlertsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const formatCurrency = useCurrency();

  // React Query hooks
  const { data: unreadCount = 0 } = useUnreadAlertCountQuery();
  const {
    data: alerts = [],
    isLoading: loading,
    refetch: fetchAlerts,
  } = useAlertsQuery({ limit: 20 });

  // Mutations
  const markAsReadMutation = useMarkAlertAsRead();
  const markAllAsReadMutation = useMarkAllAlertsAsRead();
  const dismissMutation = useDismissAlert();
  const dismissAllMutation = useDismissAllAlerts();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (newIsOpen) {
      fetchAlerts();
    }
  };

  const handleMarkAsRead = (alertId: string) => {
    markAsReadMutation.mutate(alertId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleDismiss = (alertId: string) => {
    dismissMutation.mutate(alertId);
  };

  const handleDismissAll = () => {
    dismissAllMutation.mutate();
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "budget_over_limit":
        return (
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
        );
      case "budget_near_limit":
        return (
          <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
        );
    }
  };

  const getAlertTitle = (alert: Alert) => {
    const categoryName =
      alert.payload?.category_name ||
      alert.category?.name ||
      "Danh mục không xác định";

    switch (alert.type) {
      case "budget_over_limit":
        return `Vượt hạn mức: ${categoryName}`;
      case "budget_near_limit":
        return `Gần hạn mức: ${categoryName}`;
      default:
        return "Thông báo";
    }
  };

  const getAlertDescription = (alert: Alert) => {
    const spent = alert.payload?.spent || 0;
    const limit = alert.payload?.limit_amount || 0;
    const percentage = alert.payload?.percentage || 0;

    switch (alert.type) {
      case "budget_over_limit":
        return `Bạn đã chi ${formatCurrency(spent)} (${percentage.toFixed(1)}%), vượt hạn mức ${formatCurrency(limit)}`;
      case "budget_near_limit":
        return `Đã chi ${formatCurrency(spent)} / ${formatCurrency(limit)} (${percentage.toFixed(1)}%)`;
      default:
        return "";
    }
  };

  const formatTime = (dateString: string) => {
    return formatTimeAgo(dateString);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        className="relative p-2 text-muted-text hover:text-foreground transition-colors cursor-pointer"
        aria-label="Thông báo"
      >
        <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-4.5 h-4.5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 bg-black/30 z-40 sm:hidden"
            onClick={() => setIsOpen(false)}
          />
          {/* Dropdown panel - fullscreen on mobile, positioned on desktop */}
          <div className="fixed inset-x-4 top-16 z-50 sm:absolute sm:inset-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-96 bg-card-bg border border-card-border rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-card-border bg-gray-50 dark:bg-gray-800/50">
              <h3 className="text-sm font-semibold text-foreground">
                Thông báo
              </h3>
              <div className="flex items-center gap-2">
                {alerts.length > 0 && (
                  <>
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                      title="Đánh dấu tất cả đã đọc"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Đánh dấu đã đọc</span>
                    </button>
                    <button
                      onClick={handleDismissAll}
                      className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1 cursor-pointer"
                      title="Ẩn tất cả"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Ẩn tất cả</span>
                    </button>
                  </>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-muted-text hover:text-foreground cursor-pointer"
                  aria-label="Đóng"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Alerts List */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              ) : alerts.length === 0 ? (
                <div className="py-12 text-center">
                  <Bell className="w-12 h-12 text-muted-text mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-muted-text">
                    Không có thông báo nào
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-card-border">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                        !alert.is_read
                          ? "bg-blue-50/50 dark:bg-blue-900/10"
                          : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={`text-sm font-medium truncate ${
                                !alert.is_read
                                  ? "text-foreground"
                                  : "text-muted-text"
                              }`}
                            >
                              {getAlertTitle(alert)}
                            </p>
                            <div className="flex items-center gap-1 shrink-0">
                              {!alert.is_read && (
                                <button
                                  onClick={() => handleMarkAsRead(alert.id)}
                                  className="p-1 text-muted-text hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                                  title="Đánh dấu đã đọc"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDismiss(alert.id)}
                                className="p-1 text-muted-text hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
                                title="Ẩn"
                              >
                                <EyeOff className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-text mt-1 line-clamp-2">
                            {getAlertDescription(alert)}
                          </p>
                          <p className="text-xs text-muted-text mt-1.5 opacity-70">
                            {formatTime(alert.occurred_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
