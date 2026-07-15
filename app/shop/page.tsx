import { Metadata } from 'next';
import { getAllProducts } from '../../lib/products-store';
import ShopClient from './ShopClient';

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: 'Shop All Drops | Cloudpeak',
  description: 'Explore the full Cloudpeak collection. Shop exclusive hoodies, t-shirts, sweatshirts, pants, and footwear.',
  keywords: ['Cloudpeak catalog', 'streetwear drops', 'streetwear hoodies', 'buy sneakers India', 'India fashion'],
  alternates: {
    canonical: 'https://cloudpeak.in/shop',
  },
};

export default async function Shop() {
  const products = await getAllProducts();

  return <ShopClient initialProducts={products} />;
}
