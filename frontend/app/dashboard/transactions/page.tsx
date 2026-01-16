"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import { Search, Plus } from "lucide-react";
import TransactionModal from "@/components/modals/TransactionModal";
import type { TransactionFormData } from "@/lib/validations";

export default function TransactionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions] = useState([
    {
      id: 1,
      type: "expense",
      amount: 350000,
      category: "Ăn uống",
      date: "2026-01-06",
      account: "Momo",
      description: "Ăn trưa văn phòng",
    },
    {
      id: 2,
      type: "expense",
      amount: 1200000,
      category: "Mua sắm",
      date: "2026-01-05",
      account: "Techcombank",
      description: "Mua quần áo",
    },
    {
      id: 3,
      type: "income",
      amount: 15000000,
      category: "Lương",
      date: "2026-01-01",
      account: "Techcombank",
      description: "Lương tháng 1",
    },
    {
      id: 4,
      type: "expense",
      amount: 450000,
      category: "Di chuyển",
      date: "2026-01-04",
      account: "Ví tiền mặt",
      description: "Grab",
    },
    {
      id: 5,
      type: "expense",
      amount: 2500000,
      category: "Hóa đơn",
      date: "2026-01-03",
      account: "Techcombank",
      description: "Tiền điện nước",
    },
    {
      id: 6,
      type: "expense",
      amount: 180000,
      category: "Ăn uống",
      date: "2026-01-02",
      account: "Momo",
      description: "Cà phê sáng",
    },
    {
      id: 7,
      type: "income",
      amount: 2000000,
      category: "Freelance",
      date: "2026-01-02",
      account: "Techcombank",
      description: "Dự án web",
    },
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleAddTransaction = (data: TransactionFormData) => {
    console.log("New transaction:", data);
    // TODO: Add API call to save transaction
  };

  return (
    <>
      <Header
        title="Giao dịch"
        subtitle="Quản lý tất cả các giao dịch của bạn"
      />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-card-bg rounded-xl p-4 sm:p-6 border border-card-border">
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="flex-1 min-w-full sm:min-w-[250px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-text w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm giao dịch..."
                    className="w-full pl-10 pr-4 py-2 border border-input-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-input-bg text-foreground"
                  />
                </div>
              </div>
              <select className="w-full sm:w-auto px-4 py-2 border border-input-border rounded-lg focus:ring-2 focus:ring-blue-500 bg-input-bg text-foreground">
                <option>Tất cả loại</option>
                <option>Thu nhập</option>
                <option>Chi tiêu</option>
              </select>
              <select className="w-full sm:w-auto px-4 py-2 border border-input-border rounded-lg focus:ring-2 focus:ring-blue-500 bg-input-bg text-foreground">
                <option>Tháng này</option>
                <option>Tháng trước</option>
                <option>7 ngày qua</option>
                <option>30 ngày qua</option>
              </select>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Thêm giao dịch</span>
              </button>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-card-bg rounded-xl border border-card-border overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-hover-bg border-b border-card-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-text">
                    Ngày
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-text">
                    Mô tả
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-text">
                    Danh mục
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-text">
                    Tài khoản
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-muted-text">
                    Số tiền
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-hover-bg cursor-pointer">
                    <td className="px-6 py-4 text-sm text-muted-text">
                      {tx.date}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {tx.description}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-text">
                      {tx.account}
                    </td>
                    <td
                      className={`px-6 py-4 text-sm font-semibold text-right ${
                        tx.type === "income"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transaction Modal */}
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddTransaction}
        />
      </main>
    </>
  );
}
