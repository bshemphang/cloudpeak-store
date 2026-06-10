'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLogin from '../../../components/admin/AdminLogin';
import AdminNav from '../../../components/admin/AdminNav';
import { getCustomerPrebookWhatsAppLink } from '../../../lib/whatsapp';
import { SITE } from '../../../lib/site';
import { ADMIN_SESSION_KEY } from '../../../lib/admin-auth';
import type { Order, OrderStatus } from '../../../types/order';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending_prebook: 'Awaiting Prebook',
  prebook_paid: 'Prebook Paid',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending_prebook: 'bg-amber-100 text-amber-800',
  prebook_paid: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AdminOrdersPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchOrders = useCallback(async (pwd: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/orders', {
        headers: { 'x-admin-password': pwd },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Failed to load orders');
        setAuthenticated(false);
        return;
      }
      setOrders(data.orders);
      setAuthenticated(true);
      sessionStorage.setItem(ADMIN_SESSION_KEY, pwd);
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (saved) {
      setPassword(saved);
      fetchOrders(saved);
    }
  }, [fetchOrders]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(password);
  };

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    const pwd = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!pwd) return;

    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': pwd,
      },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      const data = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
    }
  };

  if (!authenticated) {
    return (
      <AdminLogin
        password={password}
        setPassword={setPassword}
        onSubmit={handleLogin}
        loading={loading}
        error={error}
        title="Orders Admin"
      />
    );
  }

  return (
    <div className="bg-cardGray min-h-screen pb-16">
      <header className="bg-midnightNavy text-storeWhite px-4 py-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl text-summitGold uppercase tracking-wide">
              Orders Dashboard
            </h1>
            <p className="text-storeWhite/50 text-sm mt-1">{orders.length} total orders</p>
          </div>
          <div className="flex items-center gap-4">
            <AdminNav />
            <Link href="/" className="text-xs font-bold uppercase tracking-widest text-summitGold/70 hover:text-summitGold">
              Store →
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
        {orders.length === 0 ? (
          <div className="bg-storeWhite border border-borderGray p-12 text-center">
            <p className="text-midnightNavy/50 font-bold uppercase tracking-widest text-sm">
              No orders yet. They&apos;ll appear here when customers checkout.
            </p>
          </div>
        ) : (
          orders.map((order) => {
            const isExpanded = expandedId === order.id;
            const waLink = getCustomerPrebookWhatsAppLink(order);

            return (
              <div key={order.id} className="bg-storeWhite border border-borderGray overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 text-left hover:bg-cardGray/50 transition-colors"
                >
                  <div>
                    <p className="font-bold text-midnightNavy">{order.customer.fullName}</p>
                    <p className="text-xs text-midnightNavy/50 mt-0.5">
                      {order.id} · {new Date(order.createdAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                    <span className="font-display text-lg text-summitGoldDark">
                      ₹{order.subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-borderGray p-5 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      <div className="space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-summitGoldDark">Customer</h3>
                        <p><strong>Phone:</strong> {order.customer.phone}</p>
                        <p><strong>Email:</strong> {order.customer.email}</p>
                        <p><strong>Address:</strong> {order.customer.address}</p>
                        <p><strong>City:</strong> {order.customer.city}, {order.customer.state} — {order.customer.pincode}</p>
                        {order.customer.notes && <p><strong>Notes:</strong> {order.customer.notes}</p>}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-summitGoldDark">Payment</h3>
                        <p><strong>Order total:</strong> ₹{order.subtotal.toLocaleString('en-IN')}</p>
                        <p><strong>Prebook ({SITE.prebookPercent}%):</strong> ₹{order.prebookAmount.toLocaleString('en-IN')}</p>
                        <p><strong>Balance due:</strong> ₹{(order.subtotal - order.prebookAmount).toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-summitGoldDark mb-2">Items</h3>
                      <ul className="text-sm space-y-1">
                        {order.items.map((item) => (
                          <li key={item.id} className="text-midnightNavy/80">
                            {item.name}{item.size ? ` (${item.size})` : ''} × {item.quantity} — ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 text-xs font-black uppercase tracking-widest hover:bg-[#1fb855] transition-colors"
                      >
                        Request Prebook on WhatsApp
                      </a>
                      {order.status === 'pending_prebook' && (
                        <button
                          onClick={() => updateStatus(order.id, 'prebook_paid')}
                          className="border-2 border-midnightNavy text-midnightNavy px-5 py-3 text-xs font-black uppercase tracking-widest hover:bg-midnightNavy hover:text-summitGold transition-colors"
                        >
                          Mark Prebook Paid
                        </button>
                      )}
                      {order.status === 'prebook_paid' && (
                        <button
                          onClick={() => updateStatus(order.id, 'confirmed')}
                          className="border-2 border-green-700 text-green-700 px-5 py-3 text-xs font-black uppercase tracking-widest hover:bg-green-700 hover:text-white transition-colors"
                        >
                          Confirm Order
                        </button>
                      )}
                      {order.status !== 'cancelled' && (
                        <button
                          onClick={() => updateStatus(order.id, 'cancelled')}
                          className="text-red-600 px-5 py-3 text-xs font-bold uppercase tracking-widest hover:underline"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
