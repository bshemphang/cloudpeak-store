'use client';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'Culture' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { openCart, cart } = useCart();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const getLinkClass = (href: string) => {
    const isActive = href === '/' ? pathname === '/' : pathname?.startsWith(href);
    return isActive
      ? 'text-xs font-bold uppercase tracking-widest text-summitGold transition-colors'
      : 'text-xs font-bold uppercase tracking-widest text-storeWhite/70 hover:text-summitGold transition-colors';
  };

  const getMobileLinkClass = (href: string) => {
    const isActive = href === '/' ? pathname === '/' : pathname?.startsWith(href);
    return isActive
      ? 'block py-3 text-sm font-bold uppercase tracking-widest text-summitGold transition-colors border-b border-summitGold/10'
      : 'block py-3 text-sm font-bold uppercase tracking-widest text-storeWhite/80 hover:text-summitGold transition-colors border-b border-summitGold/10';
  };

  return (
    <nav className="sticky top-0 z-50 bg-midnightNavy border-b border-summitGold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 md:h-20 items-center">

          <Link href="/" className="flex items-center group">
            <Logo variant="navbar" />
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={getLinkClass(href)}
              >
                {label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/profile"
                  className={getLinkClass('/profile')}
                >
                  Account
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-xs font-bold uppercase tracking-widest text-storeWhite/70 hover:text-summitGold transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className={getLinkClass('/login')}
              >
                Sign In
              </Link>
            )}
            <button
              onClick={openCart}
              className="text-xs font-bold uppercase tracking-widest text-storeWhite/70 hover:text-summitGold flex items-center gap-2 transition-colors"
            >
              Cart
              {itemCount > 0 && (
                <span className="bg-summitGold text-midnightNavy px-2 py-0.5 rounded-full text-[10px] font-black">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex md:hidden items-center gap-4">
            <button
              onClick={openCart}
              className="text-storeWhite/70 hover:text-summitGold text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors"
            >
              Cart
              {itemCount > 0 && (
                <span className="bg-summitGold text-midnightNavy px-1.5 py-0.5 rounded-full text-[10px] font-black">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-summitGold p-1"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-summitGold/20 bg-midnightNavyLight px-4 py-4 space-y-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={getMobileLinkClass(href)}
            >
              {label}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className={getMobileLinkClass('/profile')}
              >
                My Account
              </Link>
              <button
                onClick={() => {
                  signOut();
                  setMobileOpen(false);
                }}
                className="block w-full text-left py-3 text-sm font-bold uppercase tracking-widest text-storeWhite/80 hover:text-summitGold transition-colors border-b border-summitGold/10 cursor-pointer"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className={getMobileLinkClass('/login')}
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
