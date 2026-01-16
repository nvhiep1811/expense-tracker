"use client";

import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema, type AccountFormData } from "@/lib/validations";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AccountFormData) => void;
}

export default function AccountModal({
  isOpen,
  onClose,
  onSubmit: handleFormSubmit,
}: AccountModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      type: "bank",
      balance: 0,
      color: "#3b82f6",
    },
  });

  const onSubmit = (data: AccountFormData) => {
    handleFormSubmit(data);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card-bg rounded-xl max-w-md w-full p-6 border border-card-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Thêm tài khoản</h2>
          <button
            onClick={onClose}
            className="text-muted-text hover:text-foreground"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tên tài khoản
            </label>
            <input
              type="text"
              {...register("name")}
              className={`w-full px-4 py-2 border ${
                errors.name ? "border-red-500" : "border-input-border"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-input-bg text-foreground`}
              placeholder="VD: Techcombank"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Loại tài khoản
            </label>
            <select
              {...register("type")}
              className={`w-full px-4 py-2 border ${
                errors.type ? "border-red-500" : "border-input-border"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-input-bg text-foreground`}
            >
              <option value="cash">Tiền mặt</option>
              <option value="bank">Ngân hàng</option>
              <option value="e_wallet">Ví điện tử</option>
              <option value="credit_card">Thẻ tín dụng</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          {/* Balance */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Số dư ban đầu
            </label>
            <input
              type="number"
              {...register("balance", { valueAsNumber: true })}
              className={`w-full px-4 py-2 border ${
                errors.balance ? "border-red-500" : "border-input-border"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-input-bg text-foreground`}
              placeholder="0"
            />
            {errors.balance && (
              <p className="mt-1 text-sm text-red-600">
                {errors.balance.message}
              </p>
            )}
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Màu sắc
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                {...register("color")}
                className="w-12 h-12 border border-input-border rounded cursor-pointer"
              />
              <input
                type="text"
                {...register("color")}
                className={`flex-1 px-4 py-2 border ${
                  errors.color ? "border-red-500" : "border-input-border"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-input-bg text-foreground`}
                placeholder="#3b82f6"
              />
            </div>
            {errors.color && (
              <p className="mt-1 text-sm text-red-600">
                {errors.color.message}
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
