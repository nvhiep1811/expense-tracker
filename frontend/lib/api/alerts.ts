import api from "./client";

export interface AlertPayload {
  budget_id?: string;
  category_id?: string;
  category_name?: string;
  spent?: number;
  limit_amount?: number;
  percentage?: number;
  remaining?: number;
  period?: string;
}

export interface Alert {
  id: string;
  user_id: string;
  type:
    | "budget_near_limit"
    | "budget_over_limit"
    | "recurring_reminder"
    | "account_low_balance"
    | "goal_achieved";
  budget_id?: string;
  category_id?: string;
  payload: AlertPayload;
  is_read: boolean;
  occurred_at: string;
  dismissed_at?: string;
  budget?: {
    id: string;
    limit_amount: number;
    period: string;
    start_date: string;
    end_date: string;
  };
  category?: {
    id: string;
    name: string;
    icon?: string;
    color?: string;
  };
}

export interface UnreadCountResponse {
  count: number;
}

export const alertsAPI = {
  /**
   * Get all alerts, optionally filtered by read status
   */
  getAll: async (options?: {
    isRead?: boolean;
    limit?: number;
  }): Promise<Alert[]> => {
    const params = new URLSearchParams();
    if (options?.isRead !== undefined) {
      params.append("is_read", String(options.isRead));
    }
    if (options?.limit !== undefined) {
      params.append("limit", String(options.limit));
    }
    const queryString = params.toString();
    const response = await api.get(
      `/alerts${queryString ? `?${queryString}` : ""}`,
    );
    return response.data;
  },

  /**
   * Get count of unread alerts
   */
  getUnreadCount: async (): Promise<number> => {
    const response = await api.get<UnreadCountResponse>("/alerts/unread-count");
    return response.data.count;
  },

  /**
   * Trigger budget alert check
   */
  checkBudgets: async (): Promise<void> => {
    await api.post("/alerts/check-budgets");
  },

  /**
   * Mark a single alert as read
   */
  markAsRead: async (id: string): Promise<Alert> => {
    const response = await api.put(`/alerts/${id}/read`);
    return response.data;
  },

  /**
   * Mark all alerts as read
   */
  markAllAsRead: async (): Promise<void> => {
    await api.put("/alerts/read-all");
  },

  /**
   * Delete a single alert
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/alerts/${id}`);
  },

  /**
   * Delete all alerts
   */
  deleteAll: async (): Promise<void> => {
    await api.delete("/alerts/all");
  },

  /**
   * Dismiss a single alert (hide without deleting)
   */
  dismiss: async (id: string): Promise<Alert> => {
    const response = await api.put(`/alerts/${id}/dismiss`);
    return response.data;
  },

  /**
   * Dismiss all alerts (hide without deleting)
   */
  dismissAll: async (): Promise<void> => {
    await api.put("/alerts/dismiss-all");
  },
};
