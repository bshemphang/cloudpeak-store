import type { Product } from '../types/product';
import { IMAGE_FALLBACK } from './images';

export function getProductPrimaryImage(product: Product): string {
  return product.images[0] ?? IMAGE_FALLBACK;
}

export function buildCartLineId(productId: string, size: string): string {
  return `${productId}::${size}`;
}

export function parseCartLineId(lineId: string): { productId: string; size: string } {
  const [productId, size] = lineId.split('::');
  return { productId, size: size ?? 'One Size' };
}
