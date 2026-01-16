"use client";

import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema, type TransactionFormData } from "@/lib/validations";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => void;
}

export default function TransactionModal({
  isOpen,
  onClose,
  onSubmit: handleFormSubmit,
}: TransactionModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "expense",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = (data: TransactionFormData) => {
    handleFormSubmit(data);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card-bg rounded-xl max-w-md w-full p-6 border border-card-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Thêm giao dịch</h2>
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
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
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
              <option value="Ăn uống">Ăn uống</option>
              <option value="Mua sắm">Mua sắm</option>
              <option value="Di chuyển">Di chuyển</option>
              <option value="Hóa đơn">Hóa đơn</option>
              <option value="Lương">Lương</option>
              <option value="Freelance">Freelance</option>
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
            <select
              {...register("account")}
              className={`w-full px-4 py-2 border ${
                errors.account ? "border-red-500" : "border-input-border"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-input-bg text-foreground`}
            >
              <option value="">Chọn tài khoản</option>
              <option value="Ví tiền mặt">Ví tiền mặt</option>
              <option value="Techcombank">Techcombank</option>
              <option value="Momo">Momo</option>
              <option value="VCB">VCB</option>
              <option value="ZaloPay">ZaloPay</option>
            </select>
            {errors.account && (
              <p className="mt-1 text-sm text-red-600">
                {errors.account.message}
              </p>
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
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
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
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
