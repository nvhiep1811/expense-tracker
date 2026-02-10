import { Injectable, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from '../common/services/base.service';
import { Budget } from '../common/types/entities';
import { CreateBudgetDto, UpdateBudgetDto } from './dto/budget.dto';

/**
 * Budget status response from v_budget_status view
 */
export interface BudgetStatusResponse {
  budget_id: string;
  user_id: string;
  category_id: string;
  period: 'weekly' | 'monthly' | 'yearly';
  start_date: string;
  end_date: string;
  limit_amount: number;
  alert_threshold_pct: number;
  rollover: boolean;
  category_name?: string;
  category_color?: string;
  spent: number;
  remaining: number;
  percentage: number;
}

@Injectable()
export class BudgetsService extends BaseService {
  constructor(configService: ConfigService) {
    super(configService);
  }

  async findAll(userId: string, accessToken: string): Promise<Budget[]> {
    const supabase = this.getAuthenticatedClient(accessToken);
    const { data, error } = await supabase
      .from('budgets')
      .select(
        'id, user_id, category_id, period, start_date, end_date, limit_amount, alert_threshold_pct, rollover, created_at, updated_at, deleted_at',
      )
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data as Budget[];
  }

  async findOne(
    userId: string,
    budgetId: string,
    accessToken: string,
  ): Promise<Budget> {
    const supabase = this.getAuthenticatedClient(accessToken);
    const { data, error } = await supabase
      .from('budgets')
      .select(
        'id, user_id, category_id, period, start_date, end_date, limit_amount, alert_threshold_pct, rollover, created_at, updated_at, deleted_at',
      )
      .eq('id', budgetId)
      .eq('user_id', userId)
      .is('deleted_at', null)
      .single();

    if (error) throw error;
    return data as Budget;
  }

  async create(
    userId: string,
    createData: CreateBudgetDto,
    accessToken: string,
  ): Promise<Budget> {
    const supabase = this.getAuthenticatedClient(accessToken);
    const { data, error } = await supabase
      .from('budgets')
      .insert({ ...createData, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return data as Budget;
  }

  async update(
    userId: string,
    budgetId: string,
    updateData: UpdateBudgetDto,
    accessToken: string,
  ): Promise<Budget> {
    const supabase = this.getAuthenticatedClient(accessToken);
    const { data, error } = await supabase
      .from('budgets')
      .update(updateData)
      .eq('id', budgetId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Budget;
  }

  async remove(
    userId: string,
    budgetId: string,
    accessToken: string,
  ): Promise<Budget> {
    const supabase = this.getAuthenticatedClient(accessToken);
    const { data, error } = await supabase
      .from('budgets')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', budgetId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Budget;
  }

  /**
   * Get budget status with spending calculations from view
   * Uses v_budget_status view for optimized performance
   */
  async getBudgetStatus(
    userId: string,
    accessToken: string,
  ): Promise<BudgetStatusResponse[]> {
    const supabase = this.getAuthenticatedClient(accessToken);
    const { data, error } = await supabase
      .from('v_budget_status')
      .select(
        'budget_id, user_id, category_id, period, start_date, end_date, limit_amount, alert_threshold_pct, rollover, category_name, category_color, spent, remaining, percentage',
      )
      .eq('user_id', userId)
      .order('start_date', { ascending: false });

    if (error) throw error;
    return (data || []) as BudgetStatusResponse[];
  }

  /**
   * Renew an expired budget by creating a new one for the next period
   * Validates that no duplicate budget exists for the same category and date range
   */
  async renewBudget(
    userId: string,
    budgetId: string,
    accessToken: string,
  ): Promise<Budget> {
    const supabase = this.getAuthenticatedClient(accessToken);

    // Get the original budget - only need fields for renewal
    const { data: originalBudget, error: fetchError } = await supabase
      .from('budgets')
      .select(
        'category_id, period, end_date, limit_amount, alert_threshold_pct, rollover',
      )
      .eq('id', budgetId)
      .eq('user_id', userId)
      .is('deleted_at', null)
      .single();

    if (fetchError) throw fetchError;
    if (!originalBudget) throw new Error('Budget not found');

    // Calculate next period dates
    const oldEndDate = new Date(originalBudget.end_date);
    const period = originalBudget.period;

    let newStartDate: Date;
    let newEndDate: Date;

    // New period starts the day after old period ends
    newStartDate = new Date(oldEndDate);
    newStartDate.setDate(newStartDate.getDate() + 1);

    switch (period) {
      case 'weekly':
        newEndDate = new Date(newStartDate);
        newEndDate.setDate(newEndDate.getDate() + 6);
        break;
      case 'monthly':
        newEndDate = new Date(newStartDate);
        newEndDate.setMonth(newEndDate.getMonth() + 1);
        newEndDate.setDate(newEndDate.getDate() - 1);
        break;
      case 'yearly':
        newEndDate = new Date(newStartDate);
        newEndDate.setFullYear(newEndDate.getFullYear() + 1);
        newEndDate.setDate(newEndDate.getDate() - 1);
        break;
      default:
        throw new Error('Invalid period');
    }

    const newStartDateStr = newStartDate.toISOString().split('T')[0];
    const newEndDateStr = newEndDate.toISOString().split('T')[0];

    // Check if a budget already exists for this category and date range
    const { data: existingBudget, error: checkError } = await supabase
      .from('budgets')
      .select('id')
      .eq('user_id', userId)
      .eq('category_id', originalBudget.category_id)
      .eq('start_date', newStartDateStr)
      .eq('end_date', newEndDateStr)
      .is('deleted_at', null)
      .maybeSingle();

    if (checkError) throw checkError;
    if (existingBudget) {
      throw new ConflictException(
        'Ngân sách cho kỳ này đã tồn tại. Vui lòng kiểm tra lại.',
      );
    }

    // Create new budget
    const { data: newBudget, error: createError } = await supabase
      .from('budgets')
      .insert({
        user_id: userId,
        category_id: originalBudget.category_id,
        period: originalBudget.period,
        start_date: newStartDateStr,
        end_date: newEndDateStr,
        limit_amount: originalBudget.limit_amount,
        alert_threshold_pct: originalBudget.alert_threshold_pct,
        rollover: originalBudget.rollover,
      })
      .select()
      .single();

    if (createError) throw createError;
    return newBudget as Budget;
  }
}
