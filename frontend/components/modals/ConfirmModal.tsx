"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";
import { useEffect, useCallback } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận",
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  variant = "danger",
  isLoading = false,
}: ConfirmModalProps) {
  // Handle Escape key to close modal
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    },
    [onClose, isLoading],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: <Trash2 className="w-6 h-6 text-red-600" />,
      iconBg: "bg-red-100 dark:bg-red-900/30",
      button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    },
    warning: {
      icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
      iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
      button: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
    },
    info: {
      icon: <AlertTriangle className="w-6 h-6 text-blue-600" />,
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onClose();
      }}
    >
      <div className="bg-card-bg rounded-xl max-w-md w-full p-6 border border-card-border shadow-xl">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full ${styles.iconBg}`}>
            {styles.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3
                id="confirm-modal-title"
                className="text-lg font-semibold text-foreground"
              >
                {title}
              </h3>
              <button
                onClick={onClose}
                disabled={isLoading}
                aria-label="Đóng"
                className="text-muted-text hover:text-foreground transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="mt-2 text-sm text-muted-text">{message}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 border border-card-border rounded-lg hover:bg-hover-bg text-foreground font-medium transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            disabled={isLoading}
            className={`flex-1 px-4 py-2.5 text-white rounded-lg font-medium transition-colors focus:ring-2 focus:ring-offset-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed ${styles.button}`}
          >
            {isLoading ? "Đang xử lý..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
