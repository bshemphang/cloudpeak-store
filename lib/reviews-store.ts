import { promises as fs } from 'fs';
import path from 'path';
import { getSupabase, isSupabaseConfigured } from './supabase';
import { getOrdersByEmail } from './orders-store';
import type { Review } from '../types/review';
import { withRetry } from './retry';
import { logger } from './logger';

const REVIEWS_PATH = path.join(process.cwd(), 'data', 'reviews.json');

type ReviewRow = {
  id: string;
  product_id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  rating: number;
  comment: string;
  media: string[];
  created_at: string;
};

function rowToReview(row: ReviewRow): Review {
  return {
    id: row.id,
    productId: row.product_id,
    userId: row.user_id,
    userEmail: row.user_email,
    userName: row.user_name,
    rating: row.rating,
    comment: row.comment,
    media: row.media ?? [],
    createdAt: row.created_at,
  };
}

export async function checkUserBoughtProduct(email: string, productId: string): Promise<boolean> {
  const orders = await getOrdersByEmail(email);
  return orders.some((order) => {
    const isPaid = order.status === 'prebook_paid' || order.status === 'confirmed';
    if (!isPaid) return false;
    return order.items.some((item) => {
      const parsedId = item.id.split('::')[0];
      return parsedId === productId || item.id === productId;
    });
  });
}

// Local File operations
async function readFileReviews(): Promise<Review[]> {
  try {
    const raw = await fs.readFile(REVIEWS_PATH, 'utf-8');
    return JSON.parse(raw) as Review[];
  } catch {
    try {
      await fs.mkdir(path.dirname(REVIEWS_PATH), { recursive: true });
      await fs.writeFile(REVIEWS_PATH, '[]', 'utf-8');
    } catch (e) {
      console.error('Failed to write reviews fallback file:', e);
    }
    return [];
  }
}

async function writeFileReviews(reviews: Review[]): Promise<void> {
  try {
    await fs.mkdir(path.dirname(REVIEWS_PATH), { recursive: true });
    await fs.writeFile(REVIEWS_PATH, JSON.stringify(reviews, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save reviews file:', e);
  }
}

// Public API
export async function getReviewsForProduct(productId: string): Promise<Review[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabase()!;
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as ReviewRow[]).map(rowToReview);
    } catch (err) {
      logger.warn(`Supabase getReviewsForProduct failed. Falling back to local file.`, err);
    }
  }
  const reviews = await readFileReviews();
  return reviews.filter((r) => r.productId === productId);
}

export async function createReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
  const newReview: Review = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `rev_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    ...review,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabase()!;
      const row: Omit<ReviewRow, 'created_at'> = {
        id: newReview.id,
        product_id: newReview.productId,
        user_id: newReview.userId,
        user_email: newReview.userEmail,
        user_name: newReview.userName,
        rating: newReview.rating,
        comment: newReview.comment,
        media: newReview.media,
      };
      const { error } = await supabase.from('reviews').insert(row);
      if (error) throw error;
      return newReview;
    } catch (err) {
      logger.error('Supabase createReview failed.', err);
      throw err;
    }
  }

  const reviews = await readFileReviews();
  reviews.unshift(newReview);
  await writeFileReviews(reviews);
  return newReview;
}
