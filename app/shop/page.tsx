'use client';

import { useState } from 'react';
import ProductCard from '../../components/ProductCard';
import MountainRidgeDivider from '../../components/MountainRidgeDivider';
import ScrollReveal from '../../components/ScrollReveal';
import { useProducts } from '../../hooks/useProducts';
import { PRODUCT_CATEGORIES } from '../../types/product';

export default function Shop() {
  const { products, loading } = useProducts();
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...PRODUCT_CATEGORIES];

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-storeWhite min-h-screen pb-24">
      <section className="bg-midnightNavy py-16 md:py-20 text-center px-4">
        <h1 className="font-display text-5xl md:text-8xl text-summitGold uppercase tracking-wide mb-4">The Collection</h1>
        <p className="text-storeWhite/60 text-sm font-medium tracking-widest uppercase max-w-2xl mx-auto">
          Curated dropshipping lifestyle pieces and premium POD drops.
        </p>
      </section>

      <MountainRidgeDivider />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 md:mt-12">
        <ScrollReveal>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12 md:mb-16 border-b border-borderGray pb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`text-xs font-bold tracking-widest uppercase transition-colors ${
                  activeCategory === category
                    ? 'text-summitGoldDark border-b-2 border-summitGold pb-1'
                    : 'text-midnightNavy/40 hover:text-midnightNavy'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {loading ? (
          <p className="text-center text-midnightNavy/50 font-bold uppercase tracking-widest py-20">Loading collection...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 md:gap-y-12 min-h-[40vh]">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full flex items-center justify-center">
                <p className="text-midnightNavy/50 font-bold uppercase tracking-widest">No products found in this category yet.</p>
              </div>
            ) : (
              filteredProducts.map((product, index) => (
                <ScrollReveal key={product.id} delay={(index % 4) * 80}>
                  <ProductCard product={product} />
                </ScrollReveal>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
}
