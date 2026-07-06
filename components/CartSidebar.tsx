'use client';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import SafeImage from './SafeImage';

export default function CartSidebar() {
  const { isCartOpen, closeCart, cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-midnightNavy/70 backdrop-blur-sm z-[60] transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-storeWhite z-[70] shadow-2xl flex flex-col animate-slide-in">
        <div className="flex justify-between items-center p-6 border-b border-borderGray bg-midnightNavy">
          <h2 className="text-2xl font-display text-summitGold uppercase tracking-widest">Your Cart</h2>
          <button
            onClick={closeCart}
            className="text-summitGold/60 hover:text-summitGold font-bold text-2xl transition-colors w-10 h-10 flex items-center justify-center"
            aria-label="Close cart"
          >
            &times;
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <p className="text-center text-midnightNavy/50 font-bold uppercase tracking-widest mt-10 text-sm">
              Your cart is empty.
            </p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 items-center border-b border-borderGray pb-6">
                <SafeImage src={item.image} alt={item.name} className="w-20 h-24 object-cover bg-cardGray shrink-0" />
                <div className="flex-grow min-w-0">
                  <h3 className="text-sm font-bold text-midnightNavy uppercase truncate">{item.name}</h3>
                  <p className="text-[10px] text-midnightNavy/50 font-bold uppercase tracking-widest mt-0.5">
                    {item.color} · Size {item.size}
                  </p>
                  <p className="text-sm font-bold text-summitGoldDark mt-1">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 border border-borderGray flex items-center justify-center text-midnightNavy font-bold hover:border-summitGold hover:text-summitGold transition-colors"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="text-sm font-bold text-midnightNavy w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 border border-borderGray flex items-center justify-center text-midnightNavy font-bold hover:border-summitGold hover:text-summitGold transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-midnightNavy/30 hover:text-summitGoldDark text-xs font-bold uppercase transition-colors shrink-0"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-borderGray bg-cardGray space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold uppercase tracking-widest text-midnightNavy/60">Subtotal</span>
            <span className="text-xl font-display text-midnightNavy">₹{cartTotal.toLocaleString('en-IN')}</span>
          </div>

          <Link
            href="/checkout"
            onClick={closeCart}
            className={`w-full block text-center bg-midnightNavy text-summitGold py-4 text-sm font-black uppercase tracking-widest hover:bg-midnightNavyLight transition-colors ${
              cart.length === 0 ? 'pointer-events-none opacity-40' : ''
            }`}
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </>
  );
}
