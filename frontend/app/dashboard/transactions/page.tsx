"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Header from "@/components/layout/Header";
import { Search, Plus, Loader2 } from "lucide-react";
import TransactionModal from "@/components/modals/TransactionModal";
import Pagination from "@/components/ui/Pagination";
import type { TransactionFormData } from "@/lib/validations";
import { transactionsAPI, accountsAPI, categoriesAPI } from "@/lib/api";
import toast from "react-hot-toast";
import type { Transaction, Account, Category, PaginationMeta } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import { useCurrency } from "@/hooks/useCurrency";

export default function TransactionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 300);
  const formatCurrency = useCurrency();

  const fetchAccounts = useCallback(async () => {
    try {
      const data = await accountsAPI.getAll();
      setAccounts(data);
    } catch {
      toast.error("Không thể tải danh sách tài khoản");
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await categoriesAPI.getAll();
      setCategories(data);
    } catch {
      toast.error("Không thể tải danh sách danh mục");
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await transactionsAPI.getAll({
        type: (filterType || undefined) as
          | "income"
          | "expense"
          | "transfer"
          | undefined,
        page,
        limit,
      });
      setTransactions(response.data);
      setPagination(response.meta);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Không thể tải dữ liệu giao dịch",
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit, filterType]);

  useEffect(() => {
    fetchAccounts();
    fetchCategories();
  }, [fetchAccounts, fetchCategories]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions, debouncedSearch]);

  const getAccountName = useMemo(
    () => (accountId: string) => {
      const account = accounts.find((acc) => acc.id === accountId);
      return account?.name || "N/A";
    },
    [accounts],
  );

  const getCategoryName = useMemo(
    () => (categoryId?: string) => {
      if (!categoryId) return "Không danh mục";
      const category = categories.find((cat) => cat.id === categoryId);
      return category?.name || "N/A";
    },
    [categories],
  );

  const handleAddTransaction = async (data: TransactionFormData) => {
    try {
      await transactionsAPI.create({
        type: data.type,
        amount: data.amount,
        account_id: data.account,
        category_id: data.category,
        occurred_on: data.date,
        description: data.description,
      });
      toast.success("Thêm giao dịch thành công!");
      fetchTransactions(); // Reload transactions
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Không thể thêm giao dịch",
      );
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        !debouncedSearch ||
        tx.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        getAccountName(tx.account_id)
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()) ||
        getCategoryName(tx.category_id)
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase());
      return matchesSearch;
    });
  }, [transactions, debouncedSearch, getAccountName, getCategoryName]);

  return (
    <>
      <Header
        title="Giao dịch"
        subtitle="Quản lý tất cả các giao dịch của bạn"
      />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-card-bg rounded-xl p-4 sm:p-6 border border-card-border">
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
                <div className="flex-1 min-w-full sm:min-w-62.5">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-text w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm giao dịch..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-input-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-input-bg text-foreground"
                    />
                  </div>
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2 border border-input-border rounded-lg focus:ring-2 focus:ring-blue-500 bg-input-bg text-foreground"
                >
                  <option value="">Tất cả loại</option>
                  <option value="income">Thu nhập</option>
                  <option value="expense">Chi tiêu</option>
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
            <div className="bg-card-bg rounded-xl border border-card-border overflow-hidden">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-text">Không có giao dịch nào</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-160">
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
                        {filteredTransactions.map((tx) => (
                          <tr
                            key={tx.id}
                            className="hover:bg-hover-bg cursor-pointer"
                          >
                            <td className="px-6 py-4 text-sm text-muted-text">
                              {new Date(tx.occurred_on).toLocaleDateString(
                                "vi-VN",
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-foreground">
                              {tx.description || "Không có mô tả"}
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                {getCategoryName(tx.category_id)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-text">
                              {getAccountName(tx.account_id)}
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

                  {/* Pagination */}
                  <Pagination
                    pagination={pagination}
                    page={page}
                    limit={limit}
                    onPageChange={setPage}
                    onLimitChange={setLimit}
                    itemName="giao dịch"
                  />
                </>
              )}
            </div>
          </div>
        )}

        {/* Transaction Modal */}
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddTransaction}
          accounts={accounts}
          categories={categories}
        />
      </main>
    </>
  );
}
