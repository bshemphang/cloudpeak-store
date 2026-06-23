import { MetadataRoute } from 'next';
import { getAllProducts } from '../lib/products-store';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cloudpeak.in';

  // 1. Static Routes
  const staticRoutes = [
    '',
    '/shop',
    '/about',
    '/contact',
    '/privacy-policy',
    '/return-policy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : route === '/shop' ? 0.9 : 0.7,
  }));

  // 2. Dynamic Product Routes
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await getAllProducts();
    productRoutes = products.map((product) => ({
      url: `${baseUrl}/shop/${product.slug}`,
      lastModified: new Date(product.updatedAt || product.createdAt || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Sitemap product fetch failed, generating static entries only:', error);
  }

  return [...staticRoutes, ...productRoutes];
}
