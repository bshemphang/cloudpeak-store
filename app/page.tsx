import Link from 'next/link';
import TrendingGrid from '../components/TrendingGrid';
import MountainRidgeDivider from '../components/MountainRidgeDivider';
import ScrollReveal from '../components/ScrollReveal';
import SafeImage from '../components/SafeImage';
import { categoryImages } from '../lib/images';

export default function Home() {
  const collectionCategories = [
    { title: 'Hoodies', img: categoryImages.hoodies, large: true },
    { title: 'Accessories', img: categoryImages.accessories, large: false },
    { title: 'Hats', img: categoryImages.hats, large: false },
    { title: 'Jackets', img: categoryImages.jackets, large: false },
  ];

  return (
    <div className="bg-storeWhite min-h-screen">

      <section className="relative w-full h-[75vh] md:h-[85vh] overflow-hidden bg-midnightNavy">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={categoryImages.hero}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-midnightNavy/70 via-midnightNavy/30 to-midnightNavy" />

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
          <p className="text-summitGold tracking-[0.3em] uppercase text-xs md:text-sm font-bold mb-4 drop-shadow-md">
            Young — Rich — Visionary
          </p>
          <h1 className="font-display text-7xl sm:text-8xl md:text-[12rem] text-storeWhite leading-none tracking-wide drop-shadow-2xl">
            2026
          </h1>
          <p className="text-storeWhite/80 mt-6 font-medium tracking-widest uppercase text-xs md:text-sm mb-10 max-w-xl mx-auto">
            Meghalaya&apos;s Premier Hub for Streetwear, Custom POD, and Exclusive Footwear.
          </p>
          <Link
            href="/shop"
            className="bg-summitGold text-midnightNavy px-8 md:px-10 py-3 md:py-4 text-xs font-black uppercase tracking-widest hover:bg-summitGoldLight transition-colors shadow-xl"
          >
            Enter The Shop
          </Link>
        </div>
      </section>

      <MountainRidgeDivider />

      <ScrollReveal>
        <div className="py-10 md:py-12 bg-storeWhite">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: '📦', title: 'Free Shipping', desc: 'Pan-India delivery included.' },
              { icon: '↩', title: 'Free Returns', desc: '15-day hassle-free returns.' },
              { icon: '💬', title: 'Support Online', desc: '24/7 dedicated service.' },
            ].map((item) => (
              <div key={item.title}>
                <div className="text-2xl mb-2">{item.icon}</div>
                <h4 className="font-display text-lg text-midnightNavy uppercase tracking-widest mb-1">{item.title}</h4>
                <p className="text-[10px] text-midnightNavy/60 uppercase font-bold tracking-wider">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <MountainRidgeDivider flip />

      <ScrollReveal>
        <section className="py-4 bg-midnightNavy">
          <div className="max-w-[1600px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-4 h-auto md:h-[600px]">
            <div className="relative bg-midnightNavyLight group overflow-hidden flex items-center justify-center min-h-[350px] md:min-h-full">
              <SafeImage
                src={collectionCategories[0].img}
                alt="Hoodies"
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-midnightNavy/40 group-hover:bg-midnightNavy/60 transition-colors duration-500" />
              <div className="relative z-10 text-center">
                <h2 className="font-display text-4xl md:text-6xl text-summitGold uppercase tracking-widest mb-4 drop-shadow-lg">Hoodies</h2>
                <Link href="/shop" className="bg-summitGold text-midnightNavy px-8 py-3 text-xs font-bold uppercase hover:bg-summitGoldLight transition-colors shadow-lg">See Collection</Link>
              </div>
            </div>
            <div className="grid grid-rows-2 gap-4">
              <div className="relative bg-midnightNavyLight group overflow-hidden flex items-center justify-center min-h-[220px]">
                <SafeImage
                  src={collectionCategories[1].img}
                  alt="Accessories"
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-midnightNavy/40 group-hover:bg-midnightNavy/60 transition-colors duration-500" />
                <div className="relative z-10 text-center">
                  <h2 className="font-display text-3xl text-summitGold uppercase tracking-widest mb-4 drop-shadow-lg">Accessories</h2>
                  <Link href="/shop" className="bg-summitGold text-midnightNavy px-6 py-2 text-xs font-bold uppercase hover:bg-summitGoldLight transition-colors shadow-lg">See Collection</Link>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {collectionCategories.slice(2).map((cat) => (
                  <div key={cat.title} className="relative bg-midnightNavyLight group overflow-hidden flex items-center justify-center min-h-[220px]">
                    <SafeImage
                      src={cat.img}
                      alt={cat.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-midnightNavy/40 group-hover:bg-midnightNavy/60 transition-colors duration-500" />
                    <div className="relative z-10 text-center">
                      <h2 className="font-display text-2xl text-summitGold uppercase tracking-widest mb-4 drop-shadow-lg">{cat.title}</h2>
                      <Link href="/shop" className="bg-summitGold text-midnightNavy px-4 py-2 text-[10px] font-bold uppercase hover:bg-summitGoldLight transition-colors shadow-lg">See Collection</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <MountainRidgeDivider />

      <div className="w-full bg-midnightNavy text-summitGold overflow-hidden py-4 my-0">
        <div className="flex animate-marquee whitespace-nowrap">
          {[0, 1].map((group) => (
            <div key={group} className="flex items-center gap-8 px-4 shrink-0">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="font-display tracking-[0.2em] uppercase text-lg md:text-xl shrink-0">
                  FOR THE CULTURE ◆ BREAK THE MOLD ◆ SHILLONG BORN ◆
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <MountainRidgeDivider flip />

      <TrendingGrid />

    </div>
  );
}
