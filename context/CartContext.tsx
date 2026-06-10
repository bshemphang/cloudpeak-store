'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { buildCartLineId } from '../lib/product-utils';

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
};

type AddToCartInput = {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity?: number;
};

type CartContextType = {
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: AddToCartInput) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = ({ productId, name, price, image, size, quantity = 1 }: AddToCartInput) => {
    const lineId = buildCartLineId(productId, size);
    setCart(prev => {
      const existing = prev.find(item => item.id === lineId);
      if (existing) {
        return prev.map(item =>
          item.id === lineId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { id: lineId, productId, name, price, image, size, quantity }];
    });
    openCart();
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, isCartOpen, openCart, closeCart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
