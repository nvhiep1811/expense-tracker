import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import type { Request, Response, NextFunction } from 'express';
import { randomBytes, timingSafeEqual } from 'crypto';

function buildCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: false,
    secure: isProduction,
    sameSite: isProduction ? ('none' as const) : ('lax' as const),
    path: '/',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  };
}

function getCsrfCookieToken(request: Request): string | undefined {
  return request.cookies?.csrf_token as string | undefined;
}

function getCsrfHeaderToken(request: Request): string | undefined {
  const rawHeader = request.headers['x-csrf-token'];
  if (Array.isArray(rawHeader)) {
    return rawHeader[0];
  }
  return rawHeader;
}

function tokensMatch(cookieToken: string, headerToken: string): boolean {
  const cookieBuf = Buffer.from(cookieToken);
  const headerBuf = Buffer.from(headerToken);
  if (cookieBuf.length !== headerBuf.length) {
    return false;
  }
  return timingSafeEqual(cookieBuf, headerBuf);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cookie parser for httpOnly cookie support
  app.use(cookieParser());

  // Security headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  // Response compression
  app.use(compression());

  // Enable CORS with credentials for httpOnly cookies
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // CSRF protection for cookie-authenticated state-changing requests.
  app.use((request: Request, response: Response, next: NextFunction) => {
    const method = request.method.toUpperCase();
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      return next();
    }

    const path = request.path;
    const csrfExemptPaths = [
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/check-email',
      '/api/auth/forgot-password',
      '/api/auth/reset-password',
      '/api/auth/oauth',
    ];
    if (csrfExemptPaths.some((exemptPath) => path.startsWith(exemptPath))) {
      return next();
    }

    const hasSessionCookie = Boolean(
      request.cookies?.access_token || request.cookies?.refresh_token,
    );
    if (!hasSessionCookie) {
      return next();
    }

    const csrfCookieToken = getCsrfCookieToken(request);
    if (!csrfCookieToken) {
      // Backward-compatible bootstrap for existing sessions created before CSRF rollout.
      response.cookie(
        'csrf_token',
        randomBytes(32).toString('hex'),
        buildCookieOptions(),
      );
      return next();
    }

    const csrfHeaderToken = getCsrfHeaderToken(request);
    if (!csrfHeaderToken || !tokensMatch(csrfCookieToken, csrfHeaderToken)) {
      return response.status(403).json({
        statusCode: 403,
        message: 'Invalid CSRF token',
        timestamp: new Date().toISOString(),
      });
    }

    return next();
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global logging interceptor for request timing
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Global prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`Application is running on port: ${port}`);
}
bootstrap();
