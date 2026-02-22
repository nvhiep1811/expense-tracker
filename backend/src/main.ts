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

function setCsrfResponseHeader(response: Response, token: string): void {
  response.setHeader('X-CSRF-Token', token);
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
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-CSRF-Token',
      'Cache-Control',
      'Pragma',
      'Expires',
    ],
    exposedHeaders: ['X-CSRF-Token'],
  });

  // CSRF protection for cookie-authenticated state-changing requests.
  app.use((request: Request, response: Response, next: NextFunction) => {
    const hasSessionCookie = Boolean(
      request.cookies?.access_token || request.cookies?.refresh_token,
    );

    let csrfCookieToken = getCsrfCookieToken(request);
    if (hasSessionCookie && !csrfCookieToken) {
      // Initialize CSRF token for pre-existing sessions created before rollout.
      csrfCookieToken = randomBytes(32).toString('hex');
      response.cookie('csrf_token', csrfCookieToken, buildCookieOptions());
    }

    if (hasSessionCookie && csrfCookieToken) {
      setCsrfResponseHeader(response, csrfCookieToken);
    }

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

    if (!hasSessionCookie) {
      return next();
    }

    if (!csrfCookieToken) {
      return response.status(403).json({
        statusCode: 403,
        message: 'Missing CSRF token',
        timestamp: new Date().toISOString(),
      });
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
