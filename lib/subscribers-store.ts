import { promises as fs } from 'fs';
import path from 'path';
import { getSupabase, isSupabaseConfigured } from './supabase';
import { logger } from './logger';
import { withRetry } from './retry';

const SUBSCRIBERS_PATH = path.join(process.cwd(), 'data', 'subscribers.json');

export type Subscriber = {
  email: string;
  subscribedAt: string;
};

async function readFileSubscribers(): Promise<Subscriber[]> {
  try {
    const raw = await fs.readFile(SUBSCRIBERS_PATH, 'utf-8');
    return JSON.parse(raw) as Subscriber[];
  } catch {
    try {
      await fs.mkdir(path.dirname(SUBSCRIBERS_PATH), { recursive: true });
      await fs.writeFile(SUBSCRIBERS_PATH, '[]', 'utf-8');
    } catch (e) {
      console.error('Failed to initialize subscribers JSON database:', e);
    }
    return [];
  }
}

async function writeFileSubscribers(subscribers: Subscriber[]): Promise<void> {
  try {
    await fs.mkdir(path.dirname(SUBSCRIBERS_PATH), { recursive: true });
    await fs.writeFile(SUBSCRIBERS_PATH, JSON.stringify(subscribers, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write subscribers to file:', e);
  }
}

export async function addSubscriber(email: string): Promise<{ success: boolean; duplicate: boolean }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) {
    throw new Error('Email is required.');
  }

  // 1. Supabase Storage Mode
  if (isSupabaseConfigured()) {
    const supabase = getSupabase()!;
    try {
      // First check if already exists
      const existing = await withRetry(async () => {
        const { data, error } = await supabase
          .from('subscribers')
          .select('email')
          .eq('email', cleanEmail)
          .maybeSingle();
        // Swallow error if table doesn't exist yet
        if (error && error.code !== 'P0001' && !error.message.includes('relation "subscribers" does not exist')) {
          throw error;
        }
        return data;
      });

      if (existing) {
        return { success: false, duplicate: true };
      }

      // Insert subscriber
      const result = await withRetry(async () => {
        const { error } = await supabase
          .from('subscribers')
          .insert({ email: cleanEmail, subscribed_at: new Date().toISOString() });
        return { error };
      });

      if (!result.error) {
        logger.info(`Newsletter subscriber saved to Supabase: ${cleanEmail}`);
        return { success: true, duplicate: false };
      }
      // If table doesn't exist, we fallback to file
      if (!result.error.message.includes('relation "subscribers" does not exist')) {
        throw new Error(result.error.message);
      }
    } catch (err) {
      logger.warn('Supabase subscribers table error. Falling back to local file storage.', err);
    }
  }

  // 2. File Fallback Storage Mode
  const subscribers = await readFileSubscribers();
  if (subscribers.some((s) => s.email === cleanEmail)) {
    return { success: false, duplicate: true };
  }

  subscribers.push({
    email: cleanEmail,
    subscribedAt: new Date().toISOString(),
  });
  await writeFileSubscribers(subscribers);

  logger.info(`Newsletter subscriber saved to local file: ${cleanEmail}`);
  return { success: true, duplicate: false };
}

export async function getAllSubscribers(): Promise<Subscriber[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabase()!;
    try {
      const data = await withRetry(async () => {
        const { data, error } = await supabase
          .from('subscribers')
          .select('*')
          .order('subscribed_at', { ascending: false });
        if (error) throw error;
        return data;
      });
      if (data) {
        return data.map((row: any) => ({
          email: row.email,
          subscribedAt: row.subscribed_at || row.created_at,
        }));
      }
    } catch (err) {
      logger.warn('Supabase get subscribers failed. Falling back to local file storage.', err);
    }
  }
  return readFileSubscribers();
}
