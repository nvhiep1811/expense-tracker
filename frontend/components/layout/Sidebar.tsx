"use client";

import {
  Wallet,
  TrendingUp,
  CreditCard,
  Target,
  DollarSign,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

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
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-6 border-b border-gray-200">
        <Link
          href="/dashboard"
          className="flex items-center space-x-2"
          onClick={onClose}
        >
          <Wallet className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-800">MoneyTrack</span>
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
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Link
          href="/dashboard/settings"
          onClick={onClose}
          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Cài đặt</span>
        </Link>
      </div>
    </div>
  );
}
