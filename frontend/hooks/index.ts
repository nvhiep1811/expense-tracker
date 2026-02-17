/**
 * React Query Hooks
 *
 * NAMING CONVENTION:
 * - Query hooks: use[Entity]Query (e.g., useAccountsQuery, useCategoriesQuery)
 * - Mutation hooks: useCreate[Entity], useUpdate[Entity], useDelete[Entity]
 *
 * All data fetching is powered by TanStack Query v5 with:
 * - Automatic caching và background refetch
 * - Stale-while-revalidate pattern
 * - Automatic retry with exponential backoff
 * - DevTools for debugging (chỉ hiển thị ở development mode)
 */

// Query hooks - suffix "Query" để rõ ràng đây là React Query hooks
export * from "./queries/useAccounts";
export * from "./queries/useCategories";
export * from "./queries/useTransactions";
export * from "./queries/useBudgets";
export * from "./queries/useDashboard";
export * from "./queries/useAlerts";
export * from "./queries/useProfile";

// Mutation hooks - tự động invalidate cache và hiển thị toast
export * from "./mutations/useAccountMutations";
export * from "./mutations/useCategoryMutations";
export * from "./mutations/useTransactionMutations";
export * from "./mutations/useBudgetMutations";
export * from "./mutations/useAlertMutations";
export * from "./mutations/useProfileMutations";

// Utility hooks
export * from "./useCurrency";
export * from "./useDebounce";
export * from "./usePrefetch";
