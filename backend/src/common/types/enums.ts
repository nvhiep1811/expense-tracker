export enum AccountType {
  CASH = 'cash',
  BANK = 'bank',
  E_WALLET = 'e_wallet',
}

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
}

export enum CategorySide {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum BudgetPeriod {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export enum AlertType {
  BUDGET_NEAR_LIMIT = 'budget_near_limit',
  BUDGET_OVER_LIMIT = 'budget_over_limit',
}

export enum RecurringFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}
