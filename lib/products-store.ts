import { promises as fs } from 'fs';
import path from 'path';
import { SEED_PRODUCTS } from './product-seed';
import type { Product, ProductInput } from '../types/product';

const PRODUCTS_PATH = path.join(process.cwd(), 'data', 'products.json');

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

async function readProducts(): Promise<Product[]> {
  try {
    const raw = await fs.readFile(PRODUCTS_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as Product[];
    if (parsed.length > 0) return parsed;
  } catch {
    // file missing or empty — seed below
  }

  const seeded = SEED_PRODUCTS as Product[];
  await fs.mkdir(path.dirname(PRODUCTS_PATH), { recursive: true });
  await fs.writeFile(PRODUCTS_PATH, JSON.stringify(seeded, null, 2), 'utf-8');
  return seeded;
}

async function writeProducts(products: Product[]): Promise<void> {
  await fs.mkdir(path.dirname(PRODUCTS_PATH), { recursive: true });
  await fs.writeFile(PRODUCTS_PATH, JSON.stringify(products, null, 2), 'utf-8');
}

export async function getAllProducts(): Promise<Product[]> {
  return readProducts();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await readProducts();
  return products.find((p) => p.slug === slug || p.id === slug) ?? null;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const products = await readProducts();
  const slug = input.slug?.trim() || slugify(input.name);
  if (products.some((p) => p.slug === slug)) {
    throw new Error('A product with this slug already exists.');
  }

  const now = new Date().toISOString();
  const product: Product = {
    id: generateId(),
    slug,
    name: input.name.trim(),
    price: input.price,
    category: input.category,
    isNew: input.isNew,
    inStock: input.inStock,
    images: input.images.filter(Boolean),
    description: input.description.trim(),
    details: input.details.trim(),
    sizes: input.sizes.filter(Boolean),
    buyLink: input.buyLink?.trim() || undefined,
    createdAt: now,
    updatedAt: now,
  };

  products.unshift(product);
  await writeProducts(products);
  return product;
}

export async function updateProduct(slug: string, input: ProductInput): Promise<Product | null> {
  const products = await readProducts();
  const index = products.findIndex((p) => p.slug === slug || p.id === slug);
  if (index === -1) return null;

  const nextSlug = input.slug?.trim() || slugify(input.name);
  const duplicate = products.find((p) => p.slug === nextSlug && p.id !== products[index].id);
  if (duplicate) throw new Error('A product with this slug already exists.');

  const updated: Product = {
    ...products[index],
    slug: nextSlug,
    name: input.name.trim(),
    price: input.price,
    category: input.category,
    isNew: input.isNew,
    inStock: input.inStock,
    images: input.images.filter(Boolean),
    description: input.description.trim(),
    details: input.details.trim(),
    sizes: input.sizes.filter(Boolean),
    buyLink: input.buyLink?.trim() || undefined,
    updatedAt: new Date().toISOString(),
  };

  products[index] = updated;
  await writeProducts(products);
  return updated;
}

export async function deleteProduct(slug: string): Promise<boolean> {
  const products = await readProducts();
  const filtered = products.filter((p) => p.slug !== slug && p.id !== slug);
  if (filtered.length === products.length) return false;
  await writeProducts(filtered);
  return true;
}
