export interface Account {
  id: string;
  user_id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  description?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: string;
  icon?: string;
  color?: string;
  description?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  category_id: string;
  type: string;
  amount: number;
  occurred_on: string;
  description?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Budget {
  id: string;
  user_id: string;
  name: string;
  category_id: string;
  amount: number;
  start_date: string;
  end_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Profile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface RecurringRule {
  id: string;
  user_id: string;
  name: string;
  transaction_type: string;
  amount: number;
  account_id: string;
  category_id: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  description?: string;
  is_active: boolean;
  last_executed_at?: string;
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
