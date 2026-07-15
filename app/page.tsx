import Link from 'next/link';
import TrendingGrid from '../components/TrendingGrid';
import MountainRidgeDivider from '../components/MountainRidgeDivider';
import ScrollReveal from '../components/ScrollReveal';
import SafeImage from '../components/SafeImage';
import { categoryImages } from '../lib/images';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cloudpeak | Premier Streetwear Drops',
  description: 'For The Culture. Shop exclusive streetwear, footwear, and apparel collections. Young, Rich, Visionary.',
  keywords: ['Cloudpeak', 'streetwear India', 'exclusive footwear India', 'streetwear drops', 'cloudpeak.in'],
  alternates: {
    canonical: 'https://cloudpeak.in',
  },
  openGraph: {
    title: 'Cloudpeak | Premier Streetwear Drops',
    description: 'For The Culture. Shop exclusive streetwear, footwear, and apparel collections.',
    url: 'https://cloudpeak.in',
    siteName: 'Cloudpeak',
    images: [
      {
        url: 'https://cloudpeak.in/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Cloudpeak Streetwear',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cloudpeak | Premier Streetwear Drops',
    description: 'For The Culture. Shop exclusive streetwear, footwear, and apparel collections.',
    images: ['https://cloudpeak.in/images/logo.png'],
  },
};

export default function Home() {
  const collectionCategories = [
    { title: "Men's Collection", img: categoryImages.men, category: 'Men' },
    { title: "Women's Collection", img: categoryImages.women, category: 'Women' },
    { title: "Kids' Collection", img: categoryImages.kids, category: 'Kids' },
  ];

  const organizationSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://cloudpeak.in/#organization",
        "name": "Cloudpeak",
        "url": "https://cloudpeak.in",
        "logo": "https://cloudpeak.in/images/logo-bg.png",
        "email": "cloudpeakindia@gmail.com",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "India",
          "addressRegion": "India",
          "addressCountry": "IN"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://cloudpeak.in/#website",
        "url": "https://cloudpeak.in",
        "name": "Cloudpeak",
        "publisher": {
          "@id": "https://cloudpeak.in/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://cloudpeak.in/shop?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <div className="bg-storeWhite min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

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
            India&apos;s Premier Hub for Streetwear and Exclusive Footwear.
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
            {/* Men (Left Column, Full Height) */}
            <div className="relative bg-midnightNavyLight group overflow-hidden flex items-center justify-center min-h-[350px] md:min-h-full">
              <SafeImage
                src={collectionCategories[0].img}
                alt={collectionCategories[0].title}
                priority
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-midnightNavy/40 group-hover:bg-midnightNavy/60 transition-colors duration-500" />
              <div className="relative z-10 text-center">
                <h2 className="font-display text-4xl md:text-6xl text-summitGold uppercase tracking-widest mb-4 drop-shadow-lg">
                  {collectionCategories[0].title}
                </h2>
                <Link
                  href={`/shop?category=${collectionCategories[0].category}`}
                  className="bg-summitGold text-midnightNavy px-8 py-3 text-xs font-bold uppercase hover:bg-summitGoldLight transition-colors shadow-lg"
                >
                  See Collection
                </Link>
              </div>
            </div>

            {/* Right Column (Women & Kids Split Vertically) */}
            <div className="grid grid-rows-2 gap-4">
              {/* Women */}
              <div className="relative bg-midnightNavyLight group overflow-hidden flex items-center justify-center min-h-[220px]">
                <SafeImage
                  src={collectionCategories[1].img}
                  alt={collectionCategories[1].title}
                  priority
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-midnightNavy/40 group-hover:bg-midnightNavy/60 transition-colors duration-500" />
                <div className="relative z-10 text-center">
                  <h2 className="font-display text-3xl text-summitGold uppercase tracking-widest mb-4 drop-shadow-lg">
                    {collectionCategories[1].title}
                  </h2>
                  <Link
                    href={`/shop?category=${collectionCategories[1].category}`}
                    className="bg-summitGold text-midnightNavy px-6 py-2.5 text-xs font-bold uppercase hover:bg-summitGoldLight transition-colors shadow-lg"
                  >
                    See Collection
                  </Link>
                </div>
              </div>

              {/* Kids */}
              <div className="relative bg-midnightNavyLight group overflow-hidden flex items-center justify-center min-h-[220px]">
                <SafeImage
                  src={collectionCategories[2].img}
                  alt={collectionCategories[2].title}
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-midnightNavy/40 group-hover:bg-midnightNavy/60 transition-colors duration-500" />
                <div className="relative z-10 text-center">
                  <h2 className="font-display text-3xl text-summitGold uppercase tracking-widest mb-4 drop-shadow-lg">
                    {collectionCategories[2].title}
                  </h2>
                  <Link
                    href={`/shop?category=${collectionCategories[2].category}`}
                    className="bg-summitGold text-midnightNavy px-6 py-2.5 text-xs font-bold uppercase hover:bg-summitGoldLight transition-colors shadow-lg"
                  >
                    See Collection
                  </Link>
                </div>
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
                  FOR THE CULTURE ◆ BREAK THE MOLD ◆ CLOUDPEAK ◆
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
