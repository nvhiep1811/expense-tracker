"use client";

import { X, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema, type TransactionFormData } from "@/lib/validations";
import { useState } from "react";
import AccountModal from "./AccountModal";
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
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => void;
  accounts: Account[];
  categories: Category[];
  onAccountCreated?: () => void; // Callback to refresh accounts
}

export default function TransactionModal({
  isOpen,
  onClose,
  onSubmit: handleFormSubmit,
  accounts,
  categories,
  onAccountCreated,
}: TransactionModalProps) {
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

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

  const filteredCategories = categories.filter(
    (cat) => cat.side === transactionType,
  );

  const onSubmit = (data: TransactionFormData) => {
    handleFormSubmit(data);
    reset();
    onClose();
  };

  const handleAccountCreated = (data: AccountFormData) => {
    setIsAccountModalOpen(false);
    onAccountCreated?.();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-card-bg rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 border border-card-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Thêm giao dịch
            </h2>
            <button
              onClick={onClose}
              className="text-muted-text hover:text-foreground"
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
              <select
                {...register("category")}
                className={`w-full px-4 py-2 border ${
                  errors.category ? "border-red-500" : "border-input-border"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-input-bg text-foreground`}
              >
                <option value="">Chọn danh mục</option>
                {filteredCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
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
                  <select
                    {...register("account")}
                    className={`w-full px-4 py-2 border ${
                      errors.account ? "border-red-500" : "border-input-border"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-input-bg text-foreground`}
                  >
                    <option value="">Chọn tài khoản</option>
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name}
                      </option>
                    ))}
                  </select>
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
    </>
  );
}
