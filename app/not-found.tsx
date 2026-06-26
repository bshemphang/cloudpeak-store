import Link from 'next/link';
import MountainRidgeDivider from '../components/MountainRidgeDivider';

export const metadata = {
  title: 'Page Not Found | Cloudpeak',
  description: 'The page you are looking for does not exist or has been moved to a different peak.',
};

export default function NotFound() {
  return (
    <div className="bg-storeWhite min-h-screen pb-24">
      {/* Top Banner */}
      <section className="bg-midnightNavy py-20 md:py-28 text-center px-4">
        <h1 className="font-display text-7xl md:text-9xl text-summitGold uppercase tracking-wide mb-4 animate-fade-up">
          404
        </h1>
        <p className="text-summitGold/60 font-bold tracking-[0.3em] uppercase text-xs animate-fade-up">
          Lost at the Summit
        </p>
      </section>

      <MountainRidgeDivider />

      {/* Main Content */}
      <section className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8">
        <div className="bg-cardGray border border-borderGray p-8 md:p-12 space-y-6">
          <h2 className="font-display text-3xl md:text-4xl text-midnightNavy uppercase tracking-wide">
            Peak Not Found
          </h2>
          <p className="text-sm text-midnightNavy/70 leading-relaxed font-medium">
            The trail you followed seems to have vanished, or the page you are looking for has been moved to a different peak.
          </p>

          <div className="h-px bg-borderGray w-full my-6" />

          <p className="text-xs font-bold uppercase tracking-widest text-midnightNavy/50">
            Let's get you back on track
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/shop"
              className="bg-midnightNavy text-summitGold px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-midnightNavyLight transition-colors text-center"
            >
              Shop Collection
            </Link>
            <Link
              href="/"
              className="border-2 border-midnightNavy text-midnightNavy px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-midnightNavy hover:text-summitGold transition-colors text-center"
            >
              Go Home
            </Link>
          </div>
        </div>

        {/* Quick Links Footer */}
        <div className="flex justify-center gap-6 text-xs font-bold uppercase tracking-widest text-midnightNavy/40">
          <Link href="/about" className="hover:text-summitGoldDark transition-colors">
            Our Story
          </Link>
          <span>◆</span>
          <Link href="/contact" className="hover:text-summitGoldDark transition-colors">
            Contact
          </Link>
          <span>◆</span>
          <Link href="/privacy-policy" className="hover:text-summitGoldDark transition-colors">
            Privacy
          </Link>
        </div>
      </section>
    </div>
  );
}
