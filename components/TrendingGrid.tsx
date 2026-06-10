'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';
import ScrollReveal from './ScrollReveal';
import { useProducts } from '../hooks/useProducts';

export default function TrendingGrid() {
  const { products, loading } = useProducts();
  const [activeCategory, setActiveCategory] = useState('All');

  const filters = ['All', 'Footwear', 'POD Exclusives', 'Streetwear'];

  const filteredProducts = activeCategory === 'All'
    ? products.slice(0, 4)
    : products.filter((product) => product.category === activeCategory).slice(0, 4);

  return (
    <section className="py-16 md:py-24 bg-storeWhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <ScrollReveal>
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-display text-4xl md:text-6xl text-midnightNavy uppercase tracking-widest mb-4">New Arrivals</h2>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm font-bold uppercase tracking-wider">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveCategory(filter)}
                  className={`transition-colors pb-1 ${
                    activeCategory === filter
                      ? 'text-summitGoldDark border-b-2 border-summitGold'
                      : 'text-midnightNavy/50 hover:text-midnightNavy'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {loading ? (
          <p className="text-center text-midnightNavy/50 font-bold uppercase tracking-widest py-10">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.length === 0 ? (
              <p className="col-span-full text-center text-midnightNavy/50 font-bold uppercase tracking-widest py-10">
                More {activeCategory} dropping soon.
              </p>
            ) : (
              filteredProducts.map((product, index) => (
                <ScrollReveal key={product.id} delay={index * 100}>
                  <ProductCard product={product} />
                </ScrollReveal>
              ))
            )}
          </div>
        )}

      </div>
    </section>
  );
}
