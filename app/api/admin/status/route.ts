import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth, adminAuthErrorMessage } from '../../../../lib/admin-auth';
import { getStorageMode } from '../../../../lib/products-store';
import { isSupabaseConfigured } from '../../../../lib/supabase';

export async function GET(request: NextRequest) {
  const auth = checkAdminAuth(request);
  if (!auth.ok) {
    return NextResponse.json({ error: adminAuthErrorMessage(auth) }, { status: 401 });
  }

  return NextResponse.json({
    storageMode: getStorageMode(),
    supabaseConfigured: isSupabaseConfigured(),
    domain: 'cloudpeak.in',
  });
}
