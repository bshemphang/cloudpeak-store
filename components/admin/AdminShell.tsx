'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import Logo from '../Logo';

const NAV = [
  { href: '/admin/products', label: 'Products', icon: '▦' },
  { href: '/admin/orders', label: 'Orders', icon: '◎' },
];

type AdminShellProps = {
  title: string;
  subtitle?: string;
  storageMode?: 'supabase' | 'file';
  children: ReactNode;
  actions?: ReactNode;
};

export default function AdminShell({ title, subtitle, storageMode, children, actions }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f0ede6] flex">
      <aside className="hidden md:flex w-56 lg:w-64 bg-midnightNavy flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-5 border-b border-summitGold/15">
          <Logo variant="plain" />
          <p className="text-summitGold/50 text-[10px] font-bold uppercase tracking-widest mt-3">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${
                pathname.startsWith(href)
                  ? 'bg-summitGold text-midnightNavy'
                  : 'text-storeWhite/70 hover:bg-midnightNavyLight hover:text-summitGold'
              }`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-summitGold/15 space-y-3">
          {storageMode && (
            <div className={`text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded-md ${
              storageMode === 'supabase'
                ? 'bg-green-900/40 text-green-300'
                : 'bg-amber-900/40 text-amber-300'
            }`}>
              {storageMode === 'supabase' ? '● Live DB (Vercel)' : '● Local files'}
            </div>
          )}
          <Link
            href="/"
            target="_blank"
            className="block text-center text-xs font-bold uppercase tracking-widest text-summitGold/70 hover:text-summitGold py-2"
          >
            View cloudpeak.in →
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-storeWhite border-b border-borderGray px-4 md:px-8 py-5 sticky top-0 z-40">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl text-midnightNavy uppercase tracking-wide">{title}</h1>
              {subtitle && <p className="text-sm text-midnightNavy/50 mt-0.5">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex md:hidden gap-1">
                {NAV.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded ${
                      pathname.startsWith(href) ? 'bg-midnightNavy text-summitGold' : 'bg-cardGray text-midnightNavy'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
              {actions}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
