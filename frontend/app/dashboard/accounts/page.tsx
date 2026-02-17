"use client";

import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import { Plus } from "lucide-react";
import AccountModal from "@/components/modals/AccountModal";
import { AccountsPageSkeleton } from "@/components/ui/Skeleton";
import type { AccountFormData } from "@/lib/validations";
import { useCurrency, useAccountsQuery, useCreateAccount } from "@/hooks";

// Account type info with emojis
const ACCOUNT_TYPE_INFO: Record<string, { label: string; emoji: string }> = {
  cash: { label: "Tiền mặt", emoji: "💵" },
  bank: { label: "Ngân hàng", emoji: "🏦" },
  e_wallet: { label: "Ví điện tử", emoji: "📱" },
};

export default function AccountsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formatCurrency = useCurrency();

  // React Query hooks
  const { data: allAccounts = [], isLoading } = useAccountsQuery();
  const createAccountMutation = useCreateAccount();

  // Filter out archived accounts
  const accounts = useMemo(
    () => allAccounts.filter((acc) => !acc.is_archived),
    [allAccounts],
  );

  // Memoize total balance calculation
  const totalBalance = useMemo(
    () => accounts.reduce((sum, acc) => sum + acc.current_balance, 0),
    [accounts],
  );

  const getAccountTypeInfo = (type: string) => {
    return ACCOUNT_TYPE_INFO[type] || { label: type, emoji: "💰" };
  };

  const handleAddAccount = async (data: AccountFormData) => {
    await createAccountMutation.mutateAsync({
      name: data.name,
      type: data.type,
      opening_balance: data.balance,
      currency: "VND",
      color: data.color,
    });
    setIsModalOpen(false);
  };

  return (
    <>
      <Header title="Tài khoản" subtitle="Quản lý các tài khoản của bạn" />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {isLoading ? (
          <AccountsPageSkeleton />
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  Tổng tài sản
                </h2>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                  {formatCurrency(totalBalance)}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 shrink-0"
              >
                <Plus className="w-5 h-5" />
                <span>Thêm tài khoản</span>
              </button>
            </div>

            {accounts.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">💰</span>
                <h3 className="text-xl font-semibold text-muted-text mb-2">
                  Chưa có tài khoản nào
                </h3>
                <p className="text-muted-text mb-6">
                  Hãy thêm tài khoản đầu tiên để bắt đầu theo dõi tài chính!
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Thêm tài khoản đầu tiên
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map((acc) => {
                  const typeInfo = getAccountTypeInfo(acc.type);
                  return (
                    <div
                      key={acc.id}
                      className="bg-card-bg rounded-xl p-6 border-2 border-card-border hover:border-blue-500 hover:shadow-lg transition-all group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110"
                          style={{
                            backgroundColor: (acc.color || "#3b82f6") + "20",
                          }}
                        >
                          {typeInfo.emoji}
                        </div>
                        <span className="px-3 py-1 text-xs rounded-full bg-hover-bg text-muted-text">
                          {typeInfo.label}
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
                  );
                })}
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
