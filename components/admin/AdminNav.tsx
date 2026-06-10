'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/orders', label: 'Orders' },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 bg-midnightNavyLight rounded-lg p-1">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-colors ${
            pathname.startsWith(href)
              ? 'bg-summitGold text-midnightNavy'
              : 'text-storeWhite/70 hover:text-summitGold'
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
