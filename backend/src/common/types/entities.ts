export interface Account {
  id: string;
  user_id: string;
  name: string;
  type: 'cash' | 'bank' | 'e_wallet';
  color?: string;
  currency: string;
  opening_balance: number;
  current_balance: number;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  side: 'income' | 'expense';
  icon?: string;
  color?: string;
  parent_id?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  occurred_on: string;
  account_id: string;
  category_id?: string;
  description?: string;
  note?: string;
  tags?: string[];
  attachments?: any;
  transfer_account_id?: string;
  recurring_rule_id?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  period: 'weekly' | 'monthly' | 'yearly';
  start_date: string;
  end_date: string;
  limit_amount: number;
  alert_threshold_pct: number;
  rollover: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

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

export interface RecurringRule {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  amount: number;
  account_id: string;
  category_id?: string;
  description?: string;
  freq: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  byweekday?: number[];
  bymonthday?: number;
  start_on: string;
  end_on?: string;
  last_generated_on?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Alert {
  id: string;
  user_id: string;
  type: string;
  message: string;
  data?: any;
  is_read: boolean;
  occurred_at: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  [key: string]: any;
}
