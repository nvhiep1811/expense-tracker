"use client";

import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import Header from "@/components/layout/Header";
import {
  TrendingUp,
  TrendingDown,
  Loader2,
  Calendar,
  Download,
  Filter,
} from "lucide-react";

// Lazy load charts to reduce initial bundle
const ReportsCharts = lazy(
  () => import("@/components/dashboard/ReportsCharts"),
);
import { transactionsAPI } from "@/lib/api";
import { useCategoriesQuery, useAccountsQuery } from "@/hooks";
import toast from "react-hot-toast";
import type { Transaction } from "@/types";
import { useCurrency } from "@/hooks/useCurrency";

export default function ReportsPage() {
  const formatCurrency = useCurrency();

  // Use React Query for static data (cached, no need to refetch on date change)
  const { data: categories = [] } = useCategoriesQuery();
  const { data: accounts = [] } = useAccountsQuery();

  // Local state for transactions (needs custom pagination logic)
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  // Date filters
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  }>(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return {
      start: firstDay.toISOString().split("T")[0],
      end: lastDay.toISOString().split("T")[0],
    };
  });

  const [showFilters, setShowFilters] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Fetch transactions khi dateRange thay đổi
  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  const fetchTransactions = async () => {
    try {
      setLoadingTransactions(true);

      // Fetch transactions with pagination (max 100 per request)
      let allTransactions: Transaction[] = [];
      let currentPage = 1;
      let hasMore = true;

      while (hasMore && allTransactions.length < 1000) {
        const transactionsRes = await transactionsAPI.getAll({
          start_date: dateRange.start,
          end_date: dateRange.end,
          page: currentPage,
          limit: 100,
        });

        allTransactions = [...allTransactions, ...transactionsRes.data];
        hasMore = currentPage < transactionsRes.meta.totalPages;
        currentPage++;

        // Safety limit: stop after 1000 transactions
        if (allTransactions.length >= 1000) {
          toast(
            "Hiển thị 1000 giao dịch gần nhất. Thu hẹp khoảng thời gian để xem đầy đủ.",
            { icon: "ℹ️" },
          );
          break;
        }
      }

      setTransactions(allTransactions);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Không thể tải dữ liệu giao dịch",
      );
    } finally {
      setLoadingTransactions(false);
    }
  };

  // Calculate summary statistics
  const statistics = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const transfer = transactions
      .filter((t) => t.type === "transfer")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expense,
      transfer,
      net: income - expense,
      transactionCount: transactions.length,
    };
  }, [transactions]);

  // Income vs Expense by Day
  const dailyData = useMemo(() => {
    const dailyMap = new Map<
      string,
      { income: number; expense: number; date: string }
    >();

    transactions.forEach((t) => {
      const date = new Date(t.occurred_on).toISOString().split("T")[0];
      const current = dailyMap.get(date) || { income: 0, expense: 0, date };

      if (t.type === "income") {
        current.income += t.amount;
      } else if (t.type === "expense") {
        current.expense += t.amount;
      }

      dailyMap.set(date, current);
    });

    return Array.from(dailyMap.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((d) => ({
        date: new Date(d.date).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
        }),
        income: d.income,
        expense: d.expense,
        net: d.income - d.expense,
      }));
  }, [transactions]);

  // Category breakdown (Pie chart)
  const categoryData = useMemo(() => {
    const categoryMap = new Map<string, { name: string; value: number }>();

    transactions
      .filter((t) => t.type === "expense" && t.category_id)
      .forEach((t) => {
        const category = categories.find((c) => c.id === t.category_id);
        const categoryName = category?.name || "Khác";
        const categoryId = t.category_id || "other";

        const current = categoryMap.get(categoryId) || {
          name: categoryName,
          value: 0,
        };
        current.value += t.amount;

        categoryMap.set(categoryId, current);
      });

    return Array.from(categoryMap.values())
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [transactions, categories]);

  // Income categories
  const incomeCategoryData = useMemo(() => {
    const categoryMap = new Map<string, { name: string; value: number }>();

    transactions
      .filter((t) => t.type === "income" && t.category_id)
      .forEach((t) => {
        const category = categories.find((c) => c.id === t.category_id);
        const categoryName = category?.name || "Khác";
        const categoryId = t.category_id || "other";

        const current = categoryMap.get(categoryId) || {
          name: categoryName,
          value: 0,
        };
        current.value += t.amount;

        categoryMap.set(categoryId, current);
      });

    return Array.from(categoryMap.values())
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [transactions, categories]);

  // Account balances
  const accountBalances = useMemo(() => {
    return accounts
      .filter((a) => !a.is_archived)
      .map((a) => ({
        name: a.name,
        balance: a.current_balance,
      }))
      .sort((a, b) => b.balance - a.balance);
  }, [accounts]);

  // Top transactions
  const topTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => b.amount - a.amount).slice(0, 10);
  }, [transactions]);

  const handleExport = async () => {
    if (transactions.length === 0) {
      toast.error("Không có dữ liệu để xuất");
      return;
    }

    setExporting(true);

    try {
      // Small delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Helper function to escape CSV values
      const escapeCsvValue = (value: string | number): string => {
        const strValue = String(value);
        // If value contains comma, quote, or newline, wrap in quotes and escape quotes
        if (
          strValue.includes(",") ||
          strValue.includes('"') ||
          strValue.includes("\n")
        ) {
          return `"${strValue.replace(/"/g, '""')}"`;
        }
        return strValue;
      };

      // Helper function to translate transaction type
      const translateType = (type: string): string => {
        switch (type) {
          case "income":
            return "Thu nhập";
          case "expense":
            return "Chi tiêu";
          case "transfer":
            return "Chuyển khoản";
          default:
            return type;
        }
      };

      // Build CSV content with UTF-8 BOM for Excel compatibility
      const rows: string[] = [];

      // Add report metadata
      rows.push(escapeCsvValue(`BÁO CÁO TÀI CHÍNH`));
      rows.push(
        escapeCsvValue(
          `Từ ngày: ${new Date(dateRange.start).toLocaleDateString("vi-VN")}`,
        ),
      );
      rows.push(
        escapeCsvValue(
          `Đến ngày: ${new Date(dateRange.end).toLocaleDateString("vi-VN")}`,
        ),
      );
      rows.push(
        escapeCsvValue(
          `Ngày xuất: ${new Date().toLocaleDateString("vi-VN")} ${new Date().toLocaleTimeString("vi-VN")}`,
        ),
      );
      rows.push(""); // Empty line

      // Add summary statistics
      rows.push(escapeCsvValue("TỔNG QUAN"));
      rows.push(
        `${escapeCsvValue("Tổng thu nhập")},${escapeCsvValue(formatCurrency(statistics.income))}`,
      );
      rows.push(
        `${escapeCsvValue("Tổng chi tiêu")},${escapeCsvValue(formatCurrency(statistics.expense))}`,
      );
      rows.push(
        `${escapeCsvValue("Chênh lệch")},${escapeCsvValue(formatCurrency(statistics.net))}`,
      );
      rows.push(
        `${escapeCsvValue("Số giao dịch")},${escapeCsvValue(statistics.transactionCount)}`,
      );
      rows.push(""); // Empty line

      // Add transaction details
      rows.push(escapeCsvValue("CHI TIẾT GIAO DỊCH"));

      // Header row
      const headers = [
        "Ngày",
        "Loại",
        "Danh mục",
        "Tài khoản",
        "Số tiền",
        "Ghi chú",
      ];
      rows.push(headers.map(escapeCsvValue).join(","));

      // Data rows
      transactions
        .sort(
          (a, b) =>
            new Date(b.occurred_on).getTime() -
            new Date(a.occurred_on).getTime(),
        )
        .forEach((t) => {
          const row = [
            new Date(t.occurred_on).toLocaleDateString("vi-VN"),
            translateType(t.type),
            categories.find((c) => c.id === t.category_id)?.name || "Không có",
            accounts.find((a) => a.id === t.account_id)?.name ||
              "Không xác định",
            t.amount.toLocaleString("vi-VN"),
            t.description || "",
          ];
          rows.push(row.map(escapeCsvValue).join(","));
        });

      // Add UTF-8 BOM for Excel to recognize Vietnamese characters correctly
      const BOM = "\uFEFF";
      const csvContent = BOM + rows.join("\n");

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);

      // Generate readable filename
      const startDate = new Date(dateRange.start)
        .toLocaleDateString("vi-VN")
        .replace(/\//g, "-");
      const endDate = new Date(dateRange.end)
        .toLocaleDateString("vi-VN")
        .replace(/\//g, "-");
      link.download = `bao-cao-tai-chinh_${startDate}_${endDate}.csv`;
      link.click();

      // Clean up
      URL.revokeObjectURL(link.href);

      toast.success(`Đã xuất báo cáo ${statistics.transactionCount} giao dịch`);
    } catch (error) {
      toast.error("Có lỗi khi xuất báo cáo");
    } finally {
      setExporting(false);
    }
  };

  if (loadingTransactions) {
    return (
      <>
        <Header title="Báo cáo" subtitle="Đang tải dữ liệu..." />
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
        title="Báo cáo"
        subtitle="Phân tích chi tiết thu chi và xu hướng tài chính"
      />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          {/* Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Filter className="w-4 h-4" />
                  {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
                </button>

                {showFilters && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) =>
                          setDateRange({ ...dateRange, start: e.target.value })
                        }
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <span className="text-gray-500">—</span>
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) =>
                          setDateRange({ ...dateRange, end: e.target.value })
                        }
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleExport}
                disabled={exporting || transactions.length === 0}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                title={
                  transactions.length === 0
                    ? "Không có dữ liệu để xuất"
                    : `Xuất ${transactions.length} giao dịch`
                }
              >
                <Download
                  className={`w-4 h-4 ${exporting ? "animate-bounce" : ""}`}
                />
                {exporting
                  ? "Đang xuất..."
                  : `Xuất báo cáo (${transactions.length})`}
              </button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Tổng thu
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                    {formatCurrency(statistics.income)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Tổng chi
                  </p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                    {formatCurrency(statistics.expense)}
                  </p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Chênh lệch
                  </p>
                  <p
                    className={`text-2xl font-bold mt-1 ${
                      statistics.net >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {formatCurrency(statistics.net)}
                  </p>
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    statistics.net >= 0 ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {statistics.net >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Giao dịch
                  </p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                    {statistics.transactionCount}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          </div>

          {/* Lazy-loaded Charts */}
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            }
          >
            <ReportsCharts
              dailyData={dailyData}
              categoryData={categoryData}
              incomeCategoryData={incomeCategoryData}
              accountBalances={accountBalances}
              formatCurrency={formatCurrency}
            />
          </Suspense>

          {/* Top Transactions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Giao dịch lớn nhất
            </h3>
            <div className="space-y-3">
              {topTransactions.map((transaction) => {
                const category = categories.find(
                  (c) => c.id === transaction.category_id,
                );
                const account = accounts.find(
                  (a) => a.id === transaction.account_id,
                );

                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === "income"
                              ? "bg-green-100 dark:bg-green-900/30"
                              : "bg-red-100 dark:bg-red-900/30"
                          }`}
                        >
                          {transaction.type === "income" ? (
                            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {transaction.description ||
                              category?.name ||
                              "Giao dịch"}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {account?.name} •{" "}
                            {new Date(
                              transaction.occurred_on,
                            ).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          transaction.type === "income"
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
