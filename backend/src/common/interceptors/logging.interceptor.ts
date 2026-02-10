import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

/**
 * Logging Interceptor - logs request duration and response status
 * Useful for performance monitoring and debugging
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { method, url } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;

          // Log with color coding based on duration
          if (duration > 1000) {
            this.logger.warn(
              `${method} ${url} ${statusCode} - ${duration}ms [SLOW]`,
            );
          } else if (duration > 500) {
            this.logger.log(
              `${method} ${url} ${statusCode} - ${duration}ms [MODERATE]`,
            );
          } else {
            this.logger.log(`${method} ${url} ${statusCode} - ${duration}ms`);
          }
        },
        error: (error: Error & { status?: number }) => {
          const duration = Date.now() - startTime;
          const statusCode = error.status || 500;
          this.logger.error(
            `${method} ${url} ${statusCode} - ${duration}ms - ${error.message}`,
          );
        },
      }),
    );
  }
}
