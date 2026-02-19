import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export abstract class BaseService {
  protected supabaseUrl: string;
  protected supabaseKey: string;
  protected supabaseServiceRoleKey: string;

  /** Singleton admin client — reused across all calls since credentials never change */
  private _adminClient: SupabaseClient | null = null;

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

  /**
   * Creates a per-request Supabase client scoped to the caller's JWT.
   * A new instance is required for each token so that Supabase RLS policies
   * see the correct `auth.uid()` — sharing a single client across users is
   * not safe.
   */
  protected getAuthenticatedClient(accessToken: string): SupabaseClient {
    return createClient(this.supabaseUrl, this.supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }) as SupabaseClient;
  }

  /**
   * Returns a singleton service-role Supabase client.
   * Safe to cache because the service-role key never changes at runtime and
   * the admin client is not user-scoped.
   */
  protected getAdminClient(): SupabaseClient {
    if (!this.supabaseServiceRoleKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');
    }
    if (!this._adminClient) {
      this._adminClient = createClient(
        this.supabaseUrl,
        this.supabaseServiceRoleKey,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        },
      ) as SupabaseClient;
    }
    return this._adminClient;
  }
}
