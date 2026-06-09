'use client';
import { useCart } from '../context/CartContext';

export default function CartSidebar() {
  const { isCartOpen, closeCart, cart, removeFromCart, cartTotal } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Dark Blur Backdrop */}
      <div 
        className="fixed inset-0 bg-storeBlack/60 backdrop-blur-sm z-[60] transition-opacity" 
        onClick={closeCart}
      ></div>

      {/* Slide-out Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-storeWhite z-[70] shadow-2xl flex flex-col transform transition-transform duration-300 animate-slide-in">
        
        {/* Cart Header */}
        <div className="flex justify-between items-center p-6 border-b border-borderGray">
          <h2 className="text-xl font-black uppercase tracking-widest text-storeBlack">Your Cart</h2>
          <button onClick={closeCart} className="text-storeBlack/50 hover:text-accentRed font-bold text-xl transition-colors">
            &times;
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <p className="text-center text-storeBlack/50 font-bold uppercase tracking-widest mt-10 text-sm">
              Your cart is empty.
            </p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 items-center">
                <img src={item.image} alt={item.name} className="w-20 h-24 object-cover bg-cardGray" />
                <div className="flex-grow">
                  <h3 className="text-sm font-bold text-storeBlack uppercase">{item.name}</h3>
                  <p className="text-xs text-storeBlack/60 font-medium tracking-widest mb-2">QTY: {item.quantity}</p>
                  <p className="text-sm font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-storeBlack/30 hover:text-accentRed text-sm font-bold uppercase transition-colors">
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer / Checkout */}
        <div className="p-6 border-t border-borderGray bg-cardGray">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-bold uppercase tracking-widest text-storeBlack/60">Subtotal</span>
            <span className="text-xl font-black text-storeBlack">₹{cartTotal.toLocaleString('en-IN')}</span>
          </div>
          <button className="w-full bg-storeBlack text-storeWhite py-5 text-sm font-black uppercase tracking-widest hover:bg-storeBlack/80 transition-colors">
            Proceed to Checkout
          </button>
        </div>

      </div>
    </>
  );
}