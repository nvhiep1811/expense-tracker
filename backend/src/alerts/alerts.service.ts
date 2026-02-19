import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from '../common/services/base.service';
import { Alert } from '../common/types/entities';

export interface AlertWithDetails extends Alert {
  budget?: {
    id: string;
    limit_amount: number;
    period: string;
    start_date: string;
    end_date: string;
  };
  category?: {
    id: string;
    name: string;
    icon?: string;
    color?: string;
  };
}

export interface UnreadCount {
  count: number;
}

@Injectable()
export class AlertsService extends BaseService {
  constructor(configService: ConfigService) {
    super(configService);
  }

  async findAll(
    userId: string,
    isRead: boolean | undefined,
    accessToken: string,
    limit?: number,
    includeDismissed = false,
  ): Promise<AlertWithDetails[]> {
    const supabase = this.getAuthenticatedClient(accessToken);
    let query = supabase
      .from('alerts')
      .select(
        `
        *,
        budget:budgets(id, limit_amount, period, start_date, end_date),
        category:categories(id, name, icon, color)
      `,
      )
      .eq('user_id', userId)
      .order('occurred_at', { ascending: false });

    // Filter out dismissed alerts by default
    if (!includeDismissed) {
      query = query.is('dismissed_at', null);
    }

    if (isRead !== undefined) {
      query = query.eq('is_read', isRead);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as AlertWithDetails[];
  }

  async getUnreadCount(userId: string, accessToken: string): Promise<number> {
    const supabase = this.getAuthenticatedClient(accessToken);
    const { count, error } = await supabase
      .from('alerts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false)
      .is('dismissed_at', null);

    if (error) throw error;
    return count || 0;
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
      .eq('is_read', false)
      .is('dismissed_at', null); // Don't touch dismissed alerts

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

  async removeAll(userId: string, accessToken: string): Promise<void> {
    const supabase = this.getAuthenticatedClient(accessToken);
    // Only hard-delete alerts that have already been dismissed.
    // Active (non-dismissed) alerts must be dismissed first via dismissAll().
    const { error } = await supabase
      .from('alerts')
      .delete()
      .eq('user_id', userId)
      .not('dismissed_at', 'is', null);

    if (error) throw error;
  }

  async dismiss(
    userId: string,
    alertId: string,
    accessToken: string,
  ): Promise<Alert> {
    const supabase = this.getAuthenticatedClient(accessToken);
    const { data, error } = await supabase
      .from('alerts')
      .update({ dismissed_at: new Date().toISOString() })
      .eq('id', alertId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Alert;
  }

  async dismissAll(userId: string, accessToken: string): Promise<void> {
    const supabase = this.getAuthenticatedClient(accessToken);
    const { error } = await supabase
      .from('alerts')
      .update({ dismissed_at: new Date().toISOString() })
      .eq('user_id', userId)
      .is('dismissed_at', null);

    if (error) throw error;
  }

  /**
   * Check and create budget alerts for a user
   * This should be called after a transaction is created/updated
   */
  async checkAndCreateBudgetAlerts(
    userId: string,
    accessToken: string,
  ): Promise<void> {
    const supabase = this.getAuthenticatedClient(accessToken);

    // Get current budget status from view
    const { data: budgetStatuses, error: budgetError } = await supabase
      .from('v_budget_status')
      .select('*')
      .eq('user_id', userId);

    if (budgetError) throw budgetError;

    for (const status of budgetStatuses || []) {
      const percentage = status.percentage || 0;
      const threshold = status.alert_threshold_pct || 80;

      // Determine alert type
      let alertType: 'budget_near_limit' | 'budget_over_limit' | null = null;
      if (percentage >= 100) {
        alertType = 'budget_over_limit';
      } else if (percentage >= threshold) {
        alertType = 'budget_near_limit';
      }

      if (!alertType) continue;

      // Check if we already have a similar unread alert for this budget today
      const today = new Date().toISOString().split('T')[0];
      const { data: existingAlerts, error: alertError } = await supabase
        .from('alerts')
        .select('id')
        .eq('user_id', userId)
        .eq('budget_id', status.budget_id)
        .eq('type', alertType)
        .gte('occurred_at', today);

      if (alertError) throw alertError;

      // Only create alert if no similar alert exists today
      if (!existingAlerts || existingAlerts.length === 0) {
        const payload = {
          budget_id: status.budget_id,
          category_id: status.category_id,
          category_name: status.category_name,
          spent: status.spent,
          limit_amount: status.limit_amount,
          percentage: percentage,
          remaining: status.remaining,
          period: status.period,
        };

        const { error: insertError } = await supabase.from('alerts').insert({
          user_id: userId,
          type: alertType,
          budget_id: status.budget_id,
          category_id: status.category_id,
          payload,
          is_read: false,
          occurred_at: new Date().toISOString(),
        });

        if (insertError) throw insertError;
      }
    }
  }
}
