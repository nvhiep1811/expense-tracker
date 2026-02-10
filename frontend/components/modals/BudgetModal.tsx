"use client";

import { X, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { budgetSchema, type BudgetFormData } from "@/lib/validations";
import type { Category, BudgetStatus } from "@/types";
import { useEffect, useState, useCallback } from "react";
import CategoryModal, { type CategoryFormData } from "./CategoryModal";

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BudgetFormData) => void;
  categories: Category[];
  editingBudget?: BudgetStatus | null;
  onCategoryCreated?: (data: CategoryFormData) => Promise<void>;
}

export default function BudgetModal({
  isOpen,
  onClose,
  onSubmit: handleFormSubmit,
  categories,
  editingBudget,
  onCategoryCreated,
}: BudgetModalProps) {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      period: "monthly",
      alert_threshold: 80,
      rollover: false,
    },
  });

  // Reset form when modal opens/closes or editing budget changes
  useEffect(() => {
    if (isOpen && editingBudget) {
      reset({
        category: editingBudget.category_id,
        amount: editingBudget.limit_amount,
        period: editingBudget.period,
        start_date: editingBudget.start_date.split("T")[0],
        end_date: editingBudget.end_date.split("T")[0],
        alert_threshold: editingBudget.alert_threshold_pct,
        rollover: editingBudget.rollover ?? false,
      });
    } else if (isOpen) {
      reset({
        category: "",
        amount: undefined,
        period: "monthly",
        start_date: "",
        end_date: "",
        alert_threshold: 80,
        rollover: false,
      });
    }
  }, [isOpen, editingBudget, reset]);

  // Handle Escape key to close modal
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isCategoryModalOpen) {
        onClose();
      }
    },
    [onClose, isCategoryModalOpen],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, handleEscape]);

  const onSubmit = (data: BudgetFormData) => {
    handleFormSubmit(data);
    reset();
    onClose();
  };

  const handleCategoryCreated = async (data: CategoryFormData) => {
    setIsCategoryModalOpen(false);
    await onCategoryCreated?.(data);
  };

  if (!isOpen) return null;

  // Filter only expense categories and separate system/custom
  const expenseCategories = categories.filter((cat) => cat.side === "expense");
  const systemCategories = expenseCategories.filter((cat) => cat.is_system);
  const customCategories = expenseCategories.filter((cat) => !cat.is_system);

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="budget-modal-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="bg-card-bg rounded-xl max-w-md w-full p-6 border border-card-border max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2
              id="budget-modal-title"
              className="text-2xl font-bold text-foreground"
            >
              {editingBudget ? "Sửa ngân sách" : "Thêm ngân sách"}
            </h2>
            <button
              onClick={onClose}
              aria-label="Đóng"
              className="text-muted-text hover:text-foreground cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Danh mục chi tiêu
              </label>
              {expenseCategories.length === 0 ? (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
                    Không có danh mục chi tiêu nào.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Tạo danh mục chi tiêu
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <select
                      {...register("category")}
                      className={`flex-1 px-4 py-2 border ${
                        errors.category
                          ? "border-red-500"
                          : "border-input-border"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-input-bg text-foreground`}
                    >
                      <option value="">Chọn danh mục</option>
                      {/* System categories */}
                      {systemCategories.length > 0 && (
                        <optgroup label="📁 Danh mục hệ thống">
                          {systemCategories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.icon} {cat.name}
                            </option>
                          ))}
                        </optgroup>
                      )}
                      {/* Custom categories */}
                      {customCategories.length > 0 && (
                        <optgroup label="⭐ Danh mục của tôi">
                          {customCategories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.icon} {cat.name}
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                    <button
                      type="button"
                      onClick={() => setIsCategoryModalOpen(true)}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1 cursor-pointer"
                      title="Thêm danh mục mới"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.category.message}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Hạn mức (VND)
              </label>
              <input
                type="number"
                {...register("amount", { valueAsNumber: true })}
                className={`w-full px-4 py-2 border ${
                  errors.amount ? "border-red-500" : "border-input-border"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-input-bg text-foreground`}
                placeholder="0"
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Period */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Kỳ hạn
              </label>
              <select
                {...register("period")}
                className={`w-full px-4 py-2 border ${
                  errors.period ? "border-red-500" : "border-input-border"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-input-bg text-foreground`}
              >
                <option value="weekly">Hàng tuần</option>
                <option value="monthly">Hàng tháng</option>
                <option value="yearly">Hàng năm</option>
              </select>
              {errors.period && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.period.message}
                </p>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Ngày bắt đầu
              </label>
              <input
                type="date"
                {...register("start_date")}
                className={`w-full px-4 py-2 border ${
                  errors.start_date ? "border-red-500" : "border-input-border"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-input-bg text-foreground`}
              />
              {errors.start_date && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.start_date.message}
                </p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Ngày kết thúc
              </label>
              <input
                type="date"
                {...register("end_date")}
                className={`w-full px-4 py-2 border ${
                  errors.end_date ? "border-red-500" : "border-input-border"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-input-bg text-foreground`}
              />
              {errors.end_date && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.end_date.message}
                </p>
              )}
            </div>

            {/* Alert Threshold */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Ngưỡng cảnh báo (%)
              </label>
              <input
                type="number"
                {...register("alert_threshold", { valueAsNumber: true })}
                className={`w-full px-4 py-2 border ${
                  errors.alert_threshold
                    ? "border-red-500"
                    : "border-input-border"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-input-bg text-foreground`}
                placeholder="80"
                min="1"
                max="100"
              />
              {errors.alert_threshold && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.alert_threshold.message}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-text">
                Bạn sẽ nhận cảnh báo khi chi tiêu đạt ngưỡng này
              </p>
            </div>

            {/* Rollover */}
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register("rollover")}
                id="rollover"
                className="w-4 h-4 text-blue-600 bg-input-bg border-input-border rounded focus:ring-blue-500"
              />
              <label
                htmlFor="rollover"
                className="ml-2 text-sm text-foreground cursor-pointer"
              >
                Chuyển số dư còn lại sang kỳ tiếp theo
              </label>
            </div>

            {/* Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-card-border rounded-lg hover:bg-hover-bg text-foreground cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={expenseCategories.length === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingBudget ? "Cập nhật" : "Thêm"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSubmit={handleCategoryCreated}
        defaultSide="expense"
      />
    </>
  );
}
