'use client';

import { useEffect, useState } from 'react';
import AdminLogin from '../../../components/admin/AdminLogin';
import AdminShell from '../../../components/admin/AdminShell';
import { useAdminAuth } from '../../../hooks/useAdminAuth';

type DiscountCode = {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  status: 'active' | 'expired';
  minRequirement: number;
  usageCount: number;
};

const defaultCodes: DiscountCode[] = [
  { id: '1', code: 'LAUNCH15', type: 'percentage', value: 15, status: 'active', minRequirement: 0, usageCount: 42 },
  { id: '2', code: 'STREETPRE', type: 'fixed', value: 500, status: 'active', minRequirement: 2500, usageCount: 18 },
  { id: '3', code: 'FREEKICKS', type: 'percentage', value: 10, status: 'expired', minRequirement: 4000, usageCount: 89 },
];

export default function DiscountsPage() {
  const { password, setPassword, authenticated, loading, error, login, logout } = useAdminAuth();
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Form Fields
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState(0);
  const [minRequirement, setMinRequirement] = useState(0);

  // Load from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cloudpeak-discounts');
      if (stored) {
        setCodes(JSON.parse(stored));
      } else {
        setCodes(defaultCodes);
        localStorage.setItem('cloudpeak-discounts', JSON.stringify(defaultCodes));
      }
    }
  }, []);

  const saveCodes = (updated: DiscountCode[]) => {
    setCodes(updated);
    localStorage.setItem('cloudpeak-discounts', JSON.stringify(updated));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    const newCode: DiscountCode = {
      id: Date.now().toString(),
      code: code.trim().toUpperCase(),
      type,
      value: Number(value),
      status: 'active',
      minRequirement: Number(minRequirement),
      usageCount: 0,
    };

    const updated = [newCode, ...codes];
    saveCodes(updated);
    setShowForm(false);
    setCode('');
    setValue(0);
    setMinRequirement(0);
  };

  const toggleStatus = (id: string) => {
    const updated = codes.map((c) => {
      if (c.id === id) {
        return { ...c, status: c.status === 'active' ? ('expired' as const) : ('active' as const) };
      }
      return c;
    });
    saveCodes(updated);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this discount code?')) return;
    const updated = codes.filter((c) => c.id !== id);
    saveCodes(updated);
  };

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
        title="Discounts Admin"
      />
    );
  }

  return (
    <AdminShell
      title="Discounts"
      subtitle="Promotional coupons and deals configuration"
      onLogout={logout}
      actions={
        !showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="bg-midnightNavy text-summitGold px-5 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-midnightNavyLight rounded-lg transition-all shadow-sm"
          >
            Create Discount
          </button>
        ) : null
      }
    >
      <div className="grid gap-8 grid-cols-1 xl:grid-cols-3">
        {/* Creator Form */}
        {showForm && (
          <div className="xl:col-span-1">
            <form onSubmit={handleCreate} className="bg-storeWhite border border-borderGray p-6 rounded-2xl shadow-sm space-y-5">
              <div className="flex justify-between items-center pb-2 border-b border-borderGray">
                <h3 className="text-xs font-black uppercase tracking-widest text-midnightNavy/50">New Discount Code</h3>
                <button type="button" onClick={() => setShowForm(false)} className="text-xs font-bold text-red-500 hover:underline">
                  Cancel
                </button>
              </div>

              <div>
                <label className="field-label">Coupon Code *</label>
                <input
                  required
                  placeholder="e.g. AUTUMN50"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="field-input rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Discount Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'percentage' | 'fixed')}
                    className="field-input rounded-lg"
                  >
                    <option value="percentage">% Percentage</option>
                    <option value="fixed">Fixed Amt (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="field-label">Value *</label>
                  <input
                    required
                    type="number"
                    min={0}
                    value={value || ''}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="field-input rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Minimum Subtotal Required (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={minRequirement || ''}
                  onChange={(e) => setMinRequirement(Number(e.target.value))}
                  className="field-input rounded-lg"
                  placeholder="e.g. 1500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-midnightNavy text-summitGold py-3.5 text-xs font-black uppercase tracking-widest hover:bg-midnightNavyLight rounded-lg transition-all"
              >
                Save Discount Code
              </button>
            </form>
          </div>
        )}

        {/* Coupon Codes List */}
        <div className={showForm ? 'xl:col-span-2' : 'xl:col-span-3'}>
          <div className="bg-storeWhite rounded-2xl border border-borderGray overflow-hidden shadow-sm">
            {codes.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-midnightNavy/50 font-bold uppercase tracking-widest text-sm">
                  No active discount codes yet. Create one above!
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-cardGray border-b border-borderGray text-midnightNavy/50 font-bold uppercase tracking-widest">
                    <th className="p-4">Coupon Code</th>
                    <th className="p-4">Type & Value</th>
                    <th className="p-4">Min. Requirement</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Usages</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderGray font-semibold text-midnightNavy">
                  {codes.map((c) => (
                    <tr key={c.id} className="hover:bg-cardGray/30 transition-colors">
                      <td className="p-4">
                        <span className="font-mono text-sm font-bold bg-midnightNavy/5 text-midnightNavy border border-midnightNavy/10 px-2.5 py-1 rounded">
                          {c.code}
                        </span>
                      </td>
                      <td className="p-4">
                        {c.type === 'percentage' ? `${c.value}% Off` : `₹${c.value.toLocaleString('en-IN')} Off`}
                      </td>
                      <td className="p-4 text-midnightNavy/60">
                        {c.minRequirement > 0 ? `₹${c.minRequirement.toLocaleString('en-IN')}` : 'None'}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => toggleStatus(c.id)}
                          className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                            c.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {c.status}
                        </button>
                      </td>
                      <td className="p-4 text-center text-midnightNavy/60">{c.usageCount} times</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="px-2 py-1 text-red-500 font-bold hover:bg-red-50 rounded transition-colors"
                        >
                          ✕ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
