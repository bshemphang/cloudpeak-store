'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, CustomerProfile, AuthUser } from '../../context/AuthContext';
import MountainRidgeDivider from '../../components/MountainRidgeDivider';
import SafeImage from '../../components/SafeImage';
import type { Order } from '../../types/order';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, isMock, signOut, updateProfile } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Sync profile details to state when loaded
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }

    if (user?.profile) {
      setFullName(user.profile.fullName || '');
      setPhone(user.profile.phone || '');
      setAddress(user.profile.address || '');
      setCity(user.profile.city || '');
      setState(user.profile.state || '');
      setPincode(user.profile.pincode || '');
    }
  }, [user, loading, router]);

  // Fetch Order History
  useEffect(() => {
    const currentUser = user;
    if (!currentUser) return;

    async function fetchOrders(currUser: AuthUser) {
      setOrdersLoading(true);
      setOrdersError('');
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (!isMock && currUser.token) {
          headers['Authorization'] = `Bearer ${currUser.token}`;
        }
        
        const url = isMock
          ? `/api/orders/my-orders?email=${encodeURIComponent(currUser.email)}`
          : `/api/orders/my-orders`;

        const res = await fetch(url, { headers });
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to retrieve orders.');
        }

        setOrders(data.orders || []);
      } catch (err: any) {
        setOrdersError(err.message || 'Failed to load order history.');
      } finally {
        setOrdersLoading(false);
      }
    }

    fetchOrders(currentUser);
  }, [user, isMock]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-storeWhite flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-summitGold border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs uppercase font-bold tracking-widest text-midnightNavy/60">Loading profile...</p>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveSuccess(false);
    setSaveError('');

    try {
      const res = await updateProfile({
        fullName,
        phone,
        address,
        city,
        state,
        pincode,
      });

      if (res?.error) {
        setSaveError(res.error);
      } else {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch {
      setSaveError('Failed to update address book.');
    } finally {
      setSaveLoading(false);
    }
  };

  const getStatusBadgeClass = (status: Order['status']) => {
    switch (status) {
      case 'prebook_paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'confirmed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'prebook_paid':
        return 'Prebook Paid';
      case 'confirmed':
        return 'Confirmed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Pending Prebook';
    }
  };

  return (
    <div className="bg-storeWhite min-h-screen pb-24">
      {/* Page Header */}
      <section className="bg-midnightNavy py-12 md:py-16 text-center px-4 relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left md:text-left text-center">
            <h1 className="font-display text-4xl md:text-5xl text-summitGold uppercase tracking-wide mb-1">
              My Account
            </h1>
            <p className="text-storeWhite/60 text-xs font-bold uppercase tracking-widest">
              Logged in as: <span className="text-storeWhite">{user.email}</span>
              {isMock && <span className="ml-2 text-summitGold/80 bg-summitGold/10 px-2 py-0.5 border border-summitGold/20 text-[9px] rounded-full">Sandbox Mode</span>}
            </p>
          </div>
          <button
            onClick={() => {
              signOut();
              router.push('/login');
            }}
            className="border border-summitGold/30 text-summitGold hover:bg-summitGold/10 px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-colors shrink-0"
          >
            Sign Out
          </button>
        </div>
      </section>

      <MountainRidgeDivider />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Side: Address Book Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-cardGray border border-borderGray p-6">
            <h2 className="font-display text-2xl text-midnightNavy uppercase tracking-wide mb-4">
              Saved Address Book
            </h2>
            <p className="text-xs text-midnightNavy/60 mb-6 leading-relaxed">
              Save your shipping details here to speed up checkout on your future orders.
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="field-label">Full Name</label>
                <input
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full name"
                  className="field-input"
                />
              </div>

              <div>
                <label className="field-label">Phone (WhatsApp)</label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit number"
                  className="field-input"
                />
              </div>

              <div>
                <label className="field-label">Full Address</label>
                <textarea
                  required
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat/House no., Street name, Landmark"
                  className="field-input resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="field-label">City</label>
                  <input
                    required
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="field-input"
                  />
                </div>
                <div>
                  <label className="field-label">State</label>
                  <input
                    required
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                    className="field-input"
                  />
                </div>
              </div>

              <div>
                <label className="field-label">PIN Code</label>
                <input
                  required
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="6-digit ZIP"
                  maxLength={6}
                  className="field-input"
                />
              </div>

              {saveError && (
                <div className="p-3 text-xs font-semibold text-red-600 bg-red-50 border border-red-200">
                  {saveError}
                </div>
              )}

              {saveSuccess && (
                <div className="p-3 text-xs font-semibold text-green-700 bg-green-50 border border-green-200">
                  Address details updated successfully!
                </div>
              )}

              <button
                type="submit"
                disabled={saveLoading}
                className="w-full bg-midnightNavy text-summitGold py-3.5 text-xs font-black uppercase tracking-widest hover:bg-midnightNavyLight transition-colors disabled:opacity-50"
              >
                {saveLoading ? 'Saving...' : 'Save Address'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Order History */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="font-display text-2xl text-midnightNavy uppercase tracking-wide border-b border-borderGray pb-3">
            Order History
          </h2>

          {ordersLoading ? (
            <div className="py-12 text-center">
              <div className="w-6 h-6 border-2 border-summitGold border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs uppercase font-bold tracking-widest text-midnightNavy/50">Fetching orders...</p>
            </div>
          ) : ordersError ? (
            <div className="p-4 text-sm font-medium text-red-600 bg-red-50 border border-red-200">
              {ordersError}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-cardGray border border-borderGray p-8 text-center space-y-4">
              <p className="text-sm font-medium text-midnightNavy/60">
                You haven't placed any orders yet.
              </p>
              <Link
                href="/shop"
                className="inline-block bg-midnightNavy text-summitGold px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-midnightNavyLight transition-colors"
              >
                Shop Our Drops
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="border border-borderGray bg-cardGray overflow-hidden">
                  {/* Order Card Header */}
                  <div className="bg-midnightNavy text-storeWhite px-4 py-3 flex flex-wrap justify-between items-center gap-3">
                    <div className="space-y-0.5">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-storeWhite/55">Order ID</p>
                      <p className="text-xs font-black text-summitGold select-all">{order.id}</p>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-storeWhite/55">Date</p>
                        <p className="text-xs font-bold">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-storeWhite/55 text-right">Status</p>
                        <span className={`inline-block border px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-sm ${getStatusBadgeClass(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 divide-y divide-borderGray/60">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                        <SafeImage src={item.image} alt={item.name} className="w-12 h-14 object-cover bg-storeWhite border border-borderGray shrink-0" />
                        <div className="flex-grow min-w-0">
                          <h4 className="text-sm font-bold text-midnightNavy truncate">{item.name}</h4>
                          <p className="text-xs text-midnightNavy/50">
                            {item.color && `Color: ${item.color}`}
                            {item.color && item.size && ' · '}
                            {item.size && `Size: ${item.size}`}
                            {` · Qty: ${item.quantity}`}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-black text-midnightNavy">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Financials */}
                  <div className="bg-storeWhite border-t border-borderGray px-4 py-3 flex flex-wrap justify-between items-center gap-3 text-xs">
                    <div>
                      <span className="text-midnightNavy/50 uppercase tracking-widest font-bold">Total: </span>
                      <strong className="text-sm font-black text-midnightNavy">₹{order.subtotal.toLocaleString('en-IN')}</strong>
                    </div>
                    <div>
                      <span className="text-midnightNavy/50 uppercase tracking-widest font-bold">Prebook: </span>
                      <strong className="text-sm font-black text-summitGoldDark">₹{order.prebookAmount.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
