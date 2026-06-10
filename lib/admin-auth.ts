import { NextRequest } from 'next/server';

export const ADMIN_SESSION_KEY = 'cloudpeak-admin-pwd';

export type AdminAuthResult =
  | { ok: true }
  | { ok: false; reason: 'not_configured' | 'unauthorized' };

export function checkAdminAuth(request: NextRequest): AdminAuthResult {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return { ok: false, reason: 'not_configured' };
  }
  if (request.headers.get('x-admin-password') !== password) {
    return { ok: false, reason: 'unauthorized' };
  }
  return { ok: true };
}

export function isAdminAuthorized(request: NextRequest): boolean {
  return checkAdminAuth(request).ok;
}

export function adminAuthErrorMessage(result: Extract<AdminAuthResult, { ok: false }>): string {
  if (result.reason === 'not_configured') {
    return 'Admin password is not configured. Add ADMIN_PASSWORD to .env.local and restart the dev server.';
  }
  return 'Incorrect password. Check ADMIN_PASSWORD in your .env.local file.';
}
