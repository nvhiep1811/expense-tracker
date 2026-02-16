"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
} from "react";
import { accountsAPI, categoriesAPI } from "@/lib/api";
import type { Account, Category } from "@/types";

// Event types for data changes
export type DataEventType =
  | "accounts:created"
  | "accounts:updated"
  | "accounts:deleted"
  | "categories:created"
  | "categories:updated"
  | "categories:deleted"
  | "transactions:created"
  | "transactions:updated"
  | "transactions:deleted"
  | "budgets:created"
  | "budgets:updated"
  | "budgets:deleted";

// Custom event for data changes
class DataChangeEvent extends CustomEvent<{
  type: DataEventType;
  data?: unknown;
}> {
  constructor(type: DataEventType, data?: unknown) {
    super("data-change", { detail: { type, data } });
  }
}

// Global event emitter
export const dataEvents = {
  emit: (type: DataEventType, data?: unknown) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new DataChangeEvent(type, data));
    }
  },
  subscribe: (callback: (event: DataChangeEvent) => void) => {
    if (typeof window !== "undefined") {
      const handler = (e: Event) => callback(e as DataChangeEvent);
      window.addEventListener("data-change", handler);
      return () => window.removeEventListener("data-change", handler);
    }
    return () => {};
  },
};

interface DataContextType {
  // Accounts
  accounts: Account[];
  accountsLoading: boolean;
  refreshAccounts: () => Promise<void>;

  // Categories
  categories: Category[];
  categoriesLoading: boolean;
  refreshCategories: () => Promise<void>;

  // Helpers
  getAccountById: (id: string) => Account | undefined;
  getCategoryById: (id: string) => Category | undefined;
  getCategoriesBySide: (side: "income" | "expense") => Category[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Fetch accounts
  const refreshAccounts = useCallback(async () => {
    try {
      setAccountsLoading(true);
      const data = await accountsAPI.getAll();
      setAccounts(data);
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
    } finally {
      setAccountsLoading(false);
    }
  }, []);

  // Fetch categories
  const refreshCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const data = await categoriesAPI.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    refreshAccounts();
    refreshCategories();
  }, [refreshAccounts, refreshCategories]);

  // Subscribe to data change events
  useEffect(() => {
    const unsubscribe = dataEvents.subscribe((event) => {
      const { type } = event.detail;

      if (type.startsWith("accounts:")) {
        refreshAccounts();
      }
      if (type.startsWith("categories:")) {
        refreshCategories();
      }
      // Transactions affect account balances
      if (type.startsWith("transactions:")) {
        refreshAccounts();
      }
    });

    return unsubscribe;
  }, [refreshAccounts, refreshCategories]);

  // Helper functions
  const getAccountById = useCallback(
    (id: string) => accounts.find((acc) => acc.id === id),
    [accounts],
  );

  const getCategoryById = useCallback(
    (id: string) => categories.find((cat) => cat.id === id),
    [categories],
  );

  const getCategoriesBySide = useCallback(
    (side: "income" | "expense") =>
      categories.filter((cat) => cat.side === side),
    [categories],
  );

  const value = useMemo(
    () => ({
      accounts,
      accountsLoading,
      refreshAccounts,
      categories,
      categoriesLoading,
      refreshCategories,
      getAccountById,
      getCategoryById,
      getCategoriesBySide,
    }),
    [
      accounts,
      accountsLoading,
      refreshAccounts,
      categories,
      categoriesLoading,
      refreshCategories,
      getAccountById,
      getCategoryById,
      getCategoriesBySide,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}

// Convenience hooks
export function useAccounts() {
  const { accounts, accountsLoading, refreshAccounts, getAccountById } =
    useData();
  return {
    accounts,
    loading: accountsLoading,
    refresh: refreshAccounts,
    getById: getAccountById,
  };
}

export function useCategories() {
  const {
    categories,
    categoriesLoading,
    refreshCategories,
    getCategoryById,
    getCategoriesBySide,
  } = useData();
  return {
    categories,
    loading: categoriesLoading,
    refresh: refreshCategories,
    getById: getCategoryById,
    getBySide: getCategoriesBySide,
  };
}
