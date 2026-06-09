import Link from 'next/link'

export default function StoreFrontHero() {
  return (
    <div className="w-full bg-storeWhite">
      
      {/* Ticker Tape Marquee */}
      <div className="w-full bg-storeBlack text-storeWhite overflow-hidden py-3 border-y border-storeBlack flex whitespace-nowrap">
        <div className="animate-marquee flex space-x-8 items-center">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="font-bold tracking-[0.2em] uppercase text-sm md:text-base shrink-0">
              Shillong Born &bull; Premium Footwear &bull; Custom POD &bull; Trending Drops &bull; 
            </span>
          ))}
        </div>
      </div>

      {/* Massive Typographic Hero with Real Image */}
      <section className="relative h-[70vh] flex items-center justify-center bg-storeBlack overflow-hidden">
        
        {/* Real Streetwear Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=2000&auto=format&fit=crop" 
          alt="Streetwear Fashion" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
        />
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-6xl md:text-9xl font-black text-storeWhite uppercase tracking-tighter leading-none mb-6 drop-shadow-lg">
            Step Up. <br/> Stand Out.
          </h1>
          <p className="text-storeWhite/90 font-bold tracking-widest uppercase text-sm mb-10 drop-shadow-md">
            Exclusive Sneakers, Custom POD Apparel & Trending Gear
          </p>
          <Link href="/shop" className="bg-storeWhite text-storeBlack px-12 py-4 text-sm font-black uppercase tracking-widest hover:bg-storeBlack hover:text-storeWhite border-2 border-storeWhite transition-colors duration-300">
            Shop The Collection
          </Link>
        </div>
      </section>

    </div>
  )
}