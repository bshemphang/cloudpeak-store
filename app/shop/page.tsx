'use client'; 
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { products } from '../../data/products';

export default function Shop() {
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState('All');
  
  const categories = ['All', 'Footwear', 'Streetwear', 'POD Exclusives', 'Accessories'];

  // Filter all products based on the clicked category button
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="bg-storeWhite min-h-screen pb-24">
      {/* SHOP HEADER */}
      <section className="bg-cardGray py-20 border-b border-borderGray text-center px-4">
        <h1 className="text-5xl md:text-7xl font-black text-storeBlack uppercase tracking-tighter mb-4">The Collection</h1>
        <p className="text-storeBlack/60 text-sm font-medium tracking-widest uppercase max-w-2xl mx-auto">
          Curated dropshipping lifestyle pieces and premium POD drops.
        </p>
      </section>

      {/* SHOP CONTENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-8 mb-16 border-b border-borderGray pb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`text-xs font-bold tracking-widest uppercase transition-colors ${
                activeCategory === category
                  ? 'text-storeBlack border-b-2 border-storeBlack pb-1'
                  : 'text-storeBlack/40 hover:text-storeBlack'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 min-h-[40vh]">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full flex items-center justify-center">
               <p className="text-storeBlack/50 font-bold uppercase tracking-widest">No products found in this category yet.</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="group relative cursor-pointer animate-slide-in">
                <div className="relative aspect-[3/4] bg-cardGray mb-4 flex items-center justify-center overflow-hidden">
                  <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  {product.isNew && <div className="absolute top-4 left-4 bg-storeBlack text-storeWhite text-[10px] font-bold uppercase tracking-widest px-3 py-1 z-10">NEW</div>}
                  <button className="absolute top-4 right-4 w-8 h-8 bg-storeWhite rounded-full flex items-center justify-center shadow-sm text-storeBlack/40 hover:text-accentRed transition-colors z-10">&hearts;</button>
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
      </section>
    </div>
  )
}