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

  if (order.status === 'cancelled') {
    return (
      <div className="bg-storeWhite min-h-screen pb-24">
        <section className="bg-red-950 py-16 text-center px-4">
          <div className="text-4xl mb-4 text-red-500 font-bold">✕</div>
          <h1 className="font-display text-4xl md:text-6xl text-red-500 uppercase tracking-wide mb-3">
            Order Cancelled
          </h1>
          <p className="text-storeWhite/70 text-sm uppercase tracking-widest">
            Order ID: <span className="text-red-400 font-bold">{order.id}</span>
          </p>
        </section>

        <MountainRidgeDivider />

        <div className="max-w-2xl mx-auto px-4 py-12 md:py-16 text-center space-y-8">
          <div className="bg-cardGray border border-borderGray p-6 md:p-8 text-left space-y-4">
            <h2 className="font-display text-xl text-midnightNavy uppercase tracking-wide text-center mb-2">
              Order Rejected / Cancelled
            </h2>
            <p className="text-sm text-midnightNavy/75 leading-relaxed text-center">
              This order has been cancelled or rejected. Any online payments made will be refunded automatically to your original payment method within 5-7 business days.
            </p>
          </div>
          <div className="flex justify-center">
            <Link
              href="/shop"
              className="bg-midnightNavy text-summitGold px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-midnightNavyLight transition-colors"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isPaid = order.status === 'prebook_paid' || order.status === 'confirmed';

  return (
    <div className="bg-storeWhite min-h-screen pb-24">
      <section className={`py-14 md:py-20 text-center px-4 ${isPaid ? 'bg-midnightNavy' : 'bg-amber-950'}`}>
        <div className="text-4xl mb-4">{isPaid ? '✓' : '⚡'}</div>
        <h1 className="font-display text-4xl md:text-6xl text-summitGold uppercase tracking-wide mb-3">
          {isPaid ? 'Payment Confirmed!' : 'Payment Pending'}
        </h1>
        <p className="text-storeWhite/70 text-sm uppercase tracking-widest">
          Order ID: <span className="text-summitGold font-bold">{order.id}</span>
        </p>
      </section>

      <MountainRidgeDivider />

      <div className="max-w-2xl mx-auto px-4 py-12 md:py-16 text-center space-y-8">
        <div className="bg-cardGray border border-borderGray p-6 md:p-8 text-left space-y-4">
          <h2 className="font-display text-xl text-midnightNavy uppercase tracking-wide text-center mb-2">
            Order Status Details
          </h2>
          {isPaid ? (
            <ol className="space-y-4 text-sm text-midnightNavy/75 leading-relaxed list-decimal pl-5">
              <li>
                We have successfully verified your full payment of{' '}
                <strong className="text-summitGoldDark">₹{order.subtotal.toLocaleString('en-IN')}</strong> via Razorpay.
              </li>
              <li>
                Your items have been reserved and sent to our production queue.
              </li>
              <li>
                We will email you with shipping updates and a tracking number as soon as your items are dispatched.
              </li>
            </ol>
          ) : (
            <ol className="space-y-4 text-sm text-midnightNavy/75 leading-relaxed list-decimal pl-5">
              <li>
                We have received your order details, but your payment of{' '}
                <strong className="text-amber-700">₹{order.subtotal.toLocaleString('en-IN')}</strong> is still pending.
              </li>
              <li>
                Please complete your online payment to confirm the booking and secure your items.
              </li>
              <li>
                If you encountered a payment issue, you can retry checkout or contact support below.
              </li>
            </ol>
          )}
        </div>

        <div className="text-sm text-midnightNavy/60 space-y-1">
          <p>Confirmation and invoice sent to <strong>{order.customer.email}</strong></p>
          <p>Delivering to {order.customer.city}, {order.customer.state} — {order.customer.pincode}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shop"
            className="bg-midnightNavy text-summitGold px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-midnightNavyLight transition-colors text-center"
          >
            Continue Shopping
          </Link>
          <Link
            href="/contact"
            className="border-2 border-midnightNavy text-midnightNavy px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-midnightNavy hover:text-summitGold transition-colors text-center"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
