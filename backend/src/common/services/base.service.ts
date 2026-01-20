import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export abstract class BaseService {
  protected supabaseUrl: string;
  protected supabaseKey: string;
  protected supabaseServiceRoleKey: string;

  constructor(protected configService: ConfigService) {
    this.supabaseUrl = this.configService.get<string>('SUPABASE_URL')!;
    this.supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY')!;
    this.supabaseServiceRoleKey = this.configService.get<string>(
      'SUPABASE_SERVICE_ROLE_KEY',
    )!;

    if (!this.supabaseUrl || !this.supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }
  }

  protected getAuthenticatedClient(accessToken: string): SupabaseClient {
    return createClient(this.supabaseUrl, this.supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    }) as SupabaseClient;
  }

  protected getAdminClient(): SupabaseClient {
    if (!this.supabaseServiceRoleKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');
    }
    return createClient(this.supabaseUrl, this.supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }) as SupabaseClient;
  }
}
