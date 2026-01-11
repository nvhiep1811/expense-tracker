import type { Request } from 'express';

export function extractToken(request: Request): string {
  const token = request.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    throw new Error('Missing authorization token');
  }
  return token;
}
