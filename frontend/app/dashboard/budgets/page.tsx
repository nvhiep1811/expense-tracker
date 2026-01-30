"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Header from "@/components/layout/Header";
import { Target, Plus, Loader2, AlertTriangle } from "lucide-react";
import BudgetModal from "@/components/modals/BudgetModal";
import type { BudgetFormData } from "@/lib/validations";
import { budgetsAPI, categoriesAPI } from "@/lib/api";
import toast from "react-hot-toast";
import type { BudgetStatus, Category } from "@/types";
import { useCurrency } from "@/hooks/useCurrency";

export default function BudgetsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgets, setBudgets] = useState<BudgetStatus[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const formatCurrency = useCurrency();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [budgetsData, categoriesData] = await Promise.all([
        budgetsAPI.getStatus(),
        categoriesAPI.getAll(),
      ]);

      setBudgets(budgetsData);
      setCategories(categoriesData);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Không thể tải dữ liệu";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddBudget = async (data: BudgetFormData) => {
    try {
      await budgetsAPI.create({
        category_id: data.category,
        period: data.period,
        start_date: data.start_date,
        end_date: data.end_date,
        limit_amount: data.amount,
        alert_threshold_pct: data.alert_threshold || 80,
        rollover: data.rollover || false,
      });
      toast.success("Thêm ngân sách thành công!");
      fetchData();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Không thể thêm ngân sách";
      toast.error(errorMessage);
    }
  };

  // Map categories for display
  const budgetsWithCategories = useMemo(() => {
    return budgets.map((budget) => ({
      ...budget,
      category: categories.find((cat) => cat.id === budget.category_id),
    }));
  }, [budgets, categories]);

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case "weekly":
        return "Hàng tuần";
      case "monthly":
        return "Hàng tháng";
      case "yearly":
        return "Hàng năm";
      default:
        return period;
    }
  };

  const getProgressColor = (percentage: number, threshold: number) => {
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= threshold) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStatusBadge = (percentage: number, threshold: number) => {
    if (percentage >= 100) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Vượt hạn mức
        </span>
      );
    }
    if (percentage >= threshold) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Gần hạn mức
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
        Bình thường
      </span>
    );
  };

  return (
    <>
      <Header title="Ngân sách" subtitle="Quản lý ngân sách của bạn" />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Ngân sách của bạn
                </h2>
                <p className="text-muted-text mt-1">
                  {budgetsWithCategories.length} ngân sách đang hoạt động
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Thêm ngân sách</span>
              </button>
            </div>

            {budgetsWithCategories.length === 0 ? (
              <div className="text-center py-20">
                <Target className="w-16 h-16 text-muted-text mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-muted-text mb-2">
                  Chưa có ngân sách nào
                </h3>
                <p className="text-muted-text mb-6">
                  Tạo ngân sách để theo dõi chi tiêu theo danh mục
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Tạo ngân sách đầu tiên
                </button>
                <p className="text-muted-text mt-2">
                  Hãy tạo ngân sách đầu tiên để theo dõi chi tiêu của bạn!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {budgetsWithCategories.map((budget) => (
                  <div
                    key={budget.budget_id}
                    className="bg-card-bg rounded-xl p-6 border border-card-border hover:border-blue-500 transition-colors"
                  >
                    {/* Budget Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          {budget.category?.name || "Danh mục"}
                        </h3>
                        <p className="text-sm text-muted-text">
                          {getPeriodLabel(budget.period)} •{" "}
                          {new Date(budget.start_date).toLocaleDateString(
                            "vi-VN",
                          )}{" "}
                          -{" "}
                          {new Date(budget.end_date).toLocaleDateString(
                            "vi-VN",
                          )}
                        </p>
                      </div>
                      {getStatusBadge(
                        budget.percentage,
                        budget.alert_threshold_pct,
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-text">
                          Đã chi tiêu
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {budget.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${getProgressColor(
                            budget.percentage,
                            budget.alert_threshold_pct,
                          )}`}
                          style={{
                            width: `${Math.min(budget.percentage, 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Budget Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-card-border">
                      <div>
                        <p className="text-xs text-muted-text mb-1">Đã chi</p>
                        <p className="text-sm font-semibold text-foreground">
                          {formatCurrency(budget.spent)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-text mb-1">Còn lại</p>
                        <p
                          className={`text-sm font-semibold ${
                            budget.remaining < 0
                              ? "text-red-600 dark:text-red-400"
                              : "text-green-600 dark:text-green-400"
                          }`}
                        >
                          {formatCurrency(Math.abs(budget.remaining))}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-text mb-1">Hạn mức</p>
                        <p className="text-sm font-semibold text-foreground">
                          {formatCurrency(budget.limit_amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Budget Modal */}
        <BudgetModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddBudget}
          categories={categories}
        />
      </main>
    </>
  );
}
