"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Header from "@/components/layout/Header";
import { Wallet, Plus, Loader2 } from "lucide-react";
import AccountModal from "@/components/modals/AccountModal";
import type { AccountFormData } from "@/lib/validations";
import { accountsAPI } from "@/lib/api";
import { toast } from "react-hot-toast";
import type { Account } from "@/types";
import { useCurrency } from "@/hooks/useCurrency";
export default function AccountsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const formatCurrency = useCurrency();

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await accountsAPI.getAll();
      setAccounts(data.filter((acc: Account) => !acc.is_archived));
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Không thể tải danh sách tài khoản",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // Memoize total balance calculation
  const totalBalance = useMemo(
    () => accounts.reduce((sum, acc) => sum + acc.current_balance, 0),
    [accounts],
  );

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

  const handleAddAccount = async (data: AccountFormData) => {
    try {
      await accountsAPI.create({
        name: data.name,
        type: data.type,
        opening_balance: data.balance,
        currency: "VND",
        color: data.color,
      });
      toast.success("Thêm tài khoản thành công!");
      fetchAccounts(); // Reload accounts
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Không thể thêm tài khoản",
      );
    }
  };

  return (
    <>
      <Header title="Tài khoản" subtitle="Quản lý các tài khoản của bạn" />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Tổng tài sản
                </h2>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                  {formatCurrency(totalBalance)}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                <span>Thêm tài khoản</span>
              </button>
            </div>

            {accounts.length === 0 ? (
              <div className="text-center py-12">
                <Wallet className="w-16 h-16 mx-auto text-muted-text mb-4" />
                <h3 className="text-xl font-semibold text-muted-text mb-2">
                  Chưa có tài khoản nào
                </h3>
                <p className="text-muted-text mb-6">
                  Hãy thêm tài khoản đầu tiên để bắt đầu theo dõi tài chính!
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                  Thêm tài khoản đầu tiên
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="bg-card-bg rounded-xl p-6 border-2 border-card-border hover:border-blue-500 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: (acc.color || "#3b82f6") + "20",
                        }}
                      >
                        <Wallet
                          className="w-6 h-6"
                          style={{ color: acc.color || "#3b82f6" }}
                        />
                      </div>
                      <span className="px-3 py-1 text-xs rounded-full bg-hover-bg text-muted-text">
                        {getAccountTypeLabel(acc.type)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {acc.name}
                    </h3>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: acc.color || "#3b82f6" }}
                    >
                      {formatCurrency(acc.current_balance)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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
