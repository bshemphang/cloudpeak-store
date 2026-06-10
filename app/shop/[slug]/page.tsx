'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCart } from '../../../context/CartContext';
import SafeImage from '../../../components/SafeImage';
import MountainRidgeDivider from '../../../components/MountainRidgeDivider';
import { getProductPrimaryImage } from '../../../lib/product-utils';
import type { Product } from '../../../types/product';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.product) {
          setProduct(data.product);
          setSelectedSize(data.product.sizes[0] ?? 'One Size');
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      setError('Please select a size.');
      return;
    }
    setError('');
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: getProductPrimaryImage(product),
      size: selectedSize,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-storeWhite">
        <p className="text-midnightNavy/50 font-bold uppercase tracking-widest text-sm">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-storeWhite px-4 text-center gap-4">
        <h1 className="font-display text-3xl text-midnightNavy">Product Not Found</h1>
        <Link href="/shop" className="text-summitGoldDark font-bold uppercase text-sm tracking-widest hover:underline">
          Back to Shop
        </Link>
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : [getProductPrimaryImage(product)];
  const detailLines = product.details.split('\n').filter(Boolean);

  return (
    <div className="bg-storeWhite min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <nav className="text-xs font-bold uppercase tracking-widest text-midnightNavy/40 mb-8">
          <Link href="/" className="hover:text-summitGoldDark">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-summitGoldDark">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-midnightNavy">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] bg-cardGray overflow-hidden">
              <SafeImage
                src={images[selectedImage]}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
                priority
              />
              {product.isNew && (
                <span className="absolute top-4 left-4 bg-summitGold text-midnightNavy text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                  NEW
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-24 shrink-0 overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? 'border-summitGold' : 'border-borderGray hover:border-summitGold/50'
                    }`}
                  >
                    <SafeImage src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="lg:pt-4">
            <p className="text-xs font-bold uppercase tracking-widest text-summitGoldDark mb-2">{product.category}</p>
            <h1 className="font-display text-4xl md:text-5xl text-midnightNavy uppercase tracking-wide leading-tight mb-4">
              {product.name}
            </h1>
            <p className="text-2xl font-bold text-summitGoldDark mb-6">
              ₹{product.price.toLocaleString('en-IN')}
            </p>

            <p className="text-sm text-midnightNavy/75 leading-relaxed mb-8">{product.description}</p>

            {/* Size selector */}
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-midnightNavy/60 mb-3">
                Select Size — <span className="text-midnightNavy">{selectedSize}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => { setSelectedSize(size); setError(''); }}
                    className={`min-w-[3rem] px-4 py-3 text-xs font-bold uppercase tracking-wider border-2 transition-colors ${
                      selectedSize === size
                        ? 'border-midnightNavy bg-midnightNavy text-summitGold'
                        : 'border-borderGray text-midnightNavy hover:border-summitGold'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-red-600 font-medium mb-4">{error}</p>}

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-midnightNavy text-summitGold py-4 text-sm font-black uppercase tracking-widest hover:bg-midnightNavyLight transition-colors disabled:opacity-40"
              >
                {product.inStock ? 'Add to Cart' : 'Sold Out'}
              </button>
              {product.buyLink && (
                <a
                  href={product.buyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center border-2 border-midnightNavy text-midnightNavy py-4 text-sm font-black uppercase tracking-widest hover:bg-midnightNavy hover:text-summitGold transition-colors"
                >
                  Buy Link ↗
                </a>
              )}
            </div>

            {/* Details accordion */}
            {detailLines.length > 0 && (
              <div className="border-t border-borderGray pt-8">
                <h2 className="font-display text-xl text-midnightNavy uppercase tracking-wide mb-4">Details</h2>
                <ul className="space-y-2">
                  {detailLines.map((line) => (
                    <li key={line} className="text-sm text-midnightNavy/70 flex items-start gap-2">
                      <span className="text-summitGold mt-0.5">◆</span>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <MountainRidgeDivider />
    </div>
  );
}
