import { Metadata } from 'next';
import { getAllProducts } from '../../lib/products-store';
import ShopClient from './ShopClient';

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: 'Shop All Drops | Cloudpeak',
  description: 'Explore the full Cloudpeak collection. Shop exclusive hoodies, accessories, hats, and footwear born in Shillong and curated for the culture.',
  keywords: ['Cloudpeak catalog', 'streetwear drops', 'custom streetwear hoodies', 'buy sneakers India', 'Shillong fashion'],
  alternates: {
    canonical: 'https://cloudpeak.in/shop',
  },
};

export default async function Shop() {
  const products = await getAllProducts();

  return <ShopClient initialProducts={products} />;
}
