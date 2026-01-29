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
    const { data, error } = await supabase
      .from('recurring_rules')
      .insert({ ...createData, user_id: userId })
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
    const { data, error } = await supabase
      .from('recurring_rules')
      .update(updateData)
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
