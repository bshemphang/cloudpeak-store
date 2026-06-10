import Link from 'next/link';
import SafeImage from './SafeImage';
import { getProductPrimaryImage } from '../lib/product-utils';
import type { Product } from '../types/product';

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const image = getProductPrimaryImage(product);

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] bg-cardGray mb-4 overflow-hidden">
        <SafeImage
          src={image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {product.isNew && (
          <div className="absolute top-4 left-4 bg-summitGold text-midnightNavy text-[10px] font-bold uppercase tracking-widest px-3 py-1 z-10">
            NEW
          </div>
        )}
        {!product.inStock && (
          <div className="absolute top-4 right-4 bg-midnightNavy/90 text-storeWhite text-[10px] font-bold uppercase tracking-widest px-3 py-1 z-10">
            Sold Out
          </div>
        )}
        <div className="absolute inset-0 bg-midnightNavy/0 group-hover:bg-midnightNavy/20 transition-colors duration-300" />
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
          <span className="w-full block text-center bg-midnightNavy/95 backdrop-blur-sm text-summitGold py-3 text-xs font-bold uppercase tracking-widest">
            View Product
          </span>
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-sm font-bold text-midnightNavy mb-1 group-hover:text-summitGoldDark transition-colors">
          {product.name}
        </h3>
        <p className="text-[10px] text-midnightNavy/50 font-bold uppercase tracking-widest mb-2">
          {product.category}
        </p>
        <p className="text-sm text-summitGoldDark font-bold">₹{product.price.toLocaleString('en-IN')}</p>
      </div>
    </Link>
  );
}
