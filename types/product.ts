export const PRODUCT_CATEGORIES = [
  'Footwear',
  'Streetwear',
  'POD Exclusives',
  'Accessories',
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  isNew: boolean;
  inStock: boolean;
  images: string[];
  description: string;
  details: string;
  sizes: string[];
  buyLink?: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductInput = Omit<Product, 'id' | 'slug' | 'createdAt' | 'updatedAt'> & {
  slug?: string;
};
