import Link from 'next/link';
import MountainRidgeDivider from '../../components/MountainRidgeDivider';
import ScrollReveal from '../../components/ScrollReveal';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Story | Cloudpeak',
  description: 'Born from the unapologetic energy of the Northeast, Cloudpeak is a movement at the intersection of streetwear culture and premium e-commerce. Shillong Born. Globally Minded.',
  keywords: ['Cloudpeak story', 'Shillong streetwear', 'Northeast streetwear brand', 'POD clothing India'],
};

export default function About() {
  return (
    <div className="bg-storeWhite min-h-screen pb-24">

      <section className="bg-midnightNavy py-16 md:py-24 text-center px-4">
        <h1 className="font-display text-5xl md:text-8xl text-summitGold uppercase tracking-wide leading-none mb-6">
          For The Culture.
        </h1>
        <p className="text-summitGold/60 font-bold tracking-[0.3em] uppercase text-xs">
          Shillong Born ◆ Globally Minded
        </p>
      </section>

      <MountainRidgeDivider />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16">
        <ScrollReveal>
          <div className="bg-cardGray p-6 md:p-16 text-left border border-borderGray">

            <p className="font-display text-2xl md:text-5xl text-midnightNavy uppercase tracking-wide leading-snug mb-8">
              Born from the unapologetic energy of the Northeast, Cloudpeak isn&apos;t just retail. It&apos;s a movement.
            </p>

            <div className="space-y-6 text-sm text-midnightNavy/70 font-medium leading-relaxed">
              <p>
                We operate at the intersection of streetwear culture and premium e-commerce. Whether we are designing premium curated collections or engineering bespoke, high-quality Print-on-Demand (POD) apparel, our rigorous commitment to quality remains our northern star.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-borderGray my-8">
                <div>
                  <h3 className="font-bold text-summitGoldDark uppercase tracking-widest text-xs mb-3">The Mission</h3>
                  <p>To curate and deliver high-grade lifestyle pieces that empower the modern youth to walk with confidence and cultural pride.</p>
                </div>
                <div>
                  <h3 className="font-bold text-summitGoldDark uppercase tracking-widest text-xs mb-3">The Method</h3>
                  <p>A seamless digital experience paired with a highly vetted supply chain, ensuring every product represents peak performance and aesthetics.</p>
                </div>
              </div>

              <p>
                We don&apos;t follow trends; we curate them for the bold. Welcome to the peak.
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
