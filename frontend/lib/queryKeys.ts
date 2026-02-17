import type { TransactionFilters } from "@/types";

/**
 * Query Key Factory Pattern
 * https://tkdodo.eu/blog/effective-react-query-keys
 *
 * Cấu trúc: [entity, scope?, filters?]
 * - entity: 'accounts', 'transactions', etc.
 * - scope: 'list', 'detail', 'status', etc.
 * - filters: object chứa các filter params
 */
export const queryKeys = {
  // ==================== ACCOUNTS ====================
  accounts: {
    all: ["accounts"] as const,
    lists: () => [...queryKeys.accounts.all, "list"] as const,
    list: (filters?: { includeArchived?: boolean }) =>
      [...queryKeys.accounts.lists(), filters] as const,
    details: () => [...queryKeys.accounts.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.accounts.details(), id] as const,
  },

  // ==================== CATEGORIES ====================
  categories: {
    all: ["categories"] as const,
    lists: () => [...queryKeys.categories.all, "list"] as const,
    list: (filters?: { side?: "income" | "expense" }) =>
      [...queryKeys.categories.lists(), filters] as const,
    details: () => [...queryKeys.categories.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.categories.details(), id] as const,
  },

  // ==================== TRANSACTIONS ====================
  transactions: {
    all: ["transactions"] as const,
    lists: () => [...queryKeys.transactions.all, "list"] as const,
    list: (filters?: TransactionFilters) =>
      [...queryKeys.transactions.lists(), filters] as const,
    details: () => [...queryKeys.transactions.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.transactions.details(), id] as const,
  },

  // ==================== BUDGETS ====================
  budgets: {
    all: ["budgets"] as const,
    lists: () => [...queryKeys.budgets.all, "list"] as const,
    list: () => [...queryKeys.budgets.lists()] as const,
    status: () => [...queryKeys.budgets.all, "status"] as const,
    details: () => [...queryKeys.budgets.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.budgets.details(), id] as const,
  },

  // ==================== DASHBOARD ====================
  dashboard: {
    all: ["dashboard"] as const,
    stats: () => [...queryKeys.dashboard.all, "stats"] as const,
    cashflow: (months?: number) =>
      [...queryKeys.dashboard.all, "cashflow", months] as const,
    netWorth: () => [...queryKeys.dashboard.all, "net-worth"] as const,
  },

  // ==================== ALERTS ====================
  alerts: {
    all: ["alerts"] as const,
    lists: () => [...queryKeys.alerts.all, "list"] as const,
    list: (options?: { isRead?: boolean; limit?: number }) =>
      [...queryKeys.alerts.lists(), options] as const,
    unreadCount: () => [...queryKeys.alerts.all, "unread-count"] as const,
  },

  // ==================== PROFILE ====================
  profile: {
    all: ["profile"] as const,
    me: () => [...queryKeys.profile.all, "me"] as const,
  },
} as const;

/**
 * Helper để invalidate tất cả queries liên quan đến một entity
 * Usage: queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all })
 */

/**
 * Invalidation Matrix - Các mutations cần invalidate những queries nào
 *
 * Transaction mutations:
 * - transactions.all (list)
 * - accounts.all (balance changes)
 * - dashboard.all (stats)
 * - budgets.status (spending)
 *
 * Account mutations:
 * - accounts.all
 *
 * Category mutations:
 * - categories.all
 *
 * Budget mutations:
 * - budgets.all
 * - dashboard.all
 */
