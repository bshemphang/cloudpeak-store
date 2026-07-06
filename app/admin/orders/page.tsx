'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLogin from '../../../components/admin/AdminLogin';
import AdminShell from '../../../components/admin/AdminShell';
import { getCustomerPrebookWhatsAppLink } from '../../../lib/whatsapp';
import { SITE } from '../../../lib/site';
import { useAdminAuth } from '../../../hooks/useAdminAuth';
import type { Order, OrderStatus } from '../../../types/order';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending_prebook: 'Unpaid / Draft',
  prebook_paid: 'Paid',
  confirmed: 'Confirmed / Processing',
  cancelled: 'Cancelled / Rejected',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending_prebook: 'bg-amber-100 text-amber-800 border border-amber-200',
  prebook_paid: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  confirmed: 'bg-blue-100 text-blue-800 border border-blue-200',
  cancelled: 'bg-red-100 text-red-800 border border-red-200',
};

export default function AdminOrdersPage() {
  const { password, setPassword, authenticated, loading: authLoading, error: authError, login, getPassword, logout } = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [storageMode, setStorageMode] = useState<'supabase' | 'file'>('file');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    const pwd = getPassword();
    try {
      const res = await fetch('/api/orders', {
        headers: { 'x-admin-password': pwd },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Failed to load orders');
        return;
      }
      setOrders(data.orders);
      const statusRes = await fetch('/api/admin/status', { headers: { 'x-admin-password': pwd } });
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setStorageMode(statusData.storageMode);
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, [getPassword]);

  useEffect(() => {
    if (authenticated) {
      fetchOrders();
    }
  }, [authenticated, fetchOrders]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(password);
  };

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    const pwd = getPassword();
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
        loading={authLoading || loading}
        error={authError || error}
        title="Orders Admin"
      />
    );
  }

  return (
    <AdminShell
      title="Orders"
      subtitle={`${orders.length} customer orders`}
      storageMode={storageMode}
      onLogout={logout}
    >
      <div className="max-w-4xl space-y-3">
        {orders.length === 0 ? (
          <div className="bg-storeWhite rounded-2xl border border-borderGray p-12 text-center">
            <p className="text-midnightNavy/50 font-bold uppercase tracking-widest text-sm">
              No orders yet. They&apos;ll appear here when customers checkout.
            </p>
          </div>
        ) : (
          orders.map((order) => {
            const isExpanded = expandedId === order.id;
            const waLink = getCustomerPrebookWhatsAppLink(order);

            return (
              <div key={order.id} className="bg-storeWhite rounded-2xl border border-borderGray overflow-hidden shadow-sm">
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
                        <p><strong>Name:</strong> {order.customer.fullName}</p>
                        <p><strong>Phone:</strong> {order.customer.phone}</p>
                        <p><strong>Email:</strong> {order.customer.email}</p>
                        <p><strong>Address:</strong> {order.customer.address}</p>
                        <p><strong>City:</strong> {order.customer.city}, {order.customer.state} — {order.customer.pincode}</p>
                        {order.customer.notes && <p><strong>Notes:</strong> {order.customer.notes}</p>}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-summitGoldDark">Payment Details</h3>
                        <p><strong>Order Total:</strong> ₹{order.subtotal.toLocaleString('en-IN')}</p>
                        <div className="border-t border-borderGray pt-2 mt-2 space-y-1 text-xs">
                          {order.customer.payment ? (
                            <>
                              <p className="text-green-700 font-bold uppercase tracking-wider mb-1">✓ Razorpay Payment Verified</p>
                              <p><strong>Payment ID:</strong> <code className="bg-cardGray px-1 select-all">{order.customer.payment.paymentId}</code></p>
                              <p><strong>Order ID:</strong> <code className="bg-cardGray px-1 select-all">{order.customer.payment.orderId}</code></p>
                              <p><strong>Method:</strong> {order.customer.payment.method || 'Online Checkout'}</p>
                              {order.customer.payment.refund && (
                                <div className="mt-2 p-2 bg-red-50 border border-red-200 text-red-800 space-y-0.5 rounded">
                                  <p className="font-bold">✕ Full Refund Processed</p>
                                  <p><strong>Refund ID:</strong> <code>{order.customer.payment.refund.refundId}</code></p>
                                  <p><strong>Refunded At:</strong> {new Date(order.customer.payment.refund.createdAt).toLocaleString('en-IN')}</p>
                                  <p><strong>Status:</strong> {order.customer.payment.refund.status}</p>
                                </div>
                              )}
                            </>
                          ) : (
                            <p className="text-amber-700 font-bold uppercase tracking-wider">⚡ No Razorpay Payment Data (Unpaid / Manual)</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-summitGoldDark mb-2">Items</h3>
                      <ul className="text-sm space-y-1">
                        {order.items.map((item) => (
                          <li key={item.id} className="text-midnightNavy/80">
                            {item.name}
                            {item.color ? ` · ${item.color}` : ''}
                            {item.size ? ` · ${item.size}` : ''} × {item.quantity} — ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <a
                        href={`https://wa.me/${order.customer.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 text-xs font-black uppercase tracking-widest hover:bg-[#1fb855] transition-colors"
                      >
                        WhatsApp Customer
                      </a>
                      {order.status === 'pending_prebook' && (
                        <button
                          onClick={() => updateStatus(order.id, 'prebook_paid')}
                          className="border border-midnightNavy bg-midnightNavy text-summitGold px-5 py-3 text-xs font-black uppercase tracking-widest hover:bg-midnightNavyLight hover:text-summitGold transition-colors"
                        >
                          Mark Paid
                        </button>
                      )}
                      {order.status === 'prebook_paid' && (
                        <button
                          onClick={() => updateStatus(order.id, 'confirmed')}
                          className="border border-green-700 bg-green-700 text-white px-5 py-3 text-xs font-black uppercase tracking-widest hover:bg-green-800 transition-colors"
                        >
                          Confirm Order
                        </button>
                      )}
                      {order.status !== 'cancelled' && (
                        <button
                          onClick={() => updateStatus(order.id, 'cancelled')}
                          className="text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 px-5 py-3 text-xs font-bold uppercase tracking-widest transition-colors"
                        >
                          Cancel / Reject Order
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
    </AdminShell>
  );
}
