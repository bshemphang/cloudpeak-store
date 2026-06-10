import Link from 'next/link';
import type { ReactNode } from 'react';
import MountainRidgeDivider from './MountainRidgeDivider';
import { SITE } from '../lib/site';

type PolicyLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function PolicyLayout({ title, subtitle, children }: PolicyLayoutProps) {
  return (
    <div className="bg-storeWhite min-h-screen pb-24">
      <section className="bg-midnightNavy py-14 md:py-20 text-center px-4">
        <h1 className="font-display text-4xl md:text-6xl text-summitGold uppercase tracking-wide mb-3">
          {title}
        </h1>
        <p className="text-storeWhite/60 text-sm font-medium tracking-widest uppercase max-w-2xl mx-auto">
          {subtitle}
        </p>
        <p className="text-summitGold/50 text-xs mt-4 uppercase tracking-widest">
          Last updated: {SITE.lastPolicyUpdate}
        </p>
      </section>

      <MountainRidgeDivider />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 prose-policy">
        {children}

        <div className="mt-16 pt-8 border-t border-borderGray">
          <p className="text-sm text-midnightNavy/60 leading-relaxed">
            Questions about this policy? Contact us at{' '}
            <a href={`mailto:${SITE.email}`} className="text-summitGoldDark font-bold hover:underline">
              {SITE.email}
            </a>{' '}
            or visit our{' '}
            <Link href="/contact" className="text-summitGoldDark font-bold hover:underline">
              contact page
            </Link>
            .
          </p>
        </div>
      </article>
    </div>
  );
}
