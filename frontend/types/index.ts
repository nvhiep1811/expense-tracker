// Account types
export interface Account {
  id: string;
  user_id: string;
  name: string;
  type: "cash" | "bank" | "e_wallet";
  color?: string;
  currency: string;
  opening_balance: number;
  current_balance: number;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

// Transaction types
export interface Transaction {
  id: string;
  user_id: string;
  type: "income" | "expense" | "transfer";
  amount: number;
  occurred_on: string;
  account_id: string;
  category_id?: string;
  description?: string;
  note?: string;
  tags?: string[];
  attachments?: unknown;
  transfer_account_id?: string;
  recurring_rule_id?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

// Category types
export interface Category {
  id: string;
  user_id: string;
  name: string;
  side: "income" | "expense";
  icon?: string;
  color?: string;
  parent_id?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

// Budget types
export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  period: "weekly" | "monthly" | "yearly";
  start_date: string;
  end_date: string;
  limit_amount: number;
  alert_threshold_pct: number;
  rollover: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

// Profile types
export interface Profile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  default_currency: string;
  timezone: string;
  month_start_day: number;
  created_at: string;
  updated_at: string;
}

// API Request types
export interface CreateAccountRequest {
  name: string;
  type: "cash" | "bank" | "e_wallet";
  opening_balance: number;
  currency?: string;
  color?: string;
}

export interface UpdateAccountRequest {
  name?: string;
  type?: "cash" | "bank" | "e_wallet";
  currency?: string;
  color?: string;
  is_archived?: boolean;
}

export interface CreateTransactionRequest {
  type: "income" | "expense" | "transfer";
  amount: number;
  account_id: string;
  category_id: string;
  occurred_on: string;
  description?: string;
  note?: string;
}

export interface UpdateTransactionRequest {
  type?: "income" | "expense" | "transfer";
  amount?: number;
  account_id?: string;
  category_id?: string;
  occurred_on?: string;
  description?: string;
  note?: string;
}

export interface TransactionFilters {
  type?: "income" | "expense" | "transfer";
  account_id?: string;
  category_id?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}

export interface CreateBudgetRequest {
  category_id: string;
  period: "weekly" | "monthly" | "yearly";
  start_date: string;
  end_date: string;
  limit_amount: number;
  alert_threshold_pct?: number;
  rollover?: boolean;
}

export interface UpdateBudgetRequest {
  category_id?: string;
  period?: "weekly" | "monthly" | "yearly";
  start_date?: string;
  end_date?: string;
  limit_amount?: number;
  alert_threshold_pct?: number;
  rollover?: boolean;
}

// Budget with spending info
export interface BudgetWithSpending extends Budget {
  spent: number;
  remaining: number;
  percentage: number;
  category?: Category;
}

// Budget status from v_budget_status view
export interface BudgetStatus {
  budget_id: string;
  user_id: string;
  category_id: string;
  period: "weekly" | "monthly" | "yearly";
  start_date: string;
  end_date: string;
  limit_amount: number;
  alert_threshold_pct: number;
  category_name?: string;
  category_color?: string;
  spent: number;
  remaining: number;
  percentage: number;
}

// Pagination types
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
