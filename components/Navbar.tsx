'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { openCart, cart } = useCart();
  
  // Calculate total items in cart (sum of quantities)
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-storeWhite border-b border-borderGray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          <Link href="/" className="flex items-center gap-3 group">
            <Image 
              src="/minimal-modern-professional-logo-for-brand-cloudpe.jpeg" 
              alt="Cloudpeak Logo" 
              width={45} 
              height={45} 
              className="object-contain mix-blend-darken contrast-125"
            />
            <span className="font-black text-2xl tracking-[0.15em] uppercase mt-1">
              Cloudpeak
            </span>
          </Link>

          <div className="hidden md:flex space-x-10 items-center">
            <Link href="/" className="text-xs font-bold uppercase tracking-widest text-storeBlack/70 hover:text-storeBlack transition-colors">Home</Link>
            <Link href="/shop" className="text-xs font-bold uppercase tracking-widest text-storeBlack/70 hover:text-storeBlack transition-colors">Shop</Link>
            <Link href="/about" className="text-xs font-bold uppercase tracking-widest text-storeBlack/70 hover:text-storeBlack transition-colors">Culture</Link>
            <Link href="/contact" className="text-xs font-bold uppercase tracking-widest text-storeBlack/70 hover:text-storeBlack transition-colors">Contact</Link>
            
            {/* The Cart Button */}
            <button onClick={openCart} className="text-xs font-bold uppercase tracking-widest text-storeBlack flex items-center gap-2 hover:text-accentRed transition-colors">
              Cart {itemCount > 0 && <span className="bg-storeBlack text-storeWhite px-2 py-1 rounded-full text-[10px]">{itemCount}</span>}
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}