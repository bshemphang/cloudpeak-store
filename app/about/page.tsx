import Link from 'next/link';
import MountainRidgeDivider from '../../components/MountainRidgeDivider';
import ScrollReveal from '../../components/ScrollReveal';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Story | Cloudpeak',
  description: 'Cloudpeak is a movement at the intersection of streetwear and premium e-commerce. Curated for you.',
  keywords: ['Cloudpeak story', 'streetwear brand', 'clothing India'],
};

export default function About() {
  return (
    <div className="bg-storeWhite min-h-screen pb-24">

      <section className="bg-midnightNavy py-16 md:py-24 text-center px-4">
        <h1 className="font-display text-5xl md:text-8xl text-summitGold uppercase tracking-wide leading-none mb-6">
          Our Story.
        </h1>
        <p className="text-summitGold/60 font-bold tracking-[0.3em] uppercase text-xs">
          Globally Minded ◆ India Born
        </p>
      </section>

      <MountainRidgeDivider />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16">
        <ScrollReveal>
          <div className="bg-cardGray p-6 md:p-16 text-left border border-borderGray">

            <p className="font-display text-2xl md:text-5xl text-midnightNavy uppercase tracking-wide leading-snug mb-8">
              Cloudpeak is a movement at the intersection of streetwear and premium e-commerce.
            </p>

            <div className="space-y-6 text-sm text-midnightNavy/70 font-medium leading-relaxed">
              <p>
                We design and curate premium collections, ensuring our rigorous commitment to quality remains our northern star. We believe in providing premium apparel that speaks to the bold and the visionary.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-borderGray my-8">
                <div>
                  <h3 className="font-bold text-summitGoldDark uppercase tracking-widest text-xs mb-3">Our Mission</h3>
                  <p>To curate and deliver high-grade streetwear and lifestyle pieces that empower you to express your unique style with confidence.</p>
                </div>
                <div>
                  <h3 className="font-bold text-summitGoldDark uppercase tracking-widest text-xs mb-3">Our Vision</h3>
                  <p>Combining premium fabrics with clean designs, ensuring every drop represents peak aesthetic expression and durability.</p>
                </div>
              </div>

              <p>
                We don&apos;t follow trends; we curate them. Welcome to the peak.
              </p>
            </div>

            <div className="mt-12">
              <Link
                href="/contact"
                className="inline-block border-2 border-midnightNavy text-midnightNavy font-bold uppercase tracking-widest text-xs px-10 py-4 hover:bg-midnightNavy hover:text-summitGold transition-colors"
              >
                Connect With Us
              </Link>
            </div>

          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}
