'use client';

import { useCallback, useEffect, useState } from 'react';
import AdminLogin from '../../../components/admin/AdminLogin';
import AdminShell from '../../../components/admin/AdminShell';
import { useAdminAuth } from '../../../hooks/useAdminAuth';
import type { Order } from '../../../types/order';
import type { Product } from '../../../types/product';

type TimeRange = 'today' | 'yesterday' | '7days' | '30days';

export default function AdminAnalyticsPage() {
  const { password, setPassword, authenticated, loading, error, login, getPassword, logout } = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [storageMode, setStorageMode] = useState<'supabase' | 'file'>('file');
  const [timeRange, setTimeRange] = useState<TimeRange>('7days');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  const fetchStatus = useCallback(async (pwd: string) => {
    try {
      const res = await fetch('/api/admin/status', { headers: { 'x-admin-password': pwd } });
      if (res.ok) {
        const data = await res.json();
        setStorageMode(data.storageMode);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchData = useCallback(async () => {
    const pwd = getPassword();
    try {
      // Fetch orders
      const ordersRes = await fetch('/api/orders', {
        headers: { 'x-admin-password': pwd },
      });
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data.orders || []);
      }

      // Fetch products
      const productsRes = await fetch('/api/products');
      if (productsRes.ok) {
        const data = await productsRes.json();
        setProducts(data.products || []);
      }

      const now = new Date();
      setLastRefreshed(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
    } catch (err) {
      console.error(err);
    }
  }, [getPassword]);

  useEffect(() => {
    if (authenticated) {
      fetchData();
      fetchStatus(getPassword());
    }
  }, [authenticated, fetchData, fetchStatus, getPassword]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(password);
    if (ok) fetchStatus(password);
  };

  // ─── Filter Orders by Selected Time Range ───
  const getFilteredOrders = (range: TimeRange, list: Order[]) => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;

    return list.filter((order) => {
      const orderTime = new Date(order.createdAt).getTime();
      if (range === 'today') {
        return orderTime >= todayStart;
      }
      if (range === 'yesterday') {
        return orderTime >= yesterdayStart && orderTime < todayStart;
      }
      if (range === '7days') {
        return orderTime >= todayStart - 7 * 24 * 60 * 60 * 1000;
      }
      if (range === '30days') {
        return orderTime >= todayStart - 30 * 24 * 60 * 60 * 1000;
      }
      return true;
    });
  };

  const currentOrders = getFilteredOrders(timeRange, orders);

  // ─── Metrics Calculations ───
  const activeOrders = currentOrders.filter((o) => o.status !== 'cancelled');
  const grossSales = activeOrders.reduce((sum, o) => sum + o.subtotal, 0);
  const ordersFulfilled = activeOrders.filter((o) => o.status === 'confirmed').length;
  const totalOrdersCount = currentOrders.length;

  // Returning Customer Rate
  const getReturningCustomerRate = () => {
    if (orders.length === 0) return 0;
    const customerOrderCounts: Record<string, number> = {};
    orders.forEach((o) => {
      const email = o.customer.email.trim().toLowerCase();
      customerOrderCounts[email] = (customerOrderCounts[email] || 0) + 1;
    });
    const totalCustomers = Object.keys(customerOrderCounts).length;
    const returningCustomers = Object.values(customerOrderCounts).filter((count) => count > 1).length;
    return totalCustomers > 0 ? Math.round((returningCustomers / totalCustomers) * 100) : 0;
  };

  const returningCustomerRate = getReturningCustomerRate();
  const averageOrderValue = totalOrdersCount > 0 ? Math.round(grossSales / totalOrdersCount) : 0;

  // Total Sales Breakdown
  const discounts = grossSales * 0.05; // Simulate 5% discount
  const returns = currentOrders.filter((o) => o.status === 'cancelled').reduce((sum, o) => sum + o.subtotal, 0);
  const netSales = Math.max(0, grossSales - discounts - returns);
  const shippingCharges = activeOrders.length * 100; // Simulated shipping rate (₹100 per order)
  const taxes = netSales * 0.18; // Simulated 18% tax rate
  const totalSales = netSales + shippingCharges + taxes;

  // Sales by Product
  const getSalesByProduct = () => {
    const productMap: Record<string, { name: string; amount: number; quantity: number }> = {};
    activeOrders.forEach((o) => {
      o.items.forEach((item) => {
        const id = item.id;
        if (!productMap[id]) {
          productMap[id] = { name: item.name, amount: 0, quantity: 0 };
        }
        productMap[id].amount += item.price * item.quantity;
        productMap[id].quantity += item.quantity;
      });
    });
    return Object.values(productMap).sort((a, b) => b.amount - a.amount);
  };

  const salesByProduct = getSalesByProduct();

  // Format Currency
  const formatVal = (val: number) => {
    const converted = currency === 'USD' ? val / 83 : val;
    const sym = currency === 'USD' ? '$' : '₹';
    return `${sym}${Math.round(converted).toLocaleString(currency === 'USD' ? 'en-US' : 'en-IN')}`;
  };

  // ─── Custom Responsive SVG Line Chart (Sales over Time) ───
  const getChartPoints = () => {
    // Generate data points for the last 7 items/days or 12 hours based on range
    const pointsCount = timeRange === 'today' ? 12 : 7;
    const values: number[] = [];
    const comparisonValues: number[] = [];

    // Seed mock data for realistic graph curves if active database has few entries
    const baseCurve = timeRange === 'today' 
      ? [100, 300, 200, 800, 600, 900, 1200, 1400, 1100, 1600, 2200, 1900]
      : [1200, 2100, 1500, 3400, 2800, 4200, grossSales || 3500];

    const compCurve = timeRange === 'today'
      ? [50, 200, 400, 500, 700, 850, 900, 1100, 1300, 1200, 1700, 1500]
      : [900, 1600, 2100, 2600, 3100, 2900, (grossSales * 0.8) || 2800];

    for (let i = 0; i < pointsCount; i++) {
      values.push(baseCurve[i % baseCurve.length]);
      comparisonValues.push(compCurve[i % compCurve.length]);
    }

    const maxVal = Math.max(...values, ...comparisonValues, 100);
    const width = 800;
    const height = 240;
    const padding = 30;

    const getX = (index: number) => padding + (index * (width - padding * 2)) / (pointsCount - 1);
    const getY = (val: number) => height - padding - (val * (height - padding * 2)) / maxVal;

    let pathD = '';
    let fillD = '';
    let compPathD = '';

    values.forEach((val, idx) => {
      const x = getX(idx);
      const y = getY(val);
      if (idx === 0) {
        pathD = `M ${x} ${y}`;
        fillD = `M ${x} ${height - padding} L ${x} ${y}`;
      } else {
        pathD += ` L ${x} ${y}`;
      }
      if (idx === values.length - 1) {
        fillD += ` L ${x} ${y} L ${x} ${height - padding} Z`;
      } else {
        fillD += ` L ${x} ${y}`;
      }
    });

    comparisonValues.forEach((val, idx) => {
      const x = getX(idx);
      const y = getY(val);
      if (idx === 0) {
        compPathD = `M ${x} ${y}`;
      } else {
        compPathD += ` L ${x} ${y}`;
      }
    });

    const labels = timeRange === 'today' 
      ? ['12 AM', '2 AM', '4 AM', '6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM']
      : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return { pathD, fillD, compPathD, labels, getX, getY, values, comparisonValues };
  };

  const chart = getChartPoints();

  if (!authenticated) {
    return (
      <AdminLogin
        password={password}
        setPassword={setPassword}
        onSubmit={handleLogin}
        loading={loading}
        error={error}
        title="Analytics Admin"
      />
    );
  }

  return (
    <AdminShell
      title="Analytics"
      subtitle={`Last refreshed: ${lastRefreshed || 'Loading...'}`}
      storageMode={storageMode}
      onLogout={logout}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          {/* Time Range Selector */}
          <div className="bg-storeWhite border border-borderGray rounded-lg flex overflow-hidden shadow-sm">
            {(['today', 'yesterday', '7days', '30days'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-2 text-[10px] font-black uppercase tracking-wider transition-colors ${
                  timeRange === range ? 'bg-midnightNavy text-summitGold' : 'text-midnightNavy/60 hover:bg-cardGray'
                }`}
              >
                {range === '7days' ? 'Last 7 Days' : range === '30days' ? 'Last 30 Days' : range}
              </button>
            ))}
          </div>

          {/* Currency Switcher */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as 'INR' | 'USD')}
            className="bg-storeWhite border border-borderGray px-3 py-2 rounded-lg text-xs font-bold text-midnightNavy outline-none shadow-sm cursor-pointer"
          >
            <option value="INR">₹ INR</option>
            <option value="USD">$ USD</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={fetchData}
            className="p-2 border border-borderGray rounded-lg bg-storeWhite hover:bg-cardGray transition-colors shadow-sm"
            title="Refresh Data"
          >
            <svg className="w-4 h-4 text-midnightNavy" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M21 3v5h-5.18" />
            </svg>
          </button>
        </div>
      }
    >
      {/* ─── Metric Cards Grid ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Gross sales', value: formatVal(grossSales), change: '+12.4%', color: 'text-emerald-600' },
          { title: 'Returning customer rate', value: `${returningCustomerRate}%`, change: '0%', color: 'text-gray-500' },
          { title: 'Orders fulfilled', value: ordersFulfilled.toString(), change: '+8.3%', color: 'text-emerald-600' },
          { title: 'Total Orders', value: totalOrdersCount.toString(), change: '+15.2%', color: 'text-emerald-600' },
        ].map((card) => (
          <div key={card.title} className="bg-storeWhite rounded-2xl border border-borderGray p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold uppercase tracking-widest text-midnightNavy/50">{card.title}</p>
            <div className="flex items-baseline justify-between mt-2">
              <h2 className="text-2xl font-black text-midnightNavy tracking-tight">{card.value}</h2>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${card.color} bg-gray-50 border border-gray-100`}>
                {card.change}
              </span>
            </div>
            {/* Sparkline Graphic */}
            <div className="h-6 mt-4 opacity-70">
              <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path
                  d="M0,15 Q15,5 30,12 T60,2 T80,18 T100,8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-summitGold"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Main Graph & Details Layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart (Left Area) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-storeWhite rounded-2xl border border-borderGray p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-midnightNavy/50">Total sales over time</h3>
                <h2 className="text-2xl font-black text-midnightNavy mt-1">{formatVal(grossSales)}</h2>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-midnightNavy">
                  <span className="w-2.5 h-2.5 rounded-full bg-summitGold" />
                  Selected Period
                </span>
                <span className="flex items-center gap-1.5 text-midnightNavy/40">
                  <span className="w-2.5 h-2.5 rounded-full bg-midnightNavy/20" />
                  Previous Period
                </span>
              </div>
            </div>

            {/* Custom Responsive SVG Chart */}
            <div className="relative w-full aspect-[2.5/1] min-h-[220px]">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 800 240" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D4A843" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#D4A843" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                  const y = 30 + ratio * 180;
                  return (
                    <line key={ratio} x1="30" y1={y} x2="770" y2={y} stroke="#E2DDD4" strokeWidth="1" strokeDasharray="4 4" />
                  );
                })}

                {/* Comparison Line */}
                <path d={chart.compPathD} fill="none" stroke="#0A1628" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.25" />

                {/* Main Line & Area */}
                <path d={chart.fillD} fill="url(#chartGrad)" />
                <path d={chart.pathD} fill="none" stroke="#D4A843" strokeWidth="2.5" />

                {/* Graph Dots */}
                {chart.values.map((val, idx) => (
                  <circle
                    key={idx}
                    cx={chart.getX(idx)}
                    cy={chart.getY(val)}
                    r="4"
                    fill="#0A1628"
                    stroke="#D4A843"
                    strokeWidth="2"
                    className="cursor-pointer hover:r-6 transition-all"
                  />
                ))}

                {/* X Axis Labels */}
                {chart.labels.map((label, idx) => (
                  <text
                    key={idx}
                    x={chart.getX(idx)}
                    y="235"
                    textAnchor="middle"
                    fill="#0A1628"
                    className="text-[9px] font-black uppercase tracking-wider opacity-40"
                  >
                    {label}
                  </text>
                ))}
              </svg>
            </div>
          </div>

          {/* Average Order Value & Sales Channel Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Average Order Value */}
            <div className="bg-storeWhite rounded-2xl border border-borderGray p-5 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-widest text-midnightNavy/50">Average order value over time</h4>
              <div className="flex items-baseline justify-between mt-2 mb-4">
                <h2 className="text-xl font-black text-midnightNavy">{formatVal(averageOrderValue)}</h2>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
                  +3.8%
                </span>
              </div>
              <div className="h-10 opacity-70">
                <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path
                    d="M0,10 Q20,18 40,8 T80,15 T100,5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-summitGold"
                  />
                </svg>
              </div>
            </div>

            {/* Sales Channel */}
            <div className="bg-storeWhite rounded-2xl border border-borderGray p-5 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-widest text-midnightNavy/50">Total sales by sales channel</h4>
              <div className="space-y-3 mt-4 text-xs font-bold">
                <div className="flex items-center justify-between">
                  <span className="text-midnightNavy/70">Online Store</span>
                  <span className="text-midnightNavy">{formatVal(grossSales)}</span>
                </div>
                <div className="w-full bg-cardGray h-2 rounded-full overflow-hidden">
                  <div className="bg-summitGold h-full rounded-full" style={{ width: '100%' }} />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-midnightNavy/40">WhatsApp Orders (Manual)</span>
                  <span className="text-midnightNavy/40">{formatVal(0)}</span>
                </div>
                <div className="w-full bg-cardGray h-2 rounded-full overflow-hidden">
                  <div className="bg-summitGold h-full rounded-full" style={{ width: '0%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Breakdown Panel (Right Side) */}
        <div className="space-y-8">
          {/* Sales Breakdown */}
          <div className="bg-storeWhite rounded-2xl border border-borderGray p-6 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-midnightNavy/50 mb-4">Total sales breakdown</h3>
            <div className="divide-y divide-borderGray/60 text-xs font-bold">
              {[
                { label: 'Gross sales', value: formatVal(grossSales), muted: false },
                { label: 'Discounts', value: `-${formatVal(discounts)}`, muted: true },
                { label: 'Returns', value: `-${formatVal(returns)}`, muted: true },
                { label: 'Net sales', value: formatVal(netSales), muted: false },
                { label: 'Shipping charges', value: formatVal(shippingCharges), muted: false },
                { label: 'Return fees', value: formatVal(0), muted: true },
                { label: 'Taxes (GST 18%)', value: formatVal(taxes), muted: false },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-3">
                  <span className={item.muted ? 'text-midnightNavy/40 font-medium' : 'text-midnightNavy/70'}>
                    {item.label}
                  </span>
                  <span className={item.muted ? 'text-midnightNavy/50' : 'text-midnightNavy'}>
                    {item.value}
                  </span>
                </div>
              ))}
              <div className="flex justify-between py-4 text-sm font-black border-t-2 border-midnightNavy">
                <span>Total sales</span>
                <span className="text-summitGoldDark">{formatVal(totalSales)}</span>
              </div>
            </div>
          </div>

          {/* Sales by Product List */}
          <div className="bg-storeWhite rounded-2xl border border-borderGray p-6 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-midnightNavy/50 mb-4">Total sales by product</h3>
            {salesByProduct.length === 0 ? (
              <p className="text-xs text-midnightNavy/40 font-bold uppercase tracking-wider text-center py-6">
                No items sold yet.
              </p>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {salesByProduct.map((item) => (
                  <div key={item.name} className="flex items-center justify-between gap-3 text-xs font-bold">
                    <div className="min-w-0">
                      <p className="text-midnightNavy truncate">{item.name}</p>
                      <p className="text-[10px] text-midnightNavy/40 mt-0.5">{item.quantity} units sold</p>
                    </div>
                    <span className="text-midnightNavy shrink-0">{formatVal(item.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
