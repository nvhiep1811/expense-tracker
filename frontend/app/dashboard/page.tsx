"use client";

import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  lazy,
  Suspense,
} from "react";
import Header from "@/components/layout/Header";
import StatCard from "@/components/ui/StatCard";
import { Wallet, TrendingUp, TrendingDown, Loader2, Plus } from "lucide-react";
import {
  budgetsAPI,
  dashboardAPI,
  transactionsAPI,
  alertsAPI,
} from "@/lib/api";
import toast from "react-hot-toast";
import type { BudgetStatus, Transaction } from "@/types";
import type { DashboardStats } from "@/types/dashboard";
import { useCurrency } from "@/hooks/useCurrency";
import { useRouter } from "next/navigation";
import { dataEvents } from "@/contexts/DataContext";

// Lazy load charts to reduce initial bundle
const DashboardCharts = lazy(
  () => import("@/components/dashboard/DashboardCharts"),
);

export default function DashboardPage() {
  const router = useRouter();
  const formatCurrency = useCurrency();
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState<BudgetStatus[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null,
  );
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    [],
  );

  // Check for unread alerts and show notification on login
  const checkUnreadAlerts = useCallback(async () => {
    try {
      const count = await alertsAPI.getUnreadCount();
      if (count > 0) {
        // Use unique ID to prevent duplicate toasts
        toast.dismiss("unread-alerts");
        toast(
          (t) => (
            <div className="flex items-center gap-3">
              <span>
                Bạn có <strong>{count}</strong> thông báo chưa đọc
              </span>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Xem
              </button>
            </div>
          ),
          {
            id: "unread-alerts",
            icon: "🔔",
            duration: 5000,
            position: "top-right",
          },
        );
      }
    } catch {
      // Silently fail - not critical
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      // Use optimized dashboard API with database views
      const [budgetStatusData, statsData, transactionsData] = await Promise.all(
        [
          budgetsAPI.getStatus(), // ✅ Use v_budget_status view
          dashboardAPI.getStats(), // Uses database views for performance
          transactionsAPI.getAll({ limit: 10 }), // Get recent transactions
        ],
      );

      // Filter only active budgets for current month
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const activeBudgets = budgetStatusData.filter((budget) => {
        const startDate = new Date(budget.start_date);
        const endDate = new Date(budget.end_date);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        return now >= startDate && now <= endDate;
      });

      setBudgets(activeBudgets);
      setDashboardStats(statsData);
      setRecentTransactions(transactionsData.data);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Không thể tải dữ liệu dashboard",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    checkUnreadAlerts();
  }, [fetchDashboardData, checkUnreadAlerts]);

  // Listen for data changes to refresh dashboard
  useEffect(() => {
    const unsubscribe = dataEvents.subscribe((event) => {
      const { type } = event.detail;
      // Refresh dashboard when transactions/budgets change
      if (type.startsWith("transactions:") || type.startsWith("budgets:")) {
        fetchDashboardData();
      }
    });
    return unsubscribe;
  }, [fetchDashboardData]);

  // Statistics from optimized API
  const totalBalance = dashboardStats?.netWorth || 0;
  const totalIncome = dashboardStats?.currentMonth.income || 0;
  const totalExpense = dashboardStats?.currentMonth.expense || 0;

  // Category spending data for pie chart (from database view)
  const categorySpending = useMemo(() => {
    if (!dashboardStats?.categorySpending) return [];

    return dashboardStats.categorySpending
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 5)
      .map((cat) => ({
        name: cat.category_name || "Unknown",
        value: cat.spent,
        color: cat.color || "#64748b",
      }));
  }, [dashboardStats]);

  // Monthly income vs expense chart (from database view)
  const monthlyData = useMemo(() => {
    if (!dashboardStats?.monthlyCashflow) return [];

    return dashboardStats.monthlyCashflow.map((data) => {
      const date = new Date(data.month);
      return {
        month: `T${date.getMonth() + 1}`,
        income: data.income,
        expense: data.expense,
      };
    });
  }, [dashboardStats]);

  // Get category name - memoized
  const getCategoryName = useCallback(
    (categoryId?: string) => {
      if (!categoryId) return "Không danh mục";
      const category = dashboardStats?.categorySpending.find(
        (c) => c.category_id === categoryId,
      );
      return category?.category_name || "N/A";
    },
    [dashboardStats],
  );

  // Use recent transactions instead of currentMonthTransactions
  const currentMonthTransactions = recentTransactions;

  if (loading) {
    return (
      <>
        <Header title="Tổng quan" subtitle="Đang tải dữ liệu..." />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header
        title="Tổng quan"
        subtitle={`Chào mừng trở lại! Hôm nay là ${new Date().toLocaleDateString(
          "vi-VN",
          {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          },
        )}`}
      />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Tổng tài sản"
              amount={totalBalance}
              change={5.2}
              icon={Wallet}
              color="bg-blue-500"
              isPositive={true}
            />
            <StatCard
              title="Thu nhập tháng này"
              amount={totalIncome}
              change={0}
              icon={TrendingUp}
              color="bg-green-500"
              isPositive={true}
            />
            <StatCard
              title="Chi tiêu tháng này"
              amount={totalExpense}
              change={-12.5}
              icon={TrendingDown}
              color="bg-red-500"
              isPositive={false}
            />
          </div>

          {/* Lazy-loaded Charts */}
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            }
          >
            <DashboardCharts
              categorySpending={categorySpending}
              monthlyData={monthlyData}
              budgets={budgets}
              currentMonthTransactions={currentMonthTransactions}
              formatCurrency={formatCurrency}
              getCategoryName={getCategoryName}
            />
          </Suspense>
        </div>
      </main>
    </>
  );
}
