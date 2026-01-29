import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from '../common/services/base.service';
import { Alert } from '../common/types/entities';

@Injectable()
export class AlertsService extends BaseService {
  constructor(configService: ConfigService) {
    super(configService);
  }

  async findAll(
    userId: string,
    isRead: boolean | undefined,
    accessToken: string,
  ): Promise<Alert[]> {
    const supabase = this.getAuthenticatedClient(accessToken);
    let query = supabase
      .from('alerts')
      .select('*')
      .eq('user_id', userId)
      .order('occurred_at', { ascending: false });

    if (isRead !== undefined) {
      query = query.eq('is_read', isRead);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as Alert[];
  }

  async markAsRead(
    userId: string,
    alertId: string,
    accessToken: string,
  ): Promise<Alert> {
    const supabase = this.getAuthenticatedClient(accessToken);
    const { data, error } = await supabase
      .from('alerts')
      .update({ is_read: true })
      .eq('id', alertId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Alert;
  }

  async markAllAsRead(userId: string, accessToken: string): Promise<void> {
    const supabase = this.getAuthenticatedClient(accessToken);
    const { error } = await supabase
      .from('alerts')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
  }

  async remove(
    userId: string,
    alertId: string,
    accessToken: string,
  ): Promise<void> {
    const supabase = this.getAuthenticatedClient(accessToken);
    const { error } = await supabase
      .from('alerts')
      .delete()
      .eq('id', alertId)
      .eq('user_id', userId);

    if (error) throw error;
  }
}
