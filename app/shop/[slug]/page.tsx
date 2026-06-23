import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '../../../lib/products-store';
import { getProductPrimaryImage, normalizeProduct } from '../../../lib/product-utils';
import ProductDetailClient from './ProductDetailClient';

export const revalidate = 3600; // ISR cache for 1 hour

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const rawProduct = await getProductBySlug(slug);

  if (!rawProduct) {
    return {
      title: 'Product Not Found | Cloudpeak',
    };
  }

  const product = normalizeProduct(rawProduct);
  const primaryImg = getProductPrimaryImage(product, 0);

  return {
    title: `${product.name} | Cloudpeak`,
    description: product.description,
    keywords: [product.name, product.category, 'streetwear', 'Shillong', 'Cloudpeak'],
    alternates: {
      canonical: `https://cloudpeak.in/shop/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | Cloudpeak`,
      description: product.description,
      url: `https://cloudpeak.in/shop/${product.slug}`,
      images: [
        {
          url: primaryImg,
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Cloudpeak`,
      description: product.description,
      images: [primaryImg],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const rawProduct = await getProductBySlug(slug);

  if (!rawProduct) {
    notFound();
  }

  const product = normalizeProduct(rawProduct);
  const primaryImg = getProductPrimaryImage(product, 0);
  const images = product.images && product.images.length > 0 ? product.images : [primaryImg];

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": images,
    "description": product.description,
    "sku": product.id,
    "offers": {
      "@type": "Offer",
      "url": `https://cloudpeak.in/shop/${product.slug}`,
      "priceCurrency": "INR",
      "price": product.price,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Cloudpeak"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductDetailClient product={product} />
    </>
  );
}
