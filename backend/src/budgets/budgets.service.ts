import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from '../common/services/base.service';
import { Budget } from '../common/types/entities';
import { CreateBudgetDto, UpdateBudgetDto } from './dto/budget.dto';

@Injectable()
export class BudgetsService extends BaseService {
  constructor(configService: ConfigService) {
    super(configService);
  }

  async findAll(userId: string, accessToken: string): Promise<Budget[]> {
    const supabase = this.getAuthenticatedClient(accessToken);
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
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
      .select('*')
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
}
