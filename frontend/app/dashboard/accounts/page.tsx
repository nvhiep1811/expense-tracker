"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import { Wallet, Plus } from "lucide-react";
import AccountModal from "@/components/modals/AccountModal";
import type { AccountFormData } from "@/lib/validations";

export default function AccountsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accounts] = useState([
    {
      id: 1,
      name: "Ví tiền mặt",
      type: "cash",
      balance: 5420000,
      color: "#10b981",
    },
    {
      id: 2,
      name: "Techcombank",
      type: "bank",
      balance: 25800000,
      color: "#3b82f6",
    },
    {
      id: 3,
      name: "Momo",
      type: "e_wallet",
      balance: 1250000,
      color: "#ec4899",
    },
    { id: 4, name: "VCB", type: "bank", balance: 8500000, color: "#f59e0b" },
    {
      id: 5,
      name: "ZaloPay",
      type: "e_wallet",
      balance: 750000,
      color: "#8b5cf6",
    },
  ]);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case "cash":
        return "Tiền mặt";
      case "bank":
        return "Ngân hàng";
      case "e_wallet":
        return "Ví điện tử";
      default:
        return type;
    }
  };

  const handleAddAccount = (data: AccountFormData) => {
    console.log("New account:", data);
    // TODO: Add API call to save account
  };

  return (
    <>
      <Header title="Tài khoản" subtitle="Quản lý các tài khoản của bạn" />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Tổng tài sản</h2>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {formatCurrency(totalBalance)}
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Thêm tài khoản</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-blue-500 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: acc.color + "20" }}
                  >
                    <Wallet className="w-6 h-6" style={{ color: acc.color }} />
                  </div>
                  <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                    {getAccountTypeLabel(acc.type)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {acc.name}
                </h3>
                <p className="text-2xl font-bold" style={{ color: acc.color }}>
                  {formatCurrency(acc.balance)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Account Modal */}
        <AccountModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddAccount}
        />
      </main>
    </>
  );
}
