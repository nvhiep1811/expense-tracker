"use client";

import { X, Check, Loader2, Palette } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState, useCallback } from "react";
import { CATEGORY_COLORS, DEFAULT_CATEGORY_COLOR } from "@/constants/colors";
import CustomColorPicker from "@/components/ui/CustomColorPicker";

// Category icons with SVG images for better visuals
const CATEGORY_ICONS = [
  { id: "money-bag", emoji: "💰", label: "Tiền" },
  { id: "cash", emoji: "💵", label: "Tiền mặt" },
  { id: "gift", emoji: "🎁", label: "Quà" },
  { id: "chart", emoji: "📈", label: "Đầu tư" },
  { id: "food", emoji: "🍔", label: "Ăn uống" },
  { id: "shopping", emoji: "🛍️", label: "Mua sắm" },
  { id: "car", emoji: "🚗", label: "Giao thông" },
  { id: "movie", emoji: "🎬", label: "Giải trí" },
  { id: "bulb", emoji: "💡", label: "Điện nước" },
  { id: "hospital", emoji: "🏥", label: "Sức khỏe" },
  { id: "book", emoji: "📚", label: "Giáo dục" },
  { id: "house", emoji: "🏠", label: "Nhà ở" },
  { id: "shield", emoji: "🛡️", label: "Bảo hiểm" },
  { id: "pin", emoji: "📌", label: "Khác" },
  { id: "plane", emoji: "✈️", label: "Du lịch" },
  { id: "game", emoji: "🎮", label: "Game" },
  { id: "laptop", emoji: "💻", label: "Công nghệ" },
  { id: "phone", emoji: "📱", label: "Điện thoại" },
  { id: "gym", emoji: "🏋️", label: "Thể thao" },
  { id: "coffee", emoji: "☕", label: "Cafe" },
  { id: "pet", emoji: "🐕", label: "Thú cưng" },
  { id: "baby", emoji: "👶", label: "Em bé" },
  { id: "beauty", emoji: "💄", label: "Làm đẹp" },
  { id: "music", emoji: "🎵", label: "Âm nhạc" },
];

const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Tên danh mục không được để trống")
    .max(50, "Tên quá dài"),
  side: z.enum(["income", "expense"], {
    message: "Vui lòng chọn loại danh mục",
  }),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  defaultSide?: "income" | "expense";
}

export default function CategoryModal({
  isOpen,
  onClose,
  onSubmit: handleFormSubmit,
  defaultSide = "expense",
}: CategoryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      side: defaultSide,
      icon: "📌",
      color: DEFAULT_CATEGORY_COLOR,
    },
  });

  const selectedIcon = watch("icon");
  const selectedColor = watch("color");

  useEffect(() => {
    if (isOpen) {
      reset({
        name: "",
        side: defaultSide,
        icon: "📌",
        color: DEFAULT_CATEGORY_COLOR,
      });
      setIsSubmitting(false);
    }
  }, [isOpen, defaultSide, reset]);

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

  const onSubmit = async (data: CategoryFormData) => {
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

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-60"
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div className="bg-card-bg rounded-xl max-w-md w-full p-4 sm:p-6 mx-4 border border-card-border max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2
            id="category-modal-title"
            className="text-xl font-bold text-foreground"
          >
            Thêm danh mục mới
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
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tên danh mục
            </label>
            <input
              type="text"
              {...register("name")}
              className={`w-full px-4 py-2 border ${
                errors.name ? "border-red-500" : "border-input-border"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-input-bg text-foreground`}
              placeholder="Ví dụ: Cafe, Du lịch, Thể thao..."
              autoFocus
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Category Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Loại danh mục
            </label>
            <select
              {...register("side")}
              className={`w-full px-4 py-2 border ${
                errors.side ? "border-red-500" : "border-input-border"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-input-bg text-foreground`}
            >
              <option value="expense">Chi tiêu</option>
              <option value="income">Thu nhập</option>
            </select>
            {errors.side && (
              <p className="mt-1 text-sm text-red-600">{errors.side.message}</p>
            )}
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Biểu tượng
            </label>
            <div className="grid grid-cols-8 gap-2">
              {CATEGORY_ICONS.map((iconItem) => (
                <button
                  key={iconItem.id}
                  type="button"
                  onClick={() => setValue("icon", iconItem.emoji)}
                  title={iconItem.label}
                  className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                    selectedIcon === iconItem.emoji
                      ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-card-bg scale-110"
                      : "hover:bg-hover-bg hover:scale-105"
                  }`}
                  style={{
                    backgroundColor:
                      selectedIcon === iconItem.emoji
                        ? selectedColor + "20"
                        : undefined,
                  }}
                >
                  <span className="text-2xl">{iconItem.emoji}</span>
                  {selectedIcon === iconItem.emoji && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Màu sắc
            </label>
            <div className="grid grid-cols-8 gap-2">
              {CATEGORY_COLORS.map((color) => (
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
                value={selectedColor || DEFAULT_CATEGORY_COLOR}
                onChange={(color) => {
                  setValue("color", color);
                  setShowCustomPicker(false);
                }}
                onClose={() => setShowCustomPicker(false)}
              />
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
                {selectedIcon}
              </span>
              <div>
                <span className="font-semibold text-foreground text-lg">
                  {watch("name") || "Tên danh mục"}
                </span>
                <p className="text-xs text-muted-text">
                  {watch("side") === "income" ? "Thu nhập" : "Chi tiêu"}
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 border border-card-border rounded-xl hover:bg-hover-bg text-foreground font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                "Tạo danh mục"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
