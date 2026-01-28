import api from "./client";
import type { DashboardStats, MonthlyCashflow } from "@/types/dashboard";

export const dashboardAPI = {
  /**
   * Get comprehensive dashboard statistics
   * Uses optimized database views
   */
  async getStats(): Promise<DashboardStats> {
    const response = await api.get("/dashboard/stats");
    return response.data;
  },

  /**
   * Get monthly cashflow trends
   * @param months Number of months to retrieve (default: 6)
   */
  async getCashflow(months = 6): Promise<MonthlyCashflow[]> {
    const response = await api.get("/dashboard/cashflow", {
      params: { months },
    });
    return response.data;
  },

  /**
   * Get current net worth
   */
  async getNetWorth(): Promise<{ net_worth: number }> {
    const response = await api.get("/dashboard/net-worth");
    return response.data;
  },
};
