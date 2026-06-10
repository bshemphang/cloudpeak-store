import type { Product, ProductColor, ProductInput } from '../types/product';
import { IMAGE_FALLBACK } from './images';

export function normalizeProductInput(input: ProductInput): ProductInput {
  const colors =
    input.colors?.length > 0
      ? input.colors.map((c) => ({
          name: c.name.trim(),
          hex: c.hex || '#0A1628',
          images: c.images.map((i) => i.trim()).filter(Boolean),
        })).filter((c) => c.images.length > 0)
      : input.images?.length
        ? [{ name: 'Default', hex: '#0A1628', images: input.images.filter(Boolean) }]
        : [{ name: 'Default', hex: '#0A1628', images: [IMAGE_FALLBACK] }];

  const images = colors[0]?.images ?? input.images ?? [];

  return {
    ...input,
    colors,
    images,
    sizes: input.sizes.filter(Boolean),
  };
}

export function normalizeProduct(product: Product): Product {
  if (product.colors?.length > 0) {
    return {
      ...product,
      images: product.colors[0].images.length ? product.colors[0].images : product.images,
    };
  }
  const images = product.images?.length ? product.images : [IMAGE_FALLBACK];
  return {
    ...product,
    colors: [{ name: 'Default', hex: '#0A1628', images }],
    images,
  };
}

export function getColorImages(product: Product, colorIndex: number): string[] {
  const normalized = normalizeProduct(product);
  const color = normalized.colors[colorIndex] ?? normalized.colors[0];
  return color?.images?.length ? color.images : [IMAGE_FALLBACK];
}

export function getProductPrimaryImage(product: Product, colorIndex = 0): string {
  return getColorImages(product, colorIndex)[0] ?? IMAGE_FALLBACK;
}

export function getAllProductImages(product: Product): string[] {
  const normalized = normalizeProduct(product);
  return normalized.colors.flatMap((c) => c.images);
}

export function buildCartLineId(productId: string, size: string, color: string): string {
  return `${productId}::${size}::${color}`;
}

export function parseCartLineId(lineId: string): { productId: string; size: string; color: string } {
  const [productId, size, color] = lineId.split('::');
  return { productId, size: size ?? 'One Size', color: color ?? 'Default' };
}

export const EMPTY_COLOR: ProductColor = { name: '', hex: '#0A1628', images: [''] };
