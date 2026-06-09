'use client'; 
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

export default function TrendingGrid() {
  const { addToCart } = useCart();
  // State to track which category is clicked
  const [activeCategory, setActiveCategory] = useState('All');
  
  // The filtering engine
  const filteredProducts = activeCategory === 'All' 
    ? products.slice(0, 4) // Show top 4 for "All" on homepage
    : products.filter(product => product.category === activeCategory).slice(0, 4);

  const filters = ['All', 'Footwear', 'POD Exclusives', 'Streetwear'];

  return (
    <section className="py-24 bg-storeWhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Interactive Filters */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-storeBlack uppercase tracking-widest mb-4">New Arrivals</h2>
          <div className="flex flex-wrap justify-center gap-6 text-sm font-bold uppercase tracking-wider">
            {filters.map(filter => (
              <button 
                key={filter}
                onClick={() => setActiveCategory(filter)}
                className={`transition-colors pb-1 ${
                  activeCategory === filter 
                    ? 'text-storeBlack border-b-2 border-storeBlack' 
                    : 'text-storeBlack/50 hover:text-storeBlack'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Filtered Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-500">
          {filteredProducts.length === 0 ? (
            <p className="col-span-full text-center text-storeBlack/50 font-bold uppercase tracking-widest py-10">
              More {activeCategory} dropping soon.
            </p>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="group relative cursor-pointer animate-slide-in">
                <div className="relative aspect-[3/4] bg-cardGray mb-4 flex items-center justify-center overflow-hidden">
                  <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  {product.isNew && <div className="absolute top-4 left-4 bg-storeBlack text-storeWhite text-[10px] font-bold uppercase tracking-widest px-3 py-1 z-10">NEW</div>}
                  <button className="absolute top-4 right-4 w-8 h-8 bg-storeWhite rounded-full flex items-center justify-center shadow-md text-storeBlack/40 hover:text-accentRed transition-colors z-10">&hearts;</button>
                  <div className="absolute bottom-4 left-4 right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
                    <button onClick={() => addToCart(product)} className="w-full bg-storeBlack/90 backdrop-blur-sm text-storeWhite py-3 text-xs font-bold uppercase tracking-widest hover:bg-storeBlack transition-colors">Add to Cart</button>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-bold text-storeBlack mb-1">{product.name}</h3>
                  <p className="text-[10px] text-storeBlack/50 font-bold uppercase tracking-widest mb-2">{product.category}</p>
                  <p className="text-sm text-storeBlack/80 font-medium">₹{product.price.toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  )
}