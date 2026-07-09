import { promises as fs } from 'fs';
import path from 'path';
import { SEED_PRODUCTS } from './product-seed';
import { normalizeProduct, normalizeProductInput } from './product-utils';
import { getSupabase, isSupabaseConfigured } from './supabase';
import type { Product, ProductInput } from '../types/product';
import { withRetry } from './retry';
import { logger } from './logger';

const PRODUCTS_PATH = path.join(process.cwd(), 'data', 'products.json');

function handleSupabaseError(error: any): never {
  throw new Error(
    `Supabase error [code: ${error.code || 'unknown'}]: ${error.message || 'No message'}. Details: ${error.details || 'None'}. Hint: ${error.hint || 'None'}`
  );
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function generateId(): string {
  return `prod_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  is_new: boolean;
  in_stock: boolean;
  images: string[];
  colors: Product['colors'];
  description: string;
  details: string;
  sizes: string[];
  buy_link: string | null;
  size_prices?: Record<string, number>;
  created_at: string;
  updated_at: string;
};

function rowToProduct(row: ProductRow): Product {
  return normalizeProduct({
    id: row.id,
    slug: row.slug,
    name: row.name,
    price: Number(row.price),
    category: row.category,
    isNew: row.is_new,
    inStock: row.in_stock,
    images: row.images ?? [],
    colors: row.colors ?? [],
    description: row.description,
    details: row.details,
    sizes: row.sizes ?? [],
    buyLink: row.buy_link ?? undefined,
    sizePrices: row.size_prices ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

function productToRow(product: Product): ProductRow {
  const normalized = normalizeProduct(product);
  return {
    id: normalized.id,
    slug: normalized.slug,
    name: normalized.name,
    price: normalized.price,
    category: normalized.category,
    is_new: normalized.isNew,
    in_stock: normalized.inStock,
    images: normalized.images,
    colors: normalized.colors,
    description: normalized.description,
    details: normalized.details,
    sizes: normalized.sizes,
    buy_link: normalized.buyLink ?? null,
    size_prices: normalized.sizePrices ?? {},
    created_at: normalized.createdAt,
    updated_at: normalized.updatedAt,
  };
}

function inputToProduct(input: ProductInput, existing?: Product): Product {
  const normalized = normalizeProductInput(input);
  const now = new Date().toISOString();
  return normalizeProduct({
    id: existing?.id ?? generateId(),
    slug: normalized.slug?.trim() || slugify(normalized.name),
    name: normalized.name.trim(),
    price: normalized.price,
    category: normalized.category,
    isNew: normalized.isNew,
    inStock: normalized.inStock,
    images: normalized.images,
    colors: normalized.colors,
    description: normalized.description.trim(),
    details: normalized.details.trim(),
    sizes: normalized.sizes,
    buyLink: normalized.buyLink?.trim() || undefined,
    sizePrices: normalized.sizePrices ?? {},
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  });
}

// ─── File storage (local dev fallback) ───

async function readFileProducts(): Promise<Product[]> {
  try {
    const raw = await fs.readFile(PRODUCTS_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as Product[];
    if (parsed && parsed.length > 0) {
      const filtered = parsed.filter(p => !['1', '2', '3', '4', '5', '6', '7', '8'].includes(p.id));
      return filtered.map(normalizeProduct);
    }
  } catch {
    // Return empty array if file does not exist or fails to parse
  }
  return [];
}

async function writeFileProducts(products: Product[]): Promise<void> {
  try {
    await fs.mkdir(path.dirname(PRODUCTS_PATH), { recursive: true });
    await fs.writeFile(PRODUCTS_PATH, JSON.stringify(products.map(normalizeProduct), null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save products update to file:', e);
  }
}

// ─── Supabase storage (production / Vercel) ───

async function getAllProductsSupabase(): Promise<Product[]> {
  const supabase = getSupabase()!;
  
  // Clean up any seed products from Supabase database
  try {
    await supabase
      .from('products')
      .delete()
      .in('id', ['1', '2', '3', '4', '5', '6', '7', '8']);
  } catch (err) {
    logger.warn('Failed to clean up seed products from Supabase:', err);
  }

  const data = await withRetry(async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) handleSupabaseError(error);
    return data;
  });
  const products = (data as ProductRow[]).map(rowToProduct);
  return products.filter(p => !['1', '2', '3', '4', '5', '6', '7', '8'].includes(p.id));
}

async function getProductBySlugSupabase(slug: string): Promise<Product | null> {
  const supabase = getSupabase()!;
  const product = await withRetry(async () => {
    const { data: bySlug, error: slugErr } = await supabase.from('products').select('*').eq('slug', slug).maybeSingle();
    if (slugErr) handleSupabaseError(slugErr);
    if (bySlug) return rowToProduct(bySlug as ProductRow);
    const { data: byId, error } = await supabase.from('products').select('*').eq('id', slug).maybeSingle();
    if (error) handleSupabaseError(error);
    return byId ? rowToProduct(byId as ProductRow) : null;
  });
  if (product && ['1', '2', '3', '4', '5', '6', '7', '8'].includes(product.id)) {
    return null;
  }
  return product;
}

async function createProductSupabase(input: ProductInput): Promise<Product> {
  const supabase = getSupabase()!;
  const product = inputToProduct(input);
  const existing = await withRetry(async () => {
    const { data, error } = await supabase.from('products').select('slug').eq('slug', product.slug).maybeSingle();
    if (error) handleSupabaseError(error);
    return data;
  });
  if (existing) throw new Error('A product with this slug already exists.');

  await withRetry(async () => {
    const { error } = await supabase.from('products').insert(productToRow(product));
    if (error) handleSupabaseError(error);
  });
  return product;
}

async function updateProductSupabase(slug: string, input: ProductInput): Promise<Product | null> {
  const supabase = getSupabase()!;
  const existing = await getProductBySlugSupabase(slug);
  if (!existing) return null;

  const product = inputToProduct(input, existing);
  const duplicate = await withRetry(async () => {
    const { data, error } = await supabase
      .from('products')
      .select('id')
      .eq('slug', product.slug)
      .neq('id', existing.id)
      .maybeSingle();
    if (error) handleSupabaseError(error);
    return data;
  });
  if (duplicate) throw new Error('A product with this slug already exists.');

  await withRetry(async () => {
    const { error } = await supabase.from('products').update(productToRow(product)).eq('id', existing.id);
    if (error) handleSupabaseError(error);
  });
  return product;
}

async function deleteProductSupabase(slug: string): Promise<boolean> {
  const supabase = getSupabase()!;
  const existing = await getProductBySlugSupabase(slug);
  if (!existing) return false;
  await withRetry(async () => {
    const { error } = await supabase.from('products').delete().eq('id', existing.id);
    if (error) handleSupabaseError(error);
  });
  return true;
}

// ─── Public API ───

export function getStorageMode(): 'supabase' | 'file' {
  return isSupabaseConfigured() ? 'supabase' : 'file';
}

export async function getAllProducts(): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    try {
      return await getAllProductsSupabase();
    } catch (err) {
      logger.warn('Supabase error: getAllProducts failed. Falling back to local file storage.', err);
    }
  }
  return readFileProducts();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isSupabaseConfigured()) {
    try {
      return await getProductBySlugSupabase(slug);
    } catch (err) {
      logger.warn(`Supabase error: getProductBySlug failed for slug: ${slug}. Falling back to local file storage.`, err);
    }
  }
  const products = await readFileProducts();
  const found = products.find((p) => p.slug === slug || p.id === slug);
  return found ? normalizeProduct(found) : null;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  if (isSupabaseConfigured()) {
    try {
      const product = await createProductSupabase(input);
      logger.info(`Product created in Supabase: ${product.id} (${product.slug})`);
      return product;
    } catch (err) {
      logger.error('Supabase error: createProduct failed. Throwing error to avoid silent data inconsistency.', err);
      throw err;
    }
  }

  const products = await readFileProducts();
  const product = inputToProduct(input);
  if (products.some((p) => p.slug === product.slug)) {
    throw new Error('A product with this slug already exists.');
  }
  products.unshift(product);
  await writeFileProducts(products);
  logger.info(`Product created in local file: ${product.id} (${product.slug})`);
  return product;
}

export async function updateProduct(slug: string, input: ProductInput): Promise<Product | null> {
  if (isSupabaseConfigured()) {
    try {
      const product = await updateProductSupabase(slug, input);
      if (product) {
        logger.info(`Product updated in Supabase: ${product.id} (${product.slug})`);
      }
      return product;
    } catch (err) {
      logger.error(`Supabase error: updateProduct failed for slug: ${slug}. Throwing error to avoid silent data inconsistency.`, err);
      throw err;
    }
  }

  const products = await readFileProducts();
  const index = products.findIndex((p) => p.slug === slug || p.id === slug);
  if (index === -1) return null;

  const product = inputToProduct(input, products[index]);
  if (products.some((p) => p.slug === product.slug && p.id !== products[index].id)) {
    throw new Error('A product with this slug already exists.');
  }
  products[index] = product;
  await writeFileProducts(products);
  logger.info(`Product updated in local file: ${product.id} (${product.slug})`);
  return product;
}

export async function deleteProduct(slug: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const success = await deleteProductSupabase(slug);
      if (success) {
        logger.info(`Product deleted from Supabase: ${slug}`);
      }
      return success;
    } catch (err) {
      logger.error(`Supabase error: deleteProduct failed for slug: ${slug}. Throwing error to avoid silent data inconsistency.`, err);
      throw err;
    }
  }

  const products = await readFileProducts();
  const filtered = products.filter((p) => p.slug !== slug && p.id !== slug);
  if (filtered.length === products.length) return false;
  await writeFileProducts(filtered);
  logger.info(`Product deleted from local file: ${slug}`);
  return true;
}
