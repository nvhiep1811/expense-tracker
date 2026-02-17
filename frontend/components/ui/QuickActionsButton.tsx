"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, X, CreditCard, Wallet, Target } from "lucide-react";
import TransactionModal from "@/components/modals/TransactionModal";
import AccountModal from "@/components/modals/AccountModal";
import BudgetModal from "@/components/modals/BudgetModal";
import type {
  TransactionFormData,
  AccountFormData,
  BudgetFormData,
} from "@/lib/validations";
import type { CategoryFormData } from "@/components/modals/CategoryModal";
import {
  useAccountsQuery,
  useCategoriesQuery,
  useCreateTransaction,
  useCreateAccount,
  useCreateCategory,
  useCreateBudget,
} from "@/hooks";

export default function QuickActionsButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<
    "transaction" | "account" | "budget" | null
  >(null);

  // React Query hooks
  const { data: accounts = [] } = useAccountsQuery();
  const { data: categories = [] } = useCategoriesQuery();

  // Mutations
  const createTransactionMutation = useCreateTransaction();
  const createAccountMutation = useCreateAccount();
  const createCategoryMutation = useCreateCategory();
  const createBudgetMutation = useCreateBudget();

  // Open modal
  const openModal = useCallback(
    (modal: "transaction" | "account" | "budget") => {
      setIsOpen(false);
      setActiveModal(modal);
    },
    [],
  );

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + N to open quick actions menu
      if (e.altKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      // Escape to close menu (only if no modal is open)
      if (e.key === "Escape" && isOpen && !activeModal) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeModal]);

  // Handler functions
  const handleAddTransaction = async (data: TransactionFormData) => {
    await createTransactionMutation.mutateAsync({
      type: data.type,
      amount: data.amount,
      account_id: data.account,
      category_id: data.category,
      occurred_on: data.date,
      description: data.description,
    });
    setActiveModal(null);
  };

  const handleAddAccount = async (data: AccountFormData) => {
    await createAccountMutation.mutateAsync({
      name: data.name,
      type: data.type,
      opening_balance: data.balance,
      currency: "VND",
      color: data.color,
    });
    setActiveModal(null);
  };

  const handleAddBudget = async (data: BudgetFormData) => {
    await createBudgetMutation.mutateAsync({
      category_id: data.category,
      period: data.period,
      start_date: data.start_date,
      end_date: data.end_date,
      limit_amount: data.amount,
      alert_threshold_pct: data.alert_threshold || 80,
      rollover: data.rollover || false,
    });
    setActiveModal(null);
  };

  const handleCategoryCreated = async (data: CategoryFormData) => {
    await createCategoryMutation.mutateAsync({
      name: data.name,
      side: data.side,
      icon: data.icon,
      color: data.color,
    });
  };

  const handleAccountCreated = async (data: AccountFormData) => {
    await createAccountMutation.mutateAsync({
      name: data.name,
      type: data.type,
      opening_balance: data.balance,
      color: data.color,
    });
  };

  const quickActions = [
    {
      id: "transaction",
      label: "Thêm giao dịch",
      icon: CreditCard,
      color: "bg-green-500 hover:bg-green-600",
      shortcut: "T",
      onClick: () => openModal("transaction"),
    },
    {
      id: "account",
      label: "Thêm tài khoản",
      icon: Wallet,
      color: "bg-blue-500 hover:bg-blue-600",
      shortcut: "A",
      onClick: () => openModal("account"),
    },
    {
      id: "budget",
      label: "Thêm ngân sách",
      icon: Target,
      color: "bg-purple-500 hover:bg-purple-600",
      shortcut: "B",
      onClick: () => openModal("budget"),
    },
  ];

  return (
    <>
      {/* Backdrop when menu is open - Behind quick actions but above menu button */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-20"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Quick Actions FAB */}
      <div className="fixed bottom-6 right-4 z-40 flex flex-col-reverse items-end gap-3">
        {/* Action buttons - shown when menu is open */}
        {isOpen && (
          <div
            className="flex flex-col-reverse gap-2 mb-2 animate-in slide-in-from-bottom-4 fade-in duration-200"
            role="menu"
            aria-label="Menu hành động nhanh"
          >
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.onClick}
                  role="menuitem"
                  className={`flex items-center gap-3 px-4 py-3 ${action.color} text-white rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer group`}
                  title={`${action.label}`}
                  aria-label={action.label}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium whitespace-nowrap pr-2">
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Main FAB button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer ${
            isOpen
              ? "bg-gray-600 hover:bg-gray-700 rotate-45"
              : "bg-primary hover:bg-primary-hover"
          }`}
          title={isOpen ? "Đóng menu (Esc)" : "Thêm nhanh (Alt+N)"}
          aria-label={
            isOpen ? "Đóng menu hành động nhanh" : "Mở menu hành động nhanh"
          }
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Plus className="w-6 h-6 text-white" />
          )}
        </button>

        {/* Keyboard shortcut hint - hidden on small mobile */}
        {!isOpen && (
          <div
            className="hidden sm:flex absolute -top-1 -left-1 w-5 h-5 bg-gray-700 rounded-full items-center justify-center opacity-60"
            aria-hidden="true"
          >
            <span className="text-[10px] text-white font-bold">N</span>
          </div>
        )}
      </div>

      {/* Modals */}
      <TransactionModal
        isOpen={activeModal === "transaction"}
        onClose={() => setActiveModal(null)}
        onSubmit={handleAddTransaction}
        accounts={accounts}
        categories={categories}
        onAccountCreated={handleAccountCreated}
        onCategoryCreated={handleCategoryCreated}
      />

      <AccountModal
        isOpen={activeModal === "account"}
        onClose={() => setActiveModal(null)}
        onSubmit={handleAddAccount}
      />

      <BudgetModal
        isOpen={activeModal === "budget"}
        onClose={() => setActiveModal(null)}
        onSubmit={handleAddBudget}
        categories={categories}
        onCategoryCreated={handleCategoryCreated}
      />
    </>
  );
}
