"use client";

import { useState, useEffect, useCallback } from "react";
import { Keyboard, X } from "lucide-react";

/**
 * First-time only tooltip to introduce keyboard shortcuts
 * Shows once automatically on first visit, then never again
 */
export default function KeyboardShortcutsTooltip() {
  const [isVisible, setIsVisible] = useState(false);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    localStorage.setItem("keyboard-shortcuts-seen", "true");
  }, []);

  // Auto show tooltip only on first visit - check after mount
  useEffect(() => {
    // Small delay to avoid SSR issues and let page settle
    const checkTimer = setTimeout(() => {
      const hasSeenTooltip = localStorage.getItem("keyboard-shortcuts-seen");
      if (!hasSeenTooltip) {
        setIsVisible(true);
      }
    }, 2500);

    return () => clearTimeout(checkTimer);
  }, []);

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (isVisible) {
      const dismissTimer = setTimeout(() => {
        handleDismiss();
      }, 8000);
      return () => clearTimeout(dismissTimer);
    }
  }, [isVisible, handleDismiss]);

  const shortcuts = [
    { key: "Alt + N", description: "Mở menu thêm nhanh" },
    { key: "Esc", description: "Đóng menu / modal" },
  ];

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop - click to dismiss */}
      <div
        className="fixed inset-0 z-45"
        onClick={handleDismiss}
        aria-hidden="true"
      />

      {/* Tooltip content - floating near Quick Actions button */}
      <div
        className="fixed bottom-24 right-24 lg:bottom-10 lg:right-24 z-50 bg-card-bg rounded-xl shadow-2xl border border-card-border p-4 w-80 animate-in slide-in-from-bottom-4 fade-in duration-300"
        role="tooltip"
        aria-label="Hướng dẫn phím tắt"
      >
        {/* Arrow pointing to FAB */}
        <div className="absolute -bottom-2 right-8 w-4 h-4 bg-card-bg border-r border-b border-card-border transform rotate-45" />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Keyboard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                💡 Mẹo: Phím tắt hữu ích
              </h3>
              <p className="text-xs text-muted-text">Lần đầu sử dụng</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-muted-text hover:text-foreground transition-colors p-1 rounded hover:bg-hover-bg"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 px-3 bg-hover-bg rounded-lg"
            >
              <span className="text-sm text-foreground">
                {shortcut.description}
              </span>
              <kbd className="px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Progress bar for auto-dismiss */}
        <div className="mt-3 h-1 bg-hover-bg rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full animate-shrink-width"
            style={{ animationDuration: "8s" }}
          />
        </div>

        <p className="text-xs text-muted-text mt-2 text-center">
          Nhấn bất kỳ đâu để đóng
        </p>
      </div>
    </>
  );
}
