'use client';

import { useCallback, useEffect, useState } from 'react';
import AdminLogin from '../../../components/admin/AdminLogin';
import AdminShell from '../../../components/admin/AdminShell';
import { useAdminAuth } from '../../../hooks/useAdminAuth';
import type { Order } from '../../../types/order';

type CustomerMetric = {
  email: string;
  fullName: string;
  phone: string;
  location: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
};

export default function CustomersPage() {
  const { password, setPassword, authenticated, loading, error, login, getPassword, logout } = useAdminAuth();
  const [customers, setCustomers] = useState<CustomerMetric[]>([]);
  const [search, setSearch] = useState('');
  const [storageMode, setStorageMode] = useState<'supabase' | 'file'>('file');

  const fetchData = useCallback(async () => {
    const pwd = getPassword();
    try {
      const res = await fetch('/api/orders', {
        headers: { 'x-admin-password': pwd },
      });
      if (res.ok) {
        const data = await res.json();
        const ordersList: Order[] = data.orders || [];

        // Aggregate customers by email
        const agg: Record<string, CustomerMetric> = {};

        ordersList.forEach((order) => {
          const email = order.customer.email.trim().toLowerCase();
          const cleanEmail = email || `no-email-${order.id}`;

          if (!agg[cleanEmail]) {
            agg[cleanEmail] = {
              email: order.customer.email || 'N/A',
              fullName: order.customer.fullName || 'Guest Customer',
              phone: order.customer.phone || 'N/A',
              location: `${order.customer.city}, ${order.customer.state}`,
              ordersCount: 0,
              totalSpent: 0,
              lastOrderDate: order.createdAt,
            };
          }

          agg[cleanEmail].ordersCount += 1;
          if (order.status !== 'cancelled') {
            agg[cleanEmail].totalSpent += order.subtotal;
          }
          if (new Date(order.createdAt).getTime() > new Date(agg[cleanEmail].lastOrderDate).getTime()) {
            agg[cleanEmail].lastOrderDate = order.createdAt;
          }
        });

        setCustomers(Object.values(agg));
      }

      const statusRes = await fetch('/api/admin/status', { headers: { 'x-admin-password': pwd } });
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setStorageMode(statusData.storageMode);
      }
    } catch (err) {
      console.error(err);
    }
  }, [getPassword]);

  useEffect(() => {
    if (authenticated) {
      fetchData();
    }
  }, [authenticated, fetchData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(password);
  };

  const filtered = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.location.toLowerCase().includes(search.toLowerCase())
  );

  if (!authenticated) {
    return (
      <AdminLogin
        password={password}
        setPassword={setPassword}
        onSubmit={handleLogin}
        loading={loading}
        error={error}
        title="Customers Admin"
      />
    );
  }

  return (
    <AdminShell
      title="Customers"
      subtitle={`${customers.length} unique customer profiles aggregated from orders`}
      storageMode={storageMode}
      onLogout={logout}
    >
      <div className="space-y-4">
        {/* Search */}
        <div className="flex justify-between items-center gap-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers by name, email, phone or state..."
            className="field-input max-w-md shadow-sm rounded-lg"
          />
        </div>

        {/* Table Container */}
        <div className="bg-storeWhite rounded-2xl border border-borderGray overflow-hidden shadow-sm">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-midnightNavy/50 font-bold uppercase tracking-widest text-sm">
                {search ? 'No customers match your criteria.' : 'No customer profiles found.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-cardGray border-b border-borderGray text-midnightNavy/50 font-bold uppercase tracking-widest">
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Contact Info</th>
                    <th className="p-4">Location</th>
                    <th className="p-4 text-center">Orders</th>
                    <th className="p-4 text-right">Lifetime Value</th>
                    <th className="p-4 text-right">Last Purchase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderGray font-semibold text-midnightNavy">
                  {filtered.map((c) => (
                    <tr key={c.email} className="hover:bg-cardGray/30 transition-colors">
                      <td className="p-4">
                        <p className="text-sm font-black">{c.fullName}</p>
                      </td>
                      <td className="p-4 space-y-0.5">
                        <p>{c.email}</p>
                        <p className="text-[10px] text-midnightNavy/55">{c.phone}</p>
                      </td>
                      <td className="p-4 text-midnightNavy/70">
                        {c.location}
                      </td>
                      <td className="p-4 text-center">
                        <span className="bg-cardGray px-2 py-1 rounded text-[10px] font-bold">
                          {c.ordersCount}
                        </span>
                      </td>
                      <td className="p-4 text-right font-display text-base text-summitGoldDark">
                        ₹{c.totalSpent.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4 text-right text-[10px] text-midnightNavy/50">
                        {new Date(c.lastOrderDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
