import Link from 'next/link';
import SafeImage from './SafeImage';
import { categoryImages } from '../lib/images';

export default function StoreFrontHero() {
  return (
    <div className="w-full bg-storeWhite">

      <div className="w-full bg-midnightNavy text-summitGold overflow-hidden py-3 border-y border-summitGold/20 flex whitespace-nowrap">
        <div className="flex animate-marquee">
          {[0, 1].map((group) => (
            <div key={group} className="flex items-center gap-8 px-4 shrink-0">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="font-display tracking-[0.2em] uppercase text-sm md:text-base shrink-0">
                  Premium Streetwear ◆ Premium Footwear ◆ Trending Drops ◆
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className="relative h-[70vh] flex items-center justify-center bg-midnightNavy overflow-hidden">
        <SafeImage
          src={categoryImages.hero}
          alt="Streetwear Fashion"
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
        />

        <div className="relative z-10 text-center px-4">
          <h1 className="font-display text-6xl md:text-9xl text-storeWhite uppercase tracking-wide leading-none mb-6 drop-shadow-lg">
            Step Up. <br /> Stand Out.
          </h1>
          <p className="text-storeWhite/90 font-bold tracking-widest uppercase text-sm mb-10 drop-shadow-md">
            Exclusive Sneakers &amp; Trending Streetwear Gear
          </p>
          <Link href="/shop" className="bg-summitGold text-midnightNavy px-12 py-4 text-sm font-black uppercase tracking-widest hover:bg-summitGoldLight border-2 border-summitGold transition-colors duration-300">
            Shop The Collection
          </Link>
        </div>
      </section>

    </div>
  );
}
