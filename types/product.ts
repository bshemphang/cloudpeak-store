export const PRODUCT_CATEGORIES = [
  'Men',
  'Women',
  'Kids',
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export type ProductColor = {
  name: string;
  hex: string;
  images: string[];
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  isNew: boolean;
  inStock: boolean;
  images: string[];
  colors: ProductColor[];
  description: string;
  details: string;
  sizes: string[];
  buyLink?: string;
  sizePrices?: Record<string, number>;
  createdAt: string;
  updatedAt: string;
};

export type ProductInput = Omit<Product, 'id' | 'slug' | 'createdAt' | 'updatedAt'> & {
  slug?: string;
};
