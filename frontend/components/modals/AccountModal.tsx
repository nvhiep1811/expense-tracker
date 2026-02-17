"use client";

import { X, Loader2, Check, Palette } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema, type AccountFormData } from "@/lib/validations";
import { useState, useEffect, useCallback } from "react";
import { ACCOUNT_COLORS, DEFAULT_ACCOUNT_COLOR } from "@/constants/colors";
import CustomColorPicker from "@/components/ui/CustomColorPicker";

// Account type options
const ACCOUNT_TYPES = [
  { value: "cash", label: "Tiền mặt", emoji: "💵" },
  { value: "bank", label: "Ngân hàng", emoji: "🏦" },
  { value: "e_wallet", label: "Ví điện tử", emoji: "📱" },
];

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AccountFormData) => Promise<void>;
}

export default function AccountModal({
  isOpen,
  onClose,
  onSubmit: handleFormSubmit,
}: AccountModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      type: "bank",
      balance: 0,
      color: DEFAULT_ACCOUNT_COLOR,
    },
  });

  const selectedColor = watch("color");
  const selectedType = watch("type");
  const accountName = watch("name");

  useEffect(() => {
    if (isOpen) {
      reset({
        name: "",
        type: "bank",
        balance: 0,
        color: DEFAULT_ACCOUNT_COLOR,
      });
      setIsSubmitting(false);
    }
  }, [isOpen, reset]);

  // Handle Escape key to close modal
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) {
        onClose();
      }
    },
    [onClose, isSubmitting],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, handleEscape]);

  const onSubmit = async (data: AccountFormData) => {
    try {
      setIsSubmitting(true);
      await handleFormSubmit(data);
      reset();
      onClose();
    } catch {
      // Error is handled by parent, keep modal open
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Get current account type info
  const currentTypeInfo =
    ACCOUNT_TYPES.find((t) => t.value === selectedType) || ACCOUNT_TYPES[1];

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-60"
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div className="bg-card-bg rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 mx-4 border border-card-border">
        <div className="flex items-center justify-between mb-6">
          <h2
            id="account-modal-title"
            className="text-xl font-bold text-foreground"
          >
            Thêm tài khoản mới
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Đóng"
            className="text-muted-text hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
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
              placeholder="VD: Techcombank, Ví MoMo..."
              autoFocus
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Type - Visual selector */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Loại tài khoản
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ACCOUNT_TYPES.map((type) => {
                const isSelected = selectedType === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      setValue(
                        "type",
                        type.value as "cash" | "bank" | "e_wallet",
                      )
                    }
                    className={`relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border border-input-border hover:border-blue-300 hover:bg-hover-bg"
                    }`}
                  >
                    <span className="text-2xl">{type.emoji}</span>
                    <span
                      className={`text-xs font-medium ${isSelected ? "text-blue-600 dark:text-blue-400" : "text-muted-text"}`}
                    >
                      {type.label}
                    </span>
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {/* Hidden input for form registration */}
            <input type="hidden" {...register("type")} />
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          {/* Balance */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Số dư ban đầu (VND)
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

          {/* Color - Visual picker */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Màu sắc
            </label>
            <div className="grid grid-cols-8 gap-2">
              {ACCOUNT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    setValue("color", color);
                    setShowCustomPicker(false);
                  }}
                  className={`relative w-9 h-9 rounded-full transition-all flex items-center justify-center cursor-pointer ${
                    selectedColor === color && !showCustomPicker
                      ? "ring-2 ring-offset-2 ring-offset-card-bg scale-110"
                      : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                >
                  {selectedColor === color && !showCustomPicker && (
                    <Check className="w-4 h-4 text-white drop-shadow-md" />
                  )}
                </button>
              ))}
              {/* Custom Color Button */}
              <button
                type="button"
                onClick={() => setShowCustomPicker(!showCustomPicker)}
                className={`relative w-9 h-9 rounded-full transition-all flex items-center justify-center cursor-pointer border-2 ${
                  showCustomPicker
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-110"
                    : "border-dashed border-input-border hover:border-blue-400 hover:bg-hover-bg hover:scale-110"
                }`}
                title="Màu tùy chỉnh"
              >
                <Palette className="w-4 h-4 text-muted-text" />
              </button>
            </div>

            {/* Custom Color Picker */}
            {showCustomPicker && (
              <CustomColorPicker
                value={selectedColor || DEFAULT_ACCOUNT_COLOR}
                onChange={(color) => {
                  setValue("color", color);
                  setShowCustomPicker(false);
                }}
                onClose={() => setShowCustomPicker(false)}
              />
            )}

            {/* Hidden input for form registration */}
            <input type="hidden" {...register("color")} />
            {errors.color && (
              <p className="mt-1 text-sm text-red-600">
                {errors.color.message}
              </p>
            )}
          </div>

          {/* Preview */}
          <div className="p-4 bg-linear-to-r from-hover-bg to-transparent rounded-xl border border-card-border">
            <p className="text-sm text-muted-text mb-3">Xem trước:</p>
            <div className="flex items-center gap-3">
              <span
                className="inline-flex items-center justify-center w-12 h-12 rounded-2xl text-2xl shadow-sm"
                style={{
                  backgroundColor: selectedColor + "25",
                }}
              >
                {currentTypeInfo.emoji}
              </span>
              <div>
                <span className="font-semibold text-foreground text-lg">
                  {accountName || "Tên tài khoản"}
                </span>
                <p className="text-xs text-muted-text">
                  {currentTypeInfo.label}
                </p>
              </div>
              <div
                className="ml-auto w-3 h-3 rounded-full"
                style={{ backgroundColor: selectedColor }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-card-border rounded-lg hover:bg-hover-bg text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang thêm...
                </>
              ) : (
                "Thêm"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
