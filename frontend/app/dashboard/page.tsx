"use client";

import { useState, useEffect, useMemo } from "react";
import Header from "@/components/layout/Header";
import StatCard from "@/components/ui/StatCard";
import { Wallet, TrendingUp, TrendingDown, Loader2, Plus } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
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

  useEffect(() => {
    fetchDashboardData();
    checkUnreadAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check for unread alerts and show notification on login
  const checkUnreadAlerts = async () => {
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
  };

  const fetchDashboardData = async () => {
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
  };

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

  // Get category name from dashboard stats
  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return "Không danh mục";
    const category = dashboardStats?.categorySpending.find(
      (c) => c.category_id === categoryId,
    );
    return category?.category_name || "N/A";
  };

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

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expense by Category */}
            <div className="bg-card-bg rounded-xl p-6 border border-card-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Chi tiêu theo danh mục
              </h3>
              {categorySpending.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-72 text-muted-text">
                  <p className="mb-4">Chưa có dữ liệu chi tiêu</p>
                  <button
                    onClick={() => router.push("/dashboard/transactions")}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm giao dịch đầu tiên
                  </button>
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categorySpending}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categorySpending.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number | undefined) =>
                          value ? formatCurrency(value) : "0đ"
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {categorySpending.map((cat, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        ></div>
                        <span className="text-sm text-muted-text">
                          {cat.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Income vs Expense */}
            <div className="bg-card-bg rounded-xl p-6 border border-card-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Thu nhập vs Chi tiêu
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis
                    stroke="#9ca3af"
                    tickFormatter={(value) => {
                      if (value >= 1000000)
                        return `${(value / 1000000).toFixed(1)}tr`;
                      if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                      return value.toString();
                    }}
                  />
                  <Tooltip
                    formatter={(value: number | undefined) =>
                      value ? formatCurrency(value) : "0đ"
                    }
                  />
                  <Legend />
                  <Bar
                    dataKey="income"
                    fill="#10b981"
                    name="Thu nhập"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="expense"
                    fill="#ef4444"
                    name="Chi tiêu"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Transactions & Budget Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <div className="bg-card-bg rounded-xl p-6 border border-card-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Giao dịch gần đây
                </h3>
                <button
                  onClick={() => router.push("/dashboard/transactions")}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  Xem tất cả
                </button>
              </div>
              <div className="space-y-3">
                {currentMonthTransactions.length === 0 ? (
                  <div className="flex flex-col items-center py-8 text-muted-text">
                    <p className="mb-4">Chưa có giao dịch nào</p>
                    <button
                      onClick={() => router.push("/dashboard/transactions")}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Thêm giao dịch
                    </button>
                  </div>
                ) : (
                  currentMonthTransactions.slice(0, 5).map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-3 bg-hover-bg rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            tx.type === "income"
                              ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {tx.type === "income" ? (
                            <TrendingUp className="w-5 h-5" />
                          ) : (
                            <TrendingDown className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {getCategoryName(tx.category_id)}
                          </p>
                          <p className="text-sm text-muted-text">
                            {new Date(tx.occurred_on).toLocaleDateString(
                              "vi-VN",
                            )}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`font-semibold ${
                          tx.type === "income"
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {tx.type === "income" ? "+" : "-"}
                        {formatCurrency(tx.amount)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Budget Progress */}
            <div className="bg-card-bg rounded-xl p-6 border border-card-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Ngân sách tháng này
                </h3>
                <button
                  onClick={() => router.push("/dashboard/budgets")}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  Chi tiết
                </button>
              </div>
              <div className="space-y-4">
                {budgets.length === 0 ? (
                  <div className="flex flex-col items-center py-8 text-muted-text">
                    <p className="mb-4">Chưa có ngân sách nào</p>
                    <button
                      onClick={() => router.push("/dashboard/budgets")}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Tạo ngân sách
                    </button>
                  </div>
                ) : (
                  budgets.slice(0, 5).map((budget) => {
                    const percentage = budget.percentage;
                    return (
                      <div key={budget.budget_id}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-foreground">
                            {budget.category_name || "Không danh mục"}
                          </span>
                          <span className="text-sm text-muted-text">
                            {formatCurrency(budget.spent)} /{" "}
                            {formatCurrency(budget.limit_amount)}
                          </span>
                        </div>
                        <div className="w-full bg-hover-bg rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              percentage > 100
                                ? "bg-red-500"
                                : percentage > budget.alert_threshold_pct
                                  ? "bg-orange-500"
                                  : "bg-green-500"
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
