"use client";

import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  amount: number;
  change?: number;
  icon: LucideIcon;
  color: string;
  isPositive?: boolean;
}

export default function StatCard({
  title,
  amount,
  change,
  icon: Icon,
  color,
  isPositive,
}: StatCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="bg-card-bg rounded-xl p-6 border border-card-border hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change !== undefined && (
          <span
            className={`text-sm font-medium ${
              isPositive
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {isPositive ? "+" : ""}
            {change}%
          </span>
        )}
      </div>
      <h3 className="text-sm text-muted-text mb-1">{title}</h3>
      <p className="text-2xl font-bold text-foreground">
        {formatCurrency(amount)}
      </p>
    </div>
  );
}
