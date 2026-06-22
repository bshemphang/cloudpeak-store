'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import Logo from '../Logo';

// ─── SVG Icons ───
const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const OrdersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const ProductsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CustomersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const DiscountsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v16m-6 0a2 2 0 002 2h2a2 2 0 002-2" />
  </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

type SubItem = { href: string; label: string };
type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  subItems?: SubItem[];
};

type AdminShellProps = {
  title: string;
  subtitle?: string;
  storageMode?: 'supabase' | 'file';
  children: ReactNode;
  actions?: ReactNode;
  onLogout?: () => void;
};

export default function AdminShell({ title, subtitle, storageMode, children, actions, onLogout }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // States to control collapsible menus
  const [productsOpen, setProductsOpen] = useState(true);
  const [ordersOpen, setOrdersOpen] = useState(true);
  const [analyticsOpen, setAnalyticsOpen] = useState(true);

  const navItems: NavItem[] = [
    { href: '/admin/analytics', label: 'Home', icon: <HomeIcon /> },
    {
      href: '/admin/orders',
      label: 'Orders',
      icon: <OrdersIcon />,
      subItems: [
        { href: '/admin/orders', label: 'All Orders' },
        { href: '/admin/orders?filter=pending', label: 'Drafts' },
        { href: '/admin/orders?filter=paid', label: 'Abandoned checkouts' }
      ]
    },
    {
      href: '/admin/products',
      label: 'Products',
      icon: <ProductsIcon />,
      subItems: [
        { href: '/admin/products', label: 'Collections' },
        { href: '/admin/products?tab=inventory', label: 'Inventory' },
      ]
    },
    { href: '/admin/customers', label: 'Customers', icon: <CustomersIcon /> },
    { href: '/admin/discounts', label: 'Discounts', icon: <DiscountsIcon /> },
    {
      href: '/admin/analytics',
      label: 'Analytics',
      icon: <AnalyticsIcon />,
      subItems: [
        { href: '/admin/analytics', label: 'Reports' },
        { href: '/admin/analytics/live-view', label: 'Live View' }
      ]
    }
  ];

  const handleSubToggle = (label: string, e: React.MouseEvent) => {
    if (label === 'Products') {
      e.preventDefault();
      setProductsOpen(!productsOpen);
    } else if (label === 'Orders') {
      e.preventDefault();
      setOrdersOpen(!ordersOpen);
    } else if (label === 'Analytics') {
      e.preventDefault();
      setAnalyticsOpen(!analyticsOpen);
    }
  };

  const isSubOpen = (label: string) => {
    if (label === 'Products') return productsOpen;
    if (label === 'Orders') return ordersOpen;
    if (label === 'Analytics') return analyticsOpen;
    return false;
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-gray-300">
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <div>
          <Logo variant="plain" />
          <p className="text-summitGold text-[10px] font-black uppercase tracking-widest mt-2">Cloudpeak Store</p>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto space-y-1 scrollbar-thin">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.subItems && pathname.startsWith(item.href) && !pathname.endsWith('live-view'));
          const hasSubs = !!item.subItems;
          const open = isSubOpen(item.label);

          return (
            <div key={item.label} className="space-y-1">
              {hasSubs ? (
                <button
                  onClick={(e) => handleSubToggle(item.label, e)}
                  className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all hover:bg-white/5 hover:text-white ${
                    isActive ? 'bg-white/5 text-summitGold' : 'text-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-summitGold' : 'text-gray-400'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <ChevronIcon open={open} />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all hover:bg-white/5 hover:text-white ${
                    isActive ? 'bg-summitGold text-midnightNavy' : 'text-gray-400'
                  }`}
                >
                  <span className={isActive ? 'text-midnightNavy' : 'text-gray-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )}

              {hasSubs && open && item.subItems && (
                <div className="pl-9 space-y-1">
                  {item.subItems.map((sub) => {
                    const isSubActive = pathname === sub.href;
                    return (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        className={`block py-1.5 text-[11px] font-medium tracking-wide transition-all hover:text-white ${
                          isSubActive ? 'text-summitGold font-bold' : 'text-gray-400/80'
                        }`}
                      >
                        {sub.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-3 bg-[#181818]">
        {storageMode && (
          <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-md flex items-center gap-2 ${
            storageMode === 'supabase'
              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/20'
              : 'bg-amber-950/60 text-amber-400 border border-amber-500/20'
          }`}>
            <span className={`w-2 h-2 rounded-full animate-pulse ${
              storageMode === 'supabase' ? 'bg-emerald-400' : 'bg-amber-400'
            }`} />
            <span>{storageMode === 'supabase' ? 'Supabase Connected' : 'Local JSON Dev Mode'}</span>
          </div>
        )}
        <Link
          href="/"
          target="_blank"
          className="block text-center text-[10px] font-black uppercase tracking-widest text-summitGold/80 hover:text-summitGold border border-summitGold/20 hover:border-summitGold/50 py-2.5 rounded-lg transition-all"
        >
          View Live Storefront →
        </Link>
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 text-center text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/50 py-2.5 rounded-lg transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f7f6f2] flex text-midnightNavy">
      {/* ─── Sidebar for desktop ─── */}
      <aside className="hidden md:flex w-56 lg:w-64 flex-col shrink-0 sticky top-0 h-screen border-r border-borderGray">
        {sidebarContent}
      </aside>

      {/* ─── Mobile overlay sidebar ─── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
          <aside className="relative w-64 max-w-sm flex-col bg-midnightNavy z-50 h-full animate-slide-in">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* ─── Main contents area ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-storeWhite border-b border-borderGray px-4 md:px-8 py-4 sticky top-0 z-40 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden hover:bg-cardGray rounded-lg"
              title="Open Navigation menu"
            >
              <svg className="w-6 h-6 text-midnightNavy" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="font-display text-2xl text-midnightNavy uppercase tracking-wide leading-none">{title}</h1>
              {subtitle && <p className="text-xs text-midnightNavy/50 mt-1 font-semibold">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {actions}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
