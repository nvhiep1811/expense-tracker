"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Header from "@/components/layout/Header";
import {
  Target,
  Plus,
  Loader2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  History,
  Pencil,
  Trash2,
  RefreshCw,
  Calendar,
} from "lucide-react";
import BudgetModal from "@/components/modals/BudgetModal";
import ConfirmModal from "@/components/modals/ConfirmModal";
import type { BudgetFormData } from "@/lib/validations";
import type { CategoryFormData } from "@/components/modals/CategoryModal";
import { budgetsAPI, categoriesAPI } from "@/lib/api";
import toast from "react-hot-toast";
import type { BudgetStatus, Category } from "@/types";
import { useCurrency } from "@/hooks/useCurrency";

export default function BudgetsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgets, setBudgets] = useState<BudgetStatus[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExpired, setShowExpired] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetStatus | null>(null);
  const [filterMonth, setFilterMonth] = useState<number | null>(null);
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    budgetId: string | null;
    budgetName: string;
  }>({ isOpen: false, budgetId: null, budgetName: "" });
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

  const handleSubmitBudget = async (data: BudgetFormData) => {
    try {
      if (editingBudget) {
        await budgetsAPI.update(editingBudget.budget_id, {
          category_id: data.category,
          period: data.period,
          start_date: data.start_date,
          end_date: data.end_date,
          limit_amount: data.amount,
          alert_threshold_pct: data.alert_threshold || 80,
          rollover: data.rollover || false,
        });
        toast.success("Cập nhật ngân sách thành công!");
      } else {
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
      }
      setEditingBudget(null);
      fetchData();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Không thể lưu ngân sách";
      toast.error(errorMessage);
    }
  };

  const handleDeleteBudget = async (budgetId: string) => {
    try {
      await budgetsAPI.delete(budgetId);
      toast.success("Xóa ngân sách thành công!");
      setDeleteConfirm({ isOpen: false, budgetId: null, budgetName: "" });
      fetchData();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Không thể xóa ngân sách";
      toast.error(errorMessage);
    }
  };

  const handleCategoryCreated = async (data: CategoryFormData) => {
    try {
      await categoriesAPI.create({
        name: data.name,
        side: data.side,
        icon: data.icon,
        color: data.color,
      });
      await fetchData(); // Reload categories
      toast.success("Tạo danh mục thành công!");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Không thể tạo danh mục",
      );
      throw error; // Re-throw to keep modal open
    }
  };

  const handleRenewBudget = async (budgetId: string) => {
    try {
      await budgetsAPI.renew(budgetId);
      toast.success("Gia hạn ngân sách thành công!");
      fetchData();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Không thể gia hạn ngân sách";
      toast.error(errorMessage);
    }
  };

  const handleEditBudget = (budget: BudgetStatus) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBudget(null);
  };

  // Map categories for display and split into active/expired
  const { activeBudgets, expiredBudgets } = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const budgetsWithCats = budgets.map((budget) => ({
      ...budget,
      category: categories.find((cat) => cat.id === budget.category_id),
    }));

    const active: typeof budgetsWithCats = [];
    const expired: typeof budgetsWithCats = [];

    budgetsWithCats.forEach((budget) => {
      const endDate = new Date(budget.end_date);
      endDate.setHours(23, 59, 59, 999);

      if (now <= endDate) {
        active.push(budget);
      } else {
        expired.push(budget);
      }
    });

    // Sort expired by end_date descending (most recent first)
    expired.sort(
      (a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime(),
    );

    return { activeBudgets: active, expiredBudgets: expired };
  }, [budgets, categories]);

  // Get available years and months for filtering
  const availableYearMonths = useMemo(() => {
    const yearMonths = new Set<string>();
    expiredBudgets.forEach((budget) => {
      const date = new Date(budget.end_date);
      yearMonths.add(`${date.getFullYear()}-${date.getMonth()}`);
    });

    const years = new Set<number>();
    yearMonths.forEach((ym) => {
      years.add(parseInt(ym.split("-")[0]));
    });

    return {
      years: Array.from(years).sort((a, b) => b - a),
    };
  }, [expiredBudgets]);

  // Filter expired budgets
  const filteredExpiredBudgets = useMemo(() => {
    return expiredBudgets.filter((budget) => {
      const date = new Date(budget.end_date);
      if (filterYear !== null && date.getFullYear() !== filterYear) {
        return false;
      }
      if (filterMonth !== null && date.getMonth() !== filterMonth) {
        return false;
      }
      return true;
    });
  }, [expiredBudgets, filterMonth, filterYear]);

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
                  {activeBudgets.length} ngân sách đang hoạt động
                  {expiredBudgets.length > 0 &&
                    ` • ${expiredBudgets.length} đã hết hạn`}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                <span>Thêm ngân sách</span>
              </button>
            </div>

            {activeBudgets.length === 0 && expiredBudgets.length === 0 ? (
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
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                  Tạo ngân sách đầu tiên
                </button>
                <p className="text-muted-text mt-2">
                  Hãy tạo ngân sách đầu tiên để theo dõi chi tiêu của bạn!
                </p>
              </div>
            ) : (
              <>
                {/* Active Budgets */}
                {activeBudgets.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-600" />
                      Đang hoạt động ({activeBudgets.length})
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {activeBudgets.map((budget) => (
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
                              <p className="text-xs text-muted-text mb-1">
                                Đã chi
                              </p>
                              <p className="text-sm font-semibold text-foreground">
                                {formatCurrency(budget.spent)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-text mb-1">
                                {budget.remaining < 0 ? "Vượt" : "Còn lại"}
                              </p>
                              <p
                                className={`text-sm font-semibold ${
                                  budget.remaining < 0
                                    ? "text-red-600 dark:text-red-400"
                                    : "text-green-600 dark:text-green-400"
                                }`}
                              >
                                {budget.remaining < 0 && "-"}
                                {formatCurrency(Math.abs(budget.remaining))}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-text mb-1">
                                Hạn mức
                              </p>
                              <p className="text-sm font-semibold text-foreground">
                                {formatCurrency(budget.limit_amount)}
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-4 mt-4 border-t border-card-border">
                            <button
                              onClick={() => handleEditBudget(budget)}
                              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer"
                            >
                              <Pencil className="w-4 h-4" />
                              Sửa
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  isOpen: true,
                                  budgetId: budget.budget_id,
                                  budgetName:
                                    budget.category?.name || "Danh mục",
                                })
                              }
                              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                              Xóa
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty Active State */}
                {activeBudgets.length === 0 && expiredBudgets.length > 0 && (
                  <div className="text-center py-12 bg-card-bg rounded-xl border border-card-border">
                    <Target className="w-12 h-12 text-muted-text mx-auto mb-3 opacity-50" />
                    <p className="text-muted-text">
                      Không có ngân sách nào đang hoạt động
                    </p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Tạo ngân sách mới
                    </button>
                  </div>
                )}

                {/* Expired Budgets (Collapsible) */}
                {expiredBudgets.length > 0 && (
                  <div className="space-y-4">
                    <button
                      onClick={() => setShowExpired(!showExpired)}
                      className="flex items-center gap-2 text-lg font-semibold text-muted-text hover:text-foreground transition-colors cursor-pointer"
                    >
                      <History className="w-5 h-5" />
                      Đã hết hạn ({expiredBudgets.length})
                      {showExpired ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>

                    {showExpired && (
                      <>
                        {/* Filter UI */}
                        <div className="flex flex-wrap gap-3 items-center bg-card-bg p-3 rounded-lg border border-card-border">
                          <div className="flex items-center gap-2 text-sm text-muted-text">
                            <Calendar className="w-4 h-4" />
                            <span>Lọc:</span>
                          </div>
                          <select
                            value={filterYear ?? ""}
                            onChange={(e) =>
                              setFilterYear(
                                e.target.value
                                  ? parseInt(e.target.value)
                                  : null,
                              )
                            }
                            className="px-3 py-1.5 text-sm rounded-lg border border-input-border bg-input-bg text-foreground"
                          >
                            <option value="">Tất cả năm</option>
                            {availableYearMonths.years.map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </select>
                          <select
                            value={filterMonth ?? ""}
                            onChange={(e) =>
                              setFilterMonth(
                                e.target.value
                                  ? parseInt(e.target.value)
                                  : null,
                              )
                            }
                            className="px-3 py-1.5 text-sm rounded-lg border border-input-border bg-input-bg text-foreground"
                          >
                            <option value="">Tất cả tháng</option>
                            {[...Array(12)].map((_, i) => (
                              <option key={i} value={i}>
                                Tháng {i + 1}
                              </option>
                            ))}
                          </select>
                          {(filterYear || filterMonth !== null) && (
                            <button
                              onClick={() => {
                                setFilterYear(null);
                                setFilterMonth(null);
                              }}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              Xóa bộ lọc
                            </button>
                          )}
                          <span className="text-sm text-muted-text ml-auto">
                            {filteredExpiredBudgets.length}/
                            {expiredBudgets.length} ngân sách
                          </span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-75">
                          {filteredExpiredBudgets.map((budget) => (
                            <div
                              key={budget.budget_id}
                              className="bg-card-bg rounded-xl p-6 border border-card-border"
                            >
                              {/* Budget Header */}
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold text-foreground mb-1">
                                    {budget.category?.name || "Danh mục"}
                                  </h3>
                                  <p className="text-sm text-muted-text">
                                    {getPeriodLabel(budget.period)} •{" "}
                                    {new Date(
                                      budget.start_date,
                                    ).toLocaleDateString("vi-VN")}{" "}
                                    -{" "}
                                    {new Date(
                                      budget.end_date,
                                    ).toLocaleDateString("vi-VN")}
                                  </p>
                                </div>
                                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                  Đã hết hạn
                                </span>
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
                                  <p className="text-xs text-muted-text mb-1">
                                    Đã chi
                                  </p>
                                  <p className="text-sm font-semibold text-foreground">
                                    {formatCurrency(budget.spent)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-text mb-1">
                                    {budget.remaining < 0 ? "Vượt" : "Còn lại"}
                                  </p>
                                  <p
                                    className={`text-sm font-semibold ${
                                      budget.remaining < 0
                                        ? "text-red-600 dark:text-red-400"
                                        : "text-green-600 dark:text-green-400"
                                    }`}
                                  >
                                    {budget.remaining < 0 && "-"}
                                    {formatCurrency(Math.abs(budget.remaining))}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-text mb-1">
                                    Hạn mức
                                  </p>
                                  <p className="text-sm font-semibold text-foreground">
                                    {formatCurrency(budget.limit_amount)}
                                  </p>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2 pt-4 mt-4 border-t border-card-border">
                                <button
                                  onClick={() =>
                                    handleRenewBudget(budget.budget_id)
                                  }
                                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors cursor-pointer"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                  Gia hạn
                                </button>
                                <button
                                  onClick={() =>
                                    setDeleteConfirm({
                                      isOpen: true,
                                      budgetId: budget.budget_id,
                                      budgetName:
                                        budget.category?.name || "Danh mục",
                                    })
                                  }
                                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Xóa
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {filteredExpiredBudgets.length === 0 && (
                          <div className="text-center py-8 bg-card-bg rounded-lg border border-card-border">
                            <p className="text-muted-text">
                              Không có ngân sách nào trong thời gian đã chọn
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Budget Modal */}
        <BudgetModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitBudget}
          categories={categories}
          editingBudget={editingBudget}
          onCategoryCreated={handleCategoryCreated}
        />

        {/* Delete Confirm Modal */}
        <ConfirmModal
          isOpen={deleteConfirm.isOpen}
          onClose={() =>
            setDeleteConfirm({ isOpen: false, budgetId: null, budgetName: "" })
          }
          onConfirm={() => {
            if (deleteConfirm.budgetId) {
              handleDeleteBudget(deleteConfirm.budgetId);
            }
          }}
          title="Xóa ngân sách"
          message={`Bạn có chắc chắn muốn xóa ngân sách "${deleteConfirm.budgetName}"? Hành động này không thể hoàn tác.`}
          confirmText="Xóa ngân sách"
          cancelText="Hủy bỏ"
          variant="danger"
        />
      </main>
    </>
  );
}
