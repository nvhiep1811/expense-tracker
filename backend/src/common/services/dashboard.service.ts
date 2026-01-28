import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from './base.service';

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

@Injectable()
export class DashboardService extends BaseService {
  constructor(configService: ConfigService) {
    super(configService);
  }

  /**
   * Get comprehensive dashboard statistics using database views
   * Optimized for performance with pre-aggregated views
   */
  async getDashboardStats(
    userId: string,
    token: string,
  ): Promise<DashboardStats> {
    const supabase = this.getAuthenticatedClient(token);

    // Get current month boundaries
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Parallel queries using views
    const [cashflowResult, categoryResult, netWorthResult, categoriesResult] =
      await Promise.all([
        // Monthly cashflow from view
        supabase
          .from('v_monthly_cashflow')
          .select('*')
          .eq('user_id', userId)
          .order('month', { ascending: false })
          .limit(6),

        // Category spending for current month from view
        supabase
          .from('v_category_spend_monthly')
          .select('*')
          .eq('user_id', userId)
          .gte('month', currentMonthStart.toISOString().split('T')[0])
          .lt('month', nextMonthStart.toISOString().split('T')[0]),

        // Net worth from view
        supabase.from('v_net_worth').select('*').eq('user_id', userId).single(),

        // Categories for enrichment
        supabase
          .from('categories')
          .select('id, name, color')
          .eq('user_id', userId)
          .is('deleted_at', null),
      ]);

    if (cashflowResult.error) throw new Error(cashflowResult.error.message);
    if (categoryResult.error) throw new Error(categoryResult.error.message);
    if (netWorthResult.error) throw new Error(netWorthResult.error.message);
    if (categoriesResult.error) throw new Error(categoriesResult.error.message);

    // Process monthly cashflow (last 6 months)
    const monthlyCashflow: MonthlyCashflow[] = (cashflowResult.data || []).map(
      (row: any) => ({
        month: row.month,
        income: row.income || 0,
        expense: row.expense || 0,
        net: (row.income || 0) - (row.expense || 0),
      }),
    );

    // Get current month stats
    const currentMonthData = monthlyCashflow.find((m) => {
      const monthDate = new Date(m.month);
      return (
        monthDate.getMonth() === now.getMonth() &&
        monthDate.getFullYear() === now.getFullYear()
      );
    });

    // Process category spending with enrichment
    const categoriesMap = new Map(
      (categoriesResult.data || []).map((c: any) => [c.id, c]),
    );

    const categorySpending: CategorySpending[] = (
      categoryResult.data || []
    ).map((row: any) => {
      const category = categoriesMap.get(row.category_id) as
        | { id: string; name: string; color?: string }
        | undefined;
      return {
        category_id: row.category_id,
        category_name: category?.name || 'Unknown',
        spent: row.spent || 0,
        color: category?.color || '#3b82f6',
      };
    });

    return {
      currentMonth: {
        income: currentMonthData?.income || 0,
        expense: currentMonthData?.expense || 0,
        net: currentMonthData?.net || 0,
      },
      netWorth: netWorthResult.data?.net_worth || 0,
      monthlyCashflow: monthlyCashflow.reverse(), // Oldest to newest
      categorySpending,
    };
  }

  /**
   * Get monthly cashflow trends (last N months)
   * Uses v_monthly_cashflow view
   */
  async getMonthlyCashflow(
    userId: string,
    token: string,
    months = 6,
  ): Promise<MonthlyCashflow[]> {
    const supabase = this.getAuthenticatedClient(token);

    const { data, error } = await supabase
      .from('v_monthly_cashflow')
      .select('*')
      .eq('user_id', userId)
      .order('month', { ascending: false })
      .limit(months);

    if (error) throw new Error(error.message);

    return (data || [])
      .map((row: any) => ({
        month: row.month,
        income: row.income || 0,
        expense: row.expense || 0,
        net: (row.income || 0) - (row.expense || 0),
      }))
      .reverse(); // Oldest to newest
  }

  /**
   * Get net worth from view
   * Uses v_net_worth view
   */
  async getNetWorth(userId: string, token: string): Promise<number> {
    const supabase = this.getAuthenticatedClient(token);

    const { data, error } = await supabase
      .from('v_net_worth')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw new Error(error.message);

    return data?.net_worth || 0;
  }
}
