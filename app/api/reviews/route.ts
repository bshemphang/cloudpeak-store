import { NextRequest, NextResponse } from 'next/server';
import { getReviewsForProduct, createReview, checkUserBoughtProduct } from '../../../lib/reviews-store';
import { getSupabase, isSupabaseConfigured } from '../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 });
    }
    const reviews = await getReviewsForProduct(productId);
    return NextResponse.json({ reviews });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    let email: string | null = null;
    let userId: string | null = null;

    const hasPublicAnon = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    if (isSupabaseConfigured() && (hasPublicAnon || authHeader?.startsWith('Bearer '))) {
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
      userId = user.id;
    } else {
      // Mock mode
      const { searchParams } = new URL(request.url);
      email = searchParams.get('email') || request.headers.get('x-mock-user-email');
      userId = searchParams.get('userId') || request.headers.get('x-mock-user-id') || 'mock-user-123';
    }

    if (!email || !userId) {
      return NextResponse.json({ error: 'Unauthorized user session details missing' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, rating, comment, userName, media = [] } = body;

    if (!productId || !rating || !userName) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Check purchase status
    const hasBought = await checkUserBoughtProduct(email, productId);
    if (!hasBought) {
      return NextResponse.json({ error: 'Only customers who bought this product can leave reviews.' }, { status: 403 });
    }

    const review = await createReview({
      productId,
      userId,
      userEmail: email,
      userName,
      rating: Number(rating),
      comment: comment ?? '',
      media,
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit review' }, { status: 500 });
  }
}
