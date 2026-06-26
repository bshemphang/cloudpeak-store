'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import MountainRidgeDivider from '../../../components/MountainRidgeDivider';
import { SITE } from '../../../lib/site';
import type { Order } from '../../../types/order';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => setOrder(data.order ?? null))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-storeWhite">
        <p className="text-midnightNavy/50 font-bold uppercase tracking-widest text-sm">Loading...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-storeWhite px-4 text-center">
        <h1 className="font-display text-3xl text-midnightNavy mb-4">Order Not Found</h1>
        <Link href="/shop" className="text-summitGoldDark font-bold uppercase text-sm tracking-widest hover:underline">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-storeWhite min-h-screen pb-24">
      <section className="bg-midnightNavy py-14 md:py-20 text-center px-4">
        <div className="text-4xl mb-4">✓</div>
        <h1 className="font-display text-4xl md:text-6xl text-summitGold uppercase tracking-wide mb-3">
          {order.status === 'prebook_paid' || order.status === 'confirmed' ? 'Order Confirmed!' : 'Order Placed!'}
        </h1>
        <p className="text-storeWhite/70 text-sm uppercase tracking-widest">
          Order ID: <span className="text-summitGold font-bold">{order.id}</span>
        </p>
      </section>

      <MountainRidgeDivider />

      <div className="max-w-2xl mx-auto px-4 py-12 md:py-16 text-center space-y-8">
        <div className="bg-cardGray border border-borderGray p-6 md:p-8 text-left space-y-4">
          <h2 className="font-display text-xl text-midnightNavy uppercase tracking-wide text-center mb-2">
            What Happens Next?
          </h2>
          {order.status === 'prebook_paid' || order.status === 'confirmed' ? (
            <ol className="space-y-4 text-sm text-midnightNavy/75 leading-relaxed list-decimal pl-5">
              <li>
                Our team has verified your prebook payment of{' '}
                <strong className="text-summitGoldDark">₹{order.prebookAmount.toLocaleString('en-IN')}</strong>.
              </li>
              <li>
                Your order is confirmed and your items are now reserved!
              </li>
              <li>
                We will contact you on WhatsApp at{' '}
                <strong className="text-midnightNavy">{order.customer.phone}</strong> to confirm your dispatch details.
              </li>
              <li>
                The remaining balance of{' '}
                <strong>₹{(order.subtotal - order.prebookAmount).toLocaleString('en-IN')}</strong>{' '}
                is due before shipping.
              </li>
            </ol>
          ) : (
            <ol className="space-y-4 text-sm text-midnightNavy/75 leading-relaxed list-decimal pl-5">
              <li>
                Our team has received your order and will review it shortly.
              </li>
              <li>
                We&apos;ll contact you on WhatsApp at{' '}
                <strong className="text-midnightNavy">{order.customer.phone}</strong> to collect the
                prebook amount of{' '}
                <strong className="text-summitGoldDark">₹{order.prebookAmount.toLocaleString('en-IN')}</strong>{' '}
                ({SITE.prebookPercent}% of your order total).
              </li>
              <li>
                Once prebook is paid, your items are reserved and we&apos;ll confirm dispatch details.
              </li>
              <li>
                Remaining balance of{' '}
                <strong>₹{(order.subtotal - order.prebookAmount).toLocaleString('en-IN')}</strong>{' '}
                is due before shipping.
              </li>
            </ol>
          )}
        </div>

        <div className="text-sm text-midnightNavy/60 space-y-1">
          <p>Confirmation sent to <strong>{order.customer.email}</strong></p>
          <p>Delivering to {order.customer.city}, {order.customer.state} — {order.customer.pincode}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shop"
            className="bg-midnightNavy text-summitGold px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-midnightNavyLight transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/contact"
            className="border-2 border-midnightNavy text-midnightNavy px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-midnightNavy hover:text-summitGold transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
