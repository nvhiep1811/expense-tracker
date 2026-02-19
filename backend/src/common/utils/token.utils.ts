import type { Request } from 'express';

export function extractToken(request: Request): string {
  // 1. Try Authorization header first (for backward compatibility & reset-password)
  const headerToken = request.headers.authorization?.replace('Bearer ', '');
  if (headerToken) {
    return headerToken;
  }

  // 2. Try httpOnly cookie
  const cookieToken = request.cookies?.access_token;
  if (cookieToken) {
    return cookieToken;
  }

  throw new Error('Missing authorization token');
}
