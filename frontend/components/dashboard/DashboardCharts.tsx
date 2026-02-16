"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
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
import type { BudgetStatus, Transaction } from "@/types";

interface DashboardChartsProps {
  categorySpending: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  monthlyData: Array<{
    month: string;
    income: number;
    expense: number;
  }>;
  budgets: BudgetStatus[];
  currentMonthTransactions: Transaction[];
  formatCurrency: (value: number) => string;
  getCategoryName: (categoryId?: string) => string;
}

export default function DashboardCharts({
  categorySpending,
  monthlyData,
  budgets,
  currentMonthTransactions,
  formatCurrency,
  getCategoryName,
}: DashboardChartsProps) {
  const router = useRouter();

  return (
    <>
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
                    fill="#8884d8"
                    paddingAngle={2}
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
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {categorySpending.map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-sm text-foreground">
                        {cat.name}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {formatCurrency(cat.value)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Monthly Income vs Expense */}
        <div className="bg-card-bg rounded-xl p-6 border border-card-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Thu chi 6 tháng gần nhất
          </h3>
          {monthlyData.length === 0 ? (
            <div className="flex items-center justify-center h-72 text-muted-text">
              <p>Chưa có dữ liệu</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                <Tooltip
                  formatter={(value: number | undefined) =>
                    value ? formatCurrency(value) : "0đ"
                  }
                />
                <Legend />
                <Bar dataKey="income" fill="#10B981" name="Thu nhập" />
                <Bar dataKey="expense" fill="#EF4444" name="Chi tiêu" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Budget Progress */}
      {budgets.length > 0 && (
        <div className="bg-card-bg rounded-xl p-6 border border-card-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Ngân sách tháng này
            </h3>
            <button
              onClick={() => router.push("/dashboard/budgets")}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Xem tất cả →
            </button>
          </div>
          <div className="space-y-4">
            {budgets.slice(0, 3).map((budget) => {
              const percentage = Math.min(
                (budget.spent / budget.limit_amount) * 100,
                100,
              );
              const isOverBudget = percentage >= 100;
              const isNearLimit = percentage >= 80 && percentage < 100;

              return (
                <div key={budget.budget_id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                      {budget.category_name || "Tổng quát"}
                    </span>
                    <span className="text-sm text-muted-text">
                      {formatCurrency(budget.spent)} /{" "}
                      {formatCurrency(budget.limit_amount)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isOverBudget
                          ? "bg-red-500"
                          : isNearLimit
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="bg-card-bg rounded-xl p-6 border border-card-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Giao dịch gần đây
          </h3>
          <button
            onClick={() => router.push("/dashboard/transactions")}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Xem tất cả →
          </button>
        </div>
        {currentMonthTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-text">
            <p className="mb-4">Chưa có giao dịch nào</p>
            <button
              onClick={() => router.push("/dashboard/transactions")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Thêm giao dịch
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {currentMonthTransactions.slice(0, 5).map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-hover-bg transition-colors"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {tx.description || getCategoryName(tx.category_id)}
                  </p>
                  <p className="text-xs text-muted-text">
                    {new Date(tx.occurred_on).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    tx.type === "income"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {tx.type === "income" ? "+" : "-"}
                  {formatCurrency(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
