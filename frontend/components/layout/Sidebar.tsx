"use client";

import {
  Wallet,
  TrendingUp,
  CreditCard,
  Target,
  DollarSign,
  Settings,
  User,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const menuItems = [
    {
      id: "dashboard",
      label: "Tổng quan",
      icon: TrendingUp,
      href: "/dashboard",
    },
    {
      id: "transactions",
      label: "Giao dịch",
      icon: CreditCard,
      href: "/dashboard/transactions",
    },
    {
      id: "budgets",
      label: "Ngân sách",
      icon: Target,
      href: "/dashboard/budgets",
    },
    {
      id: "accounts",
      label: "Tài khoản",
      icon: Wallet,
      href: "/dashboard/accounts",
    },
    {
      id: "reports",
      label: "Báo cáo",
      icon: DollarSign,
      href: "/dashboard/reports",
    },
    {
      id: "profile",
      label: "Hồ sơ",
      icon: User,
      href: "/dashboard/profile",
    },
  ];

  const themeOptions = [
    { value: "light" as const, label: "Sáng", icon: Sun },
    { value: "dark" as const, label: "Tối", icon: Moon },
    { value: "system" as const, label: "Hệ thống", icon: Monitor },
  ];

  return (
    <div className="w-64 bg-sidebar-bg border-r border-sidebar-border flex flex-col h-screen">
      <div className="p-6 border-b border-sidebar-border">
        <Link
          href="/dashboard"
          className="flex items-center space-x-2"
          onClick={onClose}
        >
          <Wallet className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold text-foreground">MoneyTrack</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={onClose}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
                  : "text-muted-text hover:bg-hover-bg"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Theme Switcher */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="mb-3">
          <p className="text-xs font-medium text-muted-text uppercase tracking-wider mb-2 px-2">
            Giao diện
          </p>
          <div className="bg-hover-bg rounded-lg p-1 flex">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = theme === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "bg-card-bg text-foreground shadow-sm"
                      : "text-muted-text hover:text-foreground"
                  }`}
                  title={option.label}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden xl:inline">{option.label}</span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-text mt-2 px-2">
            {theme === "system"
              ? `Theo hệ thống (${resolvedTheme === "dark" ? "Tối" : "Sáng"})`
              : theme === "dark"
                ? "Chế độ tối"
                : "Chế độ sáng"}
          </p>
        </div>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <Link
          href="/dashboard/settings"
          onClick={onClose}
          className="w-full flex items-center space-x-3 px-4 py-3 text-muted-text hover:bg-hover-bg rounded-lg"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Cài đặt</span>
        </Link>
      </div>
    </div>
  );
}
