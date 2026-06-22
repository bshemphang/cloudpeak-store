import { NextRequest, NextResponse } from 'next/server';
import { getOrdersByEmail } from '../../../../lib/orders-store';
import { getSupabase, isSupabaseConfigured } from '../../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    let email: string | null = null;

    const isProd = process.env.NODE_ENV === 'production';
    const hasPublicAnon = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    // If Supabase is fully configured client-side or we are in production, enforce secure JWT verification
    if (isSupabaseConfigured() && (hasPublicAnon || isProd || authHeader?.startsWith('Bearer '))) {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
      }

      const token = authHeader.substring(7);
      const supabase = getSupabase()!;
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
      }
      email = user.email ?? null;
    } else {
      // In local development / mock mode, check query param or header
      const { searchParams } = new URL(request.url);
      email = searchParams.get('email') || request.headers.get('x-mock-user-email');
    }

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const orders = await getOrdersByEmail(email);
    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch orders' }, { status: 500 });
  }
}
