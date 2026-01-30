import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from '../common/services/base.service';
import { Transaction } from '../common/types/entities';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionFiltersDto,
} from './dto/transaction.dto';
import { PaginatedResponse } from '../common/dto/pagination.dto';

@Injectable()
export class TransactionsService extends BaseService {
  constructor(configService: ConfigService) {
    super(configService);
  }

  async findAll(
    userId: string,
    accessToken: string,
    filters?: TransactionFiltersDto,
  ): Promise<PaginatedResponse<Transaction>> {
    const supabase = this.getAuthenticatedClient(accessToken);

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('transactions')
      .select(
        'id, user_id, type, amount, occurred_on, account_id, category_id, description, note, tags, attachments, transfer_account_id, recurring_rule_id, created_at, updated_at, deleted_at',
        { count: 'exact' },
      )
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('occurred_on', { ascending: false })
      .order('created_at', { ascending: false });

    // Apply filters if provided
    if (filters?.type) query = query.eq('type', filters.type);
    if (filters?.account_id) query = query.eq('account_id', filters.account_id);
    if (filters?.category_id)
      query = query.eq('category_id', filters.category_id);
    if (filters?.start_date)
      query = query.gte('occurred_on', filters.start_date);
    if (filters?.end_date) query = query.lte('occurred_on', filters.end_date);

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: data as Transaction[],
      meta: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  }

  async findOne(
    userId: string,
    transactionId: string,
    accessToken: string,
  ): Promise<Transaction> {
    const supabase = this.getAuthenticatedClient(accessToken);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .eq('user_id', userId)
      .is('deleted_at', null)
      .single();

    if (error) throw error;
    return data as Transaction;
  }

  async create(
    userId: string,
    createData: CreateTransactionDto,
    accessToken: string,
  ): Promise<Transaction> {
    const supabase = this.getAuthenticatedClient(accessToken);
    const { data, error } = await supabase
      .from('transactions')
      .insert({ ...createData, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return data as Transaction;
  }

  async update(
    userId: string,
    transactionId: string,
    updateData: UpdateTransactionDto,
    accessToken: string,
  ): Promise<Transaction> {
    const supabase = this.getAuthenticatedClient(accessToken);
    const { data, error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', transactionId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Transaction;
  }

  async remove(
    userId: string,
    transactionId: string,
    accessToken: string,
  ): Promise<Transaction> {
    const supabase = this.getAuthenticatedClient(accessToken);
    const { data, error } = await supabase
      .from('transactions')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', transactionId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Transaction;
  }
}
