import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from '../common/services/base.service';
import { Category } from '../common/types/entities';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService extends BaseService {
  constructor(configService: ConfigService) {
    super(configService);
  }

  async findAll(userId: string, accessToken: string): Promise<Category[]> {
    const supabase = this.getAuthenticatedClient(accessToken);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data as Category[];
  }

  async findOne(
    userId: string,
    categoryId: string,
    accessToken: string,
  ): Promise<Category> {
    const supabase = this.getAuthenticatedClient(accessToken);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .eq('user_id', userId)
      .is('deleted_at', null)
      .single();

    if (error) throw error;
    return data as Category;
  }

  async create(
    userId: string,
    createData: CreateCategoryDto,
    accessToken: string,
  ): Promise<Category> {
    const supabase = this.getAuthenticatedClient(accessToken);
    const { data, error } = await supabase
      .from('categories')
      .insert({ ...createData, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return data as Category;
  }

  async update(
    userId: string,
    categoryId: string,
    updateData: UpdateCategoryDto,
    accessToken: string,
  ): Promise<Category> {
    const supabase = this.getAuthenticatedClient(accessToken);
    const { data, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', categoryId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Category;
  }

  async remove(
    userId: string,
    categoryId: string,
    accessToken: string,
  ): Promise<Category> {
    const supabase = this.getAuthenticatedClient(accessToken);
    const { data, error } = await supabase
      .from('categories')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', categoryId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Category;
  }
}
