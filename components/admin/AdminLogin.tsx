'use client';

type AdminLoginProps = {
  password: string;
  setPassword: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string;
  title?: string;
};

export default function AdminLogin({
  password,
  setPassword,
  onSubmit,
  loading,
  error,
  title = 'Admin',
}: AdminLoginProps) {
  return (
    <div className="min-h-screen bg-midnightNavy flex items-center justify-center px-4">
      <form onSubmit={onSubmit} className="bg-storeWhite p-8 md:p-10 w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="font-display text-3xl text-midnightNavy uppercase tracking-wide mb-2">{title}</h1>
          <p className="text-sm text-midnightNavy/60">Cloudpeak Admin Dashboard</p>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-midnightNavy/60 mb-2">
            Admin Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-borderGray px-4 py-3 text-sm outline-none focus:border-summitGold"
            placeholder="Enter admin password"
            required
          />
        </div>
        {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-midnightNavy text-summitGold py-4 text-sm font-black uppercase tracking-widest hover:bg-midnightNavyLight disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        <p className="text-xs text-midnightNavy/40 text-center leading-relaxed">
          Password is set in <code className="bg-cardGray px-1">.env.local</code> as{' '}
          <code className="bg-cardGray px-1">ADMIN_PASSWORD</code>.
          <br />
          After changing it, restart <code className="bg-cardGray px-1">npm run dev</code>.
        </p>
      </form>
    </div>
  );
}
