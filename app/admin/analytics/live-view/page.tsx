'use client';

import { useEffect, useState } from 'react';
import AdminLogin from '../../../../components/admin/AdminLogin';
import AdminShell from '../../../../components/admin/AdminShell';
import { useAdminAuth } from '../../../../hooks/useAdminAuth';

type Event = {
  id: string;
  type: 'cart' | 'checkout' | 'prebook';
  message: string;
  time: string;
};

const LOCATIONS = [
  'Guwahati, Assam',
  'Shillong, Meghalaya',
  'New Delhi, Delhi',
  'Mumbai, Maharashtra',
  'Bangalore, Karnataka',
  'Kolkata, West Bengal',
  'Aizawl, Mizoram',
  'Kohima, Nagaland'
];

const PRODUCTS = [
  'Cloudpeak Classic Tee',
  'Alpine Cargo Pants',
  'Summit Hooded Windbreaker',
  'Ridge Socks (3-pack)',
  'Elevation Leather Belt'
];

export default function LiveViewPage() {
  const { password, setPassword, authenticated, loading, error, login, getPassword, logout } = useAdminAuth();
  const [activeUsers, setActiveUsers] = useState(4);
  const [activeCarts, setActiveCarts] = useState(1);
  const [todayViews, setTodayViews] = useState(148);
  const [events, setEvents] = useState<Event[]>([
    { id: '1', type: 'prebook', message: 'Prebook paid for Cloudpeak Classic Tee by Samuel T. (Shillong)', time: '2m ago' },
    { id: '2', type: 'cart', message: 'Added Alpine Cargo Pants to cart (Guwahati)', time: '5m ago' },
    { id: '3', type: 'checkout', message: 'Checkout started by guest (Mumbai)', time: '8m ago' }
  ]);
  const [sparkline, setSparkline] = useState<number[]>([4, 6, 5, 8, 3, 5, 4, 7, 6, 4]);

  // Simulate real-time updates
  useEffect(() => {
    if (!authenticated) return;

    const interval = setInterval(() => {
      // Fluctuate active users
      setActiveUsers((prev) => {
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, +1
        const next = Math.max(1, prev + change);
        
        // Update sparkline
        setSparkline((arr) => [...arr.slice(1), next]);
        return next;
      });

      // Fluctuate active carts
      setActiveCarts((prev) => {
        const change = Math.floor(Math.random() * 3) - 1;
        return Math.max(0, Math.min(activeUsers, prev + change));
      });

      // Increase today views
      setTodayViews((prev) => prev + Math.floor(Math.random() * 2));

      // Trigger a random new event (15% chance)
      if (Math.random() < 0.15) {
        const loc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
        const prod = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
        const names = ['Amit K.', 'Jane M.', 'Lars B.', 'Rongsen A.', 'Ibanri S.', 'Dipto G.'];
        const name = names[Math.floor(Math.random() * names.length)];

        let eventType: 'cart' | 'checkout' | 'prebook' = 'cart';
        let msg = '';

        const rand = Math.random();
        if (rand < 0.5) {
          eventType = 'cart';
          msg = `Added ${prod} to cart (${loc})`;
        } else if (rand < 0.8) {
          eventType = 'checkout';
          msg = `Started checkout for ${prod} (${loc})`;
        } else {
          eventType = 'prebook';
          msg = `Prebook paid for ${prod} by ${name} (${loc})`;
        }

        setEvents((prev) => [
          {
            id: Date.now().toString(),
            type: eventType,
            message: msg,
            time: 'Just now'
          },
          ...prev.slice(0, 7) // Keep last 8 items
        ]);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [authenticated, activeUsers]);

  // Format sparkline points
  const points = sparkline.map((val, idx) => `${idx * 15},${40 - val * 4}`).join(' ');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(password);
  };

  if (!authenticated) {
    return (
      <AdminLogin
        password={password}
        setPassword={setPassword}
        onSubmit={handleLogin}
        loading={loading}
        error={error}
        title="Live View Admin"
      />
    );
  }

  return (
    <AdminShell
      title="Live View"
      subtitle="Real-time visitor and checkout metrics"
      storageMode={undefined}
      onLogout={logout}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Metrics & Pulse Map Simulator */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1e1e1e] text-white rounded-2xl border border-white/5 p-6 shadow-lg relative overflow-hidden h-[380px] flex flex-col justify-between">
            {/* Background Map Visual */}
            <div className="absolute inset-0 opacity-20 flex items-center justify-center pointer-events-none select-none">
              <svg className="w-4/5 h-4/5 text-gray-500" viewBox="0 0 200 200" fill="currentColor">
                <circle cx="50" cy="80" r="10" />
                <circle cx="70" cy="110" r="15" />
                <circle cx="120" cy="70" r="25" />
                <circle cx="150" cy="130" r="18" />
                <circle cx="90" cy="140" r="12" />
              </svg>
            </div>

            {/* Pulsing Dots Simulator */}
            <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-summitGold rounded-full animate-ping pointer-events-none" />
            <div className="absolute top-2/3 left-1/2 w-3 h-3 bg-summitGold rounded-full animate-ping pointer-events-none" />
            <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-summitGold rounded-full animate-ping pointer-events-none" />
            <div className="absolute top-1/3 left-1/2 w-2 h-2 bg-summitGold rounded-full pointer-events-none" />
            <div className="absolute top-2/3 left-2/3 w-2 h-2 bg-summitGold rounded-full pointer-events-none" />

            <div className="z-10">
              <p className="text-xs font-black uppercase tracking-widest text-white/50 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                Live store activity
              </p>
              <div className="mt-4">
                <h1 className="text-5xl font-black tracking-tight">{activeUsers}</h1>
                <p className="text-sm font-semibold text-white/70 mt-1">active visitors right now</p>
              </div>
            </div>

            <div className="z-10 grid grid-cols-2 gap-4 border-t border-white/10 pt-4 bg-[#1e1e1e]/60 backdrop-blur">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Active carts</p>
                <h3 className="text-xl font-bold mt-1 text-summitGold">{activeCarts}</h3>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Views today</p>
                <h3 className="text-xl font-bold mt-1 text-white">{todayViews}</h3>
              </div>
            </div>
          </div>

          {/* Sparkline History Card */}
          <div className="bg-storeWhite rounded-2xl border border-borderGray p-6 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-midnightNavy/50 mb-4">Visitor activity flow (last 10 ticks)</h3>
            <div className="h-16 w-full">
              <svg className="w-full h-full" viewBox="0 0 135 40" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke="#D4A843"
                  strokeWidth="2"
                  points={points}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Column: Live Event Stream Ticker */}
        <div className="bg-storeWhite rounded-2xl border border-borderGray p-6 shadow-sm flex flex-col h-[500px]">
          <h3 className="text-xs font-black uppercase tracking-widest text-midnightNavy/50 mb-4">Live Customer Feed</h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {events.map((event) => {
              let bg = 'bg-gray-100 text-gray-800';
              let badge = 'CART';
              if (event.type === 'checkout') {
                bg = 'bg-blue-100 text-blue-800 border-blue-200';
                badge = 'CHECKOUT';
              } else if (event.type === 'prebook') {
                bg = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                badge = 'PREBOOK';
              }

              return (
                <div key={event.id} className="border border-borderGray/50 rounded-xl p-3 bg-cardGray/20 flex gap-3 items-start animate-fade-up">
                  <span className={`text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded shrink-0 ${bg}`}>
                    {badge}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-midnightNavy leading-tight">{event.message}</p>
                    <span className="text-[9px] text-midnightNavy/40 mt-1 block font-medium">{event.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
