import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Simple in-memory cache interceptor for GET requests
 * Cache TTL: 5 minutes
 * Use for: categories, profiles, accounts (data that doesn't change frequently)
 */
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user } = request;

    // Only cache GET requests
    if (method !== 'GET') {
      return next.handle();
    }

    // Create cache key with user ID for security
    const cacheKey = `${user?.id}:${url}`;

    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.TTL) {
      return of(cached.data);
    }

    // Not in cache or expired, execute request
    return next.handle().pipe(
      tap((data) => {
        // Store in cache
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
        });

        // Cleanup old cache entries (simple LRU)
        if (this.cache.size > 1000) {
          const firstKey = this.cache.keys().next().value;
          this.cache.delete(firstKey);
        }
      }),
    );
  }

  // Method to clear cache for specific user (call after updates)
  clearUserCache(userId: string): void {
    const keysToDelete: string[] = [];
    this.cache.forEach((_, key) => {
      if (key.startsWith(`${userId}:`)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => this.cache.delete(key));
  }

  // Clear all cache
  clearAll(): void {
    this.cache.clear();
  }
}
