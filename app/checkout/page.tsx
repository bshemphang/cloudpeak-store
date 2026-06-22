'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import SafeImage from '../../components/SafeImage';
import MountainRidgeDivider from '../../components/MountainRidgeDivider';
import { SITE } from '../../lib/site';
import { calculatePrebookAmount } from '../../lib/order-utils';
import type { CustomerDetails } from '../../types/order';

const emptyCustomer: CustomerDetails = {
  fullName: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  notes: '',
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [customer, setCustomer] = useState<CustomerDetails>(emptyCustomer);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const prebookAmount = calculatePrebookAmount(cartTotal);

  useEffect(() => {
    if (user) {
      setCustomer((prev) => ({
        ...prev,
        fullName: user.profile?.fullName || prev.fullName || '',
        phone: user.profile?.phone || prev.phone || '',
        email: user.email || prev.email || '',
        address: user.profile?.address || prev.address || '',
        city: user.profile?.city || prev.city || '',
        state: user.profile?.state || prev.state || '',
        pincode: user.profile?.pincode || prev.pincode || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    if (cart.length === 0) {
      router.replace('/shop');
    }
  }, [cart.length, router]);

  if (cart.length === 0) return null;

  const handleChange = (field: keyof CustomerDetails, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          items: cart.map(({ id, name, price, quantity, image, size, color }) => ({
            id, name, price, quantity, image, size, color,
          })),
          subtotal: cartTotal,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      clearCart();
      router.push(`/order-confirmation/${data.order.id}`);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-storeWhite min-h-screen pb-24">
      <section className="bg-midnightNavy py-12 md:py-16 text-center px-4">
        <h1 className="font-display text-4xl md:text-6xl text-summitGold uppercase tracking-wide mb-2">
          Checkout
        </h1>
        <p className="text-storeWhite/60 text-sm uppercase tracking-widest">
          Complete your details to place your order
        </p>
      </section>

      <MountainRidgeDivider />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 grid grid-cols-1 lg:grid-cols-5 gap-10">
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
          {!user && (
            <div className="bg-cardGray border border-borderGray p-4 text-xs text-midnightNavy/80 leading-relaxed flex justify-between items-center gap-3">
              <span>Already have an account? Sign in to checkout faster and auto-fill your delivery address.</span>
              <Link
                href="/login?redirect=/checkout"
                className="bg-midnightNavy text-summitGold px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-midnightNavyLight transition-colors whitespace-nowrap"
              >
                Sign In
              </Link>
            </div>
          )}
          <h2 className="font-display text-2xl text-midnightNavy uppercase tracking-wide">
            Delivery Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-midnightNavy/60 mb-2">
                Full Name *
              </label>
              <input
                required
                value={customer.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className="w-full border border-borderGray px-4 py-3 text-sm outline-none focus:border-summitGold transition-colors"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-midnightNavy/60 mb-2">
                Phone (WhatsApp) *
              </label>
              <input
                required
                type="tel"
                value={customer.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full border border-borderGray px-4 py-3 text-sm outline-none focus:border-summitGold transition-colors"
                placeholder="10-digit mobile number"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-midnightNavy/60 mb-2">
                Email *
              </label>
              <input
                required
                type="email"
                value={customer.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full border border-borderGray px-4 py-3 text-sm outline-none focus:border-summitGold transition-colors"
                placeholder="you@email.com"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-midnightNavy/60 mb-2">
                Full Address *
              </label>
              <textarea
                required
                rows={3}
                value={customer.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full border border-borderGray px-4 py-3 text-sm outline-none focus:border-summitGold transition-colors resize-none"
                placeholder="House no., street, landmark"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-midnightNavy/60 mb-2">
                City *
              </label>
              <input
                required
                value={customer.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full border border-borderGray px-4 py-3 text-sm outline-none focus:border-summitGold transition-colors"
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-midnightNavy/60 mb-2">
                State *
              </label>
              <input
                required
                value={customer.state}
                onChange={(e) => handleChange('state', e.target.value)}
                className="w-full border border-borderGray px-4 py-3 text-sm outline-none focus:border-summitGold transition-colors"
                placeholder="State"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-midnightNavy/60 mb-2">
                PIN Code *
              </label>
              <input
                required
                value={customer.pincode}
                onChange={(e) => handleChange('pincode', e.target.value)}
                className="w-full border border-borderGray px-4 py-3 text-sm outline-none focus:border-summitGold transition-colors"
                placeholder="6-digit PIN"
                maxLength={6}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-midnightNavy/60 mb-2">
                Order Notes (optional)
              </label>
              <textarea
                rows={2}
                value={customer.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                className="w-full border border-borderGray px-4 py-3 text-sm outline-none focus:border-summitGold transition-colors resize-none"
                placeholder="Size preferences, POD custom text, delivery instructions..."
              />
            </div>
          </div>

          {error && (
            <p className="text-sm font-bold text-red-600 bg-red-50 border border-red-200 px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-midnightNavy text-summitGold py-4 text-sm font-black uppercase tracking-widest hover:bg-midnightNavyLight transition-colors disabled:opacity-50"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>

          <p className="text-xs text-midnightNavy/50 leading-relaxed">
            By placing this order you agree to our{' '}
            <Link href="/privacy-policy" className="text-summitGoldDark underline">Privacy Policy</Link>
            {' '}and{' '}
            <Link href="/return-policy" className="text-summitGoldDark underline">Return Policy</Link>.
          </p>
        </form>

        <aside className="lg:col-span-2">
          <div className="bg-cardGray border border-borderGray p-6 sticky top-24">
            <h2 className="font-display text-xl text-midnightNavy uppercase tracking-wide mb-6">
              Order Summary
            </h2>
            <ul className="space-y-4 mb-6">
              {cart.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <SafeImage src={item.image} alt={item.name} className="w-14 h-16 object-cover bg-storeWhite shrink-0" />
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-bold text-midnightNavy truncate">{item.name}</p>
                    <p className="text-xs text-midnightNavy/50">{item.color} · {item.size} · Qty: {item.quantity}</p>
                    <p className="text-sm font-bold text-summitGoldDark">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-borderGray pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-midnightNavy/60 uppercase tracking-widest text-xs font-bold">Subtotal</span>
                <span className="font-bold">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-midnightNavy/60 uppercase tracking-widest text-xs font-bold">Prebook ({SITE.prebookPercent}%)</span>
                <span className="font-bold text-summitGoldDark">₹{prebookAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-midnightNavy/5 border border-summitGold/20 text-xs text-midnightNavy/70 leading-relaxed">
              After placing your order, our team will contact you on WhatsApp to collect the prebook
              amount of <strong>₹{prebookAmount.toLocaleString('en-IN')}</strong> and confirm your booking.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
