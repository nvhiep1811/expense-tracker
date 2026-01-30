import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from '../common/services/base.service';
import { RecurringRule } from '../common/types/entities';
import {
  CreateRecurringRuleDto,
  UpdateRecurringRuleDto,
} from './dto/recurring-rule.dto';

@Injectable()
export class RecurringRulesService extends BaseService {
  constructor(configService: ConfigService) {
    super(configService);
  }

  async findAll(userId: string, accessToken: string): Promise<RecurringRule[]> {
    const supabase = this.getAuthenticatedClient(accessToken);
    const { data, error } = await supabase
      .from('recurring_rules')
      .select('*')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as RecurringRule[];
  }

  async findOne(
    userId: string,
    ruleId: string,
    accessToken: string,
  ): Promise<RecurringRule> {
    const supabase = this.getAuthenticatedClient(accessToken);
    const { data, error } = await supabase
      .from('recurring_rules')
      .select('*')
      .eq('id', ruleId)
      .eq('user_id', userId)
      .is('deleted_at', null)
      .single();

    if (error) throw error;
    return data as RecurringRule;
  }

  async create(
    userId: string,
    createData: CreateRecurringRuleDto,
    accessToken: string,
  ): Promise<RecurringRule> {
    const supabase = this.getAuthenticatedClient(accessToken);

    // Transform DTO field names to match database schema
    const dbData = {
      user_id: userId,
      type: createData.transaction_type,
      amount: createData.amount,
      account_id: createData.account_id,
      category_id: createData.category_id,
      description: createData.description,
      freq: createData.frequency,
      interval: 1, // Default interval
      start_on: createData.start_date,
      end_on: createData.end_date,
      is_active: true,
    };

    const { data, error } = await supabase
      .from('recurring_rules')
      .insert(dbData)
      .select()
      .single();

    if (error) throw error;
    return data as RecurringRule;
  }

  async update(
    userId: string,
    ruleId: string,
    updateData: UpdateRecurringRuleDto,
    accessToken: string,
  ): Promise<RecurringRule> {
    const supabase = this.getAuthenticatedClient(accessToken);

    // Transform DTO field names to match database schema
    const dbData: any = {};
    if (updateData.transaction_type !== undefined)
      dbData.type = updateData.transaction_type;
    if (updateData.amount !== undefined) dbData.amount = updateData.amount;
    if (updateData.account_id !== undefined)
      dbData.account_id = updateData.account_id;
    if (updateData.category_id !== undefined)
      dbData.category_id = updateData.category_id;
    if (updateData.description !== undefined)
      dbData.description = updateData.description;
    if (updateData.frequency !== undefined) dbData.freq = updateData.frequency;
    if (updateData.start_date !== undefined)
      dbData.start_on = updateData.start_date;
    if (updateData.end_date !== undefined) dbData.end_on = updateData.end_date;

    const { data, error } = await supabase
      .from('recurring_rules')
      .update(dbData)
      .eq('id', ruleId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as RecurringRule;
  }

  async remove(
    userId: string,
    ruleId: string,
    accessToken: string,
  ): Promise<RecurringRule> {
    const supabase = this.getAuthenticatedClient(accessToken);
    const { data, error } = await supabase
      .from('recurring_rules')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', ruleId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as RecurringRule;
  }
}
