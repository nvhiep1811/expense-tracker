import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Request } from 'express';
import { createHash } from 'crypto';
import type { JwtPayload } from '@supabase/auth-js';
import type { User } from '../types/entities';

interface AuthenticatedRequest extends Request {
  user?: User;
  accessToken?: string;
}

interface CachedAuthEntry {
  user: User;
  expiresAt: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  private supabase: SupabaseClient;
  private readonly claimsCache = new Map<string, CachedAuthEntry>();
  private readonly cacheTtlMs: number;
  private readonly cacheMaxEntries: number;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    this.cacheTtlMs =
      this.configService.get<number>('AUTH_CLAIMS_CACHE_TTL_MS') ?? 15000;
    this.cacheMaxEntries =
      this.configService.get<number>('AUTH_CLAIMS_CACHE_MAX') ?? 5000;

    this.supabase = createClient(supabaseUrl, supabaseKey) as SupabaseClient;
  }

  private getTokenHash(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private getCachedUser(token: string): User | null {
    const key = this.getTokenHash(token);
    const cached = this.claimsCache.get(key);

    if (!cached) {
      return null;
    }

    if (cached.expiresAt <= Date.now()) {
      this.claimsCache.delete(key);
      return null;
    }

    return cached.user;
  }

  private setCachedUser(token: string, user: User, expClaim?: number): void {
    const key = this.getTokenHash(token);
    const now = Date.now();
    const expMs =
      typeof expClaim === 'number' ? expClaim * 1000 : now + this.cacheTtlMs;
    const expiresAt = Math.min(expMs, now + this.cacheTtlMs);

    if (this.claimsCache.size >= this.cacheMaxEntries) {
      const oldestKey = this.claimsCache.keys().next().value;
      if (oldestKey) {
        this.claimsCache.delete(oldestKey);
      }
    }

    this.claimsCache.set(key, { user, expiresAt });
  }

  private claimsToUser(claims: JwtPayload): User {
    const id = typeof claims.sub === 'string' ? claims.sub : '';
    const email = typeof claims.email === 'string' ? claims.email : '';

    if (!id) {
      throw new UnauthorizedException('Invalid token claims');
    }

    return {
      id,
      email,
      ...claims,
    } as User;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    // Try to get token from Authorization header first (for backward compatibility)
    let token = request.headers.authorization?.replace('Bearer ', '');

    // If no Authorization header, try to get from httpOnly cookie
    if (!token && request.cookies?.access_token) {
      token = request.cookies.access_token;
    }

    if (!token) {
      throw new UnauthorizedException('Missing authentication token');
    }

    try {
      const cachedUser = this.getCachedUser(token);
      if (cachedUser) {
        request.user = cachedUser;
        request.accessToken = token;
        return true;
      }

      const {
        data,
        error,
      } = await this.supabase.auth.getClaims(token);

      const claims = data?.claims;

      if (error || !claims) {
        throw new UnauthorizedException('Invalid token');
      }

      const user = this.claimsToUser(claims);
      this.setCachedUser(token, user, claims.exp);

      request.user = user;
      request.accessToken = token;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
