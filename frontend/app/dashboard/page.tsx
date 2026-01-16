"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import StatCard from "@/components/ui/StatCard";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
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

export default function DashboardPage() {
  // Mock data
  const [accounts] = useState([
    {
      id: 1,
      name: "Ví tiền mặt",
      type: "cash",
      balance: 5420000,
      color: "#10b981",
    },
    {
      id: 2,
      name: "Techcombank",
      type: "bank",
      balance: 25800000,
      color: "#3b82f6",
    },
    {
      id: 3,
      name: "Momo",
      type: "e_wallet",
      balance: 1250000,
      color: "#ec4899",
    },
  ]);

  const [transactions] = useState([
    {
      id: 1,
      type: "expense",
      amount: 350000,
      category: "Ăn uống",
      date: "2026-01-06",
      account: "Momo",
      description: "Ăn trưa văn phòng",
    },
    {
      id: 2,
      type: "expense",
      amount: 1200000,
      category: "Mua sắm",
      date: "2026-01-05",
      account: "Techcombank",
      description: "Mua quần áo",
    },
    {
      id: 3,
      type: "income",
      amount: 15000000,
      category: "Lương",
      date: "2026-01-01",
      account: "Techcombank",
      description: "Lương tháng 1",
    },
    {
      id: 4,
      type: "expense",
      amount: 450000,
      category: "Di chuyển",
      date: "2026-01-04",
      account: "Ví tiền mặt",
      description: "Grab",
    },
    {
      id: 5,
      type: "expense",
      amount: 2500000,
      category: "Hóa đơn",
      date: "2026-01-03",
      account: "Techcombank",
      description: "Tiền điện nước",
    },
  ]);

  const [categories] = useState([
    {
      name: "Ăn uống",
      spent: 2450000,
      budget: 5000000,
      color: "#f59e0b",
      icon: "🍔",
    },
    {
      name: "Mua sắm",
      spent: 3200000,
      budget: 4000000,
      color: "#8b5cf6",
      icon: "🛍️",
    },
    {
      name: "Di chuyển",
      spent: 1250000,
      budget: 2000000,
      color: "#06b6d4",
      icon: "🚗",
    },
    {
      name: "Hóa đơn",
      spent: 2500000,
      budget: 3000000,
      color: "#ef4444",
      icon: "📄",
    },
    {
      name: "Giải trí",
      spent: 800000,
      budget: 2000000,
      color: "#ec4899",
      icon: "🎮",
    },
  ]);

  const monthlyData = [
    { month: "T7", income: 15000000, expense: 8500000 },
    { month: "T8", income: 15000000, expense: 9200000 },
    { month: "T9", income: 15500000, expense: 8800000 },
    { month: "T10", income: 15000000, expense: 10500000 },
    { month: "T11", income: 16000000, expense: 9800000 },
    { month: "T12", income: 15000000, expense: 11200000 },
    { month: "T1", income: 15000000, expense: 10400000 },
  ];

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const categoryChartData = categories.map((cat) => ({
    name: cat.name,
    value: cat.spent,
  }));

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
          }
        )}`}
      />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={categories[index].color}
                      />
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
                {categories.map((cat, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    ></div>
                    <span className="text-sm text-muted-text">{cat.name}</span>
                  </div>
                ))}
              </div>
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
                  <YAxis stroke="#9ca3af" />
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
                <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                  Xem tất cả
                </button>
              </div>
              <div className="space-y-3">
                {transactions.slice(0, 5).map((tx) => (
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
                          {tx.category}
                        </p>
                        <p className="text-sm text-muted-text">{tx.date}</p>
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
                ))}
              </div>
            </div>

            {/* Budget Progress */}
            <div className="bg-card-bg rounded-xl p-6 border border-card-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Ngân sách tháng này
                </h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                  Chi tiết
                </button>
              </div>
              <div className="space-y-4">
                {categories.map((cat, idx) => {
                  const percentage = (cat.spent / cat.budget) * 100;
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{cat.icon}</span>
                          <span className="text-sm font-medium text-foreground">
                            {cat.name}
                          </span>
                        </div>
                        <span className="text-sm text-muted-text">
                          {formatCurrency(cat.spent)} /{" "}
                          {formatCurrency(cat.budget)}
                        </span>
                      </div>
                      <div className="w-full bg-hover-bg rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            percentage > 100
                              ? "bg-red-500"
                              : percentage > 80
                              ? "bg-orange-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
