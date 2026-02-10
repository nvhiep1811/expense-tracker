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

  /**
   * Get all categories for a user (system categories + user's custom categories)
   * System categories have user_id = NULL and are shared across all users
   */
  async findAll(userId: string, accessToken: string): Promise<Category[]> {
    const supabase = this.getAuthenticatedClient(accessToken);

    // Query both system categories (user_id is null) and user's custom categories
    const { data, error } = await supabase
      .from('categories')
      .select(
        'id, user_id, name, side, icon, color, sort_order, is_system, created_at, updated_at, deleted_at',
      )
      .or(`user_id.is.null,user_id.eq.${userId}`)
      .is('deleted_at', null)
      .order('is_system', { ascending: false }) // System categories first
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data as Category[];
  }

  /**
   * Get a single category by ID
   * User can view their own categories or system categories
   */
  async findOne(
    userId: string,
    categoryId: string,
    accessToken: string,
  ): Promise<Category> {
    const supabase = this.getAuthenticatedClient(accessToken);
    const { data, error } = await supabase
      .from('categories')
      .select(
        'id, user_id, name, side, icon, color, sort_order, is_system, created_at, updated_at, deleted_at',
      )
      .eq('id', categoryId)
      .or(`user_id.is.null,user_id.eq.${userId}`)
      .is('deleted_at', null)
      .single();

    if (error) throw error;
    return data as Category;
  }

  /**
   * Create a new custom category for the user
   * is_system will be set to false automatically
   */
  async create(
    userId: string,
    createData: CreateCategoryDto,
    accessToken: string,
  ): Promise<Category> {
    const supabase = this.getAuthenticatedClient(accessToken);
    const { data, error } = await supabase
      .from('categories')
      .insert({ ...createData, user_id: userId, is_system: false })
      .select()
      .single();

    if (error) throw error;
    return data as Category;
  }

  /**
   * Update a user's custom category
   * System categories cannot be modified by users
   */
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

  /**
   * Soft delete a user's custom category
   * System categories cannot be deleted by users
   */
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
