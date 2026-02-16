"use client";

import { X, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema, type TransactionFormData } from "@/lib/validations";
import { useState, useEffect, useCallback } from "react";
import AccountModal from "./AccountModal";
import CategoryModal, { type CategoryFormData } from "./CategoryModal";
import type { AccountFormData } from "@/lib/validations";

interface Account {
  id: string;
  name: string;
  type: string;
}

interface Category {
  id: string;
  name: string;
  side: "income" | "expense";
  is_system?: boolean;
  icon?: string;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => void;
  accounts: Account[];
  categories: Category[];
  onAccountCreated?: (data: AccountFormData) => Promise<void>;
  onCategoryCreated?: (data: CategoryFormData) => Promise<void>;
}

export default function TransactionModal({
  isOpen,
  onClose,
  onSubmit: handleFormSubmit,
  accounts,
  categories,
  onAccountCreated,
  onCategoryCreated,
}: TransactionModalProps) {
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "expense",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const transactionType = watch("type");

  // Filter and group categories by type
  const filteredCategories = categories.filter(
    (cat) => cat.side === transactionType,
  );

  // Separate system and custom categories
  const systemCategories = filteredCategories.filter((cat) => cat.is_system);
  const customCategories = filteredCategories.filter((cat) => !cat.is_system);

  const onSubmit = (data: TransactionFormData) => {
    handleFormSubmit(data);
    reset();
    onClose();
  };

  const handleAccountCreated = async (data: AccountFormData) => {
    await onAccountCreated?.(data);
  };

  const handleCategoryCreated = async (data: CategoryFormData) => {
    await onCategoryCreated?.(data);
  };

  // Handle Escape key to close modal (only if no nested modal is open)
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isAccountModalOpen && !isCategoryModalOpen) {
        onClose();
      }
    },
    [onClose, isAccountModalOpen, isCategoryModalOpen],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="transaction-modal-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="bg-card-bg rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 mx-4 border border-card-border">
          <div className="flex items-center justify-between mb-6">
            <h2
              id="transaction-modal-title"
              className="text-2xl font-bold text-foreground"
            >
              Thêm giao dịch
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
            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Loại giao dịch
              </label>
              <select
                {...register("type")}
                className={`w-full px-4 py-2 border ${
                  errors.type ? "border-red-500" : "border-input-border"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-input-bg text-foreground`}
              >
                <option value="expense">Chi tiêu</option>
                <option value="income">Thu nhập</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.type.message}
                </p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Số tiền
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

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Danh mục
              </label>
              <div className="flex gap-2">
                <select
                  {...register("category")}
                  className={`flex-1 px-4 py-2 border ${
                    errors.category ? "border-red-500" : "border-input-border"
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
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
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
            </div>

            {/* Account */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tài khoản
              </label>
              {accounts.length === 0 ? (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
                    Bạn chưa có tài khoản nào. Vui lòng tạo tài khoản trước khi
                    thêm giao dịch.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsAccountModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Tạo tài khoản ngay
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <select
                      {...register("account")}
                      className={`flex-1 px-4 py-2 border ${
                        errors.account
                          ? "border-red-500"
                          : "border-input-border"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-input-bg text-foreground`}
                    >
                      <option value="">Chọn tài khoản</option>
                      {accounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setIsAccountModalOpen(true)}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
                      title="Thêm tài khoản mới"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {errors.account && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.account.message}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Ngày
              </label>
              <input
                type="date"
                {...register("date")}
                className={`w-full px-4 py-2 border ${
                  errors.date ? "border-red-500" : "border-input-border"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-input-bg text-foreground`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Mô tả (không bắt buộc)
              </label>
              <textarea
                {...register("description")}
                rows={3}
                className={`w-full px-4 py-2 border ${
                  errors.description ? "border-red-500" : "border-input-border"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-input-bg text-foreground`}
                placeholder="Nhập mô tả..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-card-border rounded-lg hover:bg-hover-bg text-foreground"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={accounts.length === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Thêm
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Account Modal */}
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onSubmit={handleAccountCreated}
      />

      {/* Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSubmit={handleCategoryCreated}
        defaultSide={transactionType as "income" | "expense"}
      />
    </>
  );
}
