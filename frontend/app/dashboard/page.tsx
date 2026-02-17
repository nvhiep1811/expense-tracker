"use client";

import { useMemo, lazy, Suspense } from "react";
import Header from "@/components/layout/Header";
import StatCard from "@/components/ui/StatCard";
import { Wallet, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { DashboardSkeleton } from "@/components/ui/Skeleton";
import type { BudgetStatus } from "@/types";
import {
  useCurrency,
  useDashboardStatsQuery,
  useBudgetStatusQuery,
  useTransactionsQuery,
} from "@/hooks";

// Lazy load charts to reduce initial bundle
const DashboardCharts = lazy(
  () => import("@/components/dashboard/DashboardCharts"),
);

export default function DashboardPage() {
  const formatCurrency = useCurrency();

  // React Query hooks
  const { data: dashboardStats, isLoading: statsLoading } =
    useDashboardStatsQuery();
  const { data: budgetStatusData = [], isLoading: budgetsLoading } =
    useBudgetStatusQuery();
  const { data: transactionsData, isLoading: transactionsLoading } =
    useTransactionsQuery({ limit: 10 });

  const isLoading = statsLoading || budgetsLoading || transactionsLoading;
  const recentTransactions = transactionsData?.data ?? [];

  // Filter only active budgets for current month
  const budgets: BudgetStatus[] = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return budgetStatusData.filter((budget) => {
      const startDate = new Date(budget.start_date);
      const endDate = new Date(budget.end_date);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      return now >= startDate && now <= endDate;
    });
  }, [budgetStatusData]);

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
  const getCategoryName = useMemo(
    () => (categoryId?: string) => {
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

  if (isLoading) {
    return (
      <>
        <Header title="Tổng quan" subtitle="Đang tải dữ liệu..." />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <DashboardSkeleton />
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
