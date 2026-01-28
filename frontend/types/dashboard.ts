export interface MonthlyCashflow {
  month: string;
  income: number;
  expense: number;
  net: number;
}

export interface CategorySpending {
  category_id: string;
  category_name?: string;
  spent: number;
  color?: string;
}

export interface DashboardStats {
  currentMonth: {
    income: number;
    expense: number;
    net: number;
  };
  netWorth: number;
  monthlyCashflow: MonthlyCashflow[];
  categorySpending: CategorySpending[];
}
