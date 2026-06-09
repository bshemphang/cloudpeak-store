import Link from 'next/link';
import TrendingGrid from '../components/TrendingGrid';

export default function Home() {
  return (
    <div className="bg-storeWhite min-h-screen">
      
      {/* --- 1. HERO WITH BACKGROUND VIDEO --- */}
      <section className="relative w-full h-[85vh] overflow-hidden bg-storeBlack">
        {/* Background Video using a reliable, unblocked source */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        
        {/* Text Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
          <p className="text-storeWhite tracking-[0.3em] uppercase text-xs md:text-sm font-bold mb-4 drop-shadow-md">
            Young - Rich - Visionary
          </p>
          <h1 className="text-8xl md:text-[12rem] font-black text-storeWhite leading-none tracking-tighter drop-shadow-2xl">
            2026
          </h1>
          <p className="text-storeWhite/80 mt-6 font-medium tracking-widest uppercase text-sm mb-10 max-w-xl mx-auto">
            Meghalaya&apos;s Premier Hub for Streetwear, Custom POD, and Exclusive Footwear.
          </p>
          <Link href="/shop" className="bg-storeWhite text-storeBlack px-10 py-4 text-xs font-black uppercase tracking-widest hover:bg-storeWhite/90 transition-colors shadow-xl">
            Enter The Shop
          </Link>
        </div>
      </section>

      {/* --- 2. VALUE PROPS --- */}
      <div className="border-b border-borderGray py-10 bg-storeWhite">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div><div className="text-2xl mb-2">&#128230;</div><h4 className="font-bold text-storeBlack text-xs uppercase tracking-widest mb-1">Free Shipping</h4><p className="text-[10px] text-storeBlack/60 uppercase font-bold tracking-wider">Pan-India delivery included.</p></div>
          <div><div className="text-2xl mb-2">&#8635;</div><h4 className="font-bold text-storeBlack text-xs uppercase tracking-widest mb-1">Free Returns</h4><p className="text-[10px] text-storeBlack/60 uppercase font-bold tracking-wider">15-day hassle-free returns.</p></div>
          <div><div className="text-2xl mb-2">&#128101;</div><h4 className="font-bold text-storeBlack text-xs uppercase tracking-widest mb-1">Support Online</h4><p className="text-[10px] text-storeBlack/60 uppercase font-bold tracking-wider">24/7 dedicated service.</p></div>
        </div>
      </div>

      {/* --- 3. THE COLLECTION "BENTO" GRID --- */}
      <section className="py-4 bg-storeWhite">
        <div className="max-w-[1600px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-4 h-auto md:h-[600px]">
          <div className="relative bg-cardGray group overflow-hidden flex items-center justify-center min-h-[400px] md:min-h-full">
             <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop" alt="Hoodies" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"/>
             <div className="absolute inset-0 bg-storeBlack/20 group-hover:bg-storeBlack/40 transition-colors duration-500"></div>
             <div className="relative z-10 text-center">
               <h2 className="text-4xl md:text-5xl font-black text-storeWhite uppercase tracking-widest mb-4 drop-shadow-lg">Hoodies</h2>
               <Link href="/shop" className="bg-storeWhite text-storeBlack px-8 py-3 text-xs font-bold uppercase hover:bg-storeBlack hover:text-storeWhite transition-colors shadow-lg">See Collection</Link>
             </div>
          </div>
          <div className="grid grid-rows-2 gap-4">
             <div className="relative bg-cardGray group overflow-hidden flex items-center justify-center min-h-[250px]">
               <img src="https://images.unsplash.com/photo-1521223830114-4c070c73a3c2?q=80&w=800&auto=format&fit=crop" alt="Accessories" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"/>
               <div className="absolute inset-0 bg-storeBlack/20 group-hover:bg-storeBlack/40 transition-colors duration-500"></div>
               <div className="relative z-10 text-center">
                 <h2 className="text-3xl font-black text-storeWhite uppercase tracking-widest mb-4 drop-shadow-lg">Accessories</h2>
                 <Link href="/shop" className="bg-storeWhite text-storeBlack px-6 py-2 text-xs font-bold uppercase hover:bg-storeBlack hover:text-storeWhite transition-colors shadow-lg">See Collection</Link>
               </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div className="relative bg-cardGray group overflow-hidden flex items-center justify-center min-h-[250px]">
                  <img src="https://images.unsplash.com/photo-1534215754734-18e55d13e346?q=80&w=400&auto=format&fit=crop" alt="Hats" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"/>
                  <div className="absolute inset-0 bg-storeBlack/20 group-hover:bg-storeBlack/40 transition-colors duration-500"></div>
                  <div className="relative z-10 text-center">
                   <h2 className="text-2xl font-black text-storeWhite uppercase tracking-widest mb-4 drop-shadow-lg">Hats</h2>
                   <Link href="/shop" className="bg-storeWhite text-storeBlack px-4 py-2 text-[10px] font-bold uppercase hover:bg-storeBlack hover:text-storeWhite transition-colors shadow-lg">See Collection</Link>
                 </div>
               </div>
               <div className="relative bg-cardGray group overflow-hidden flex items-center justify-center min-h-[250px]">
                  <img src="https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=400&auto=format&fit=crop" alt="Jackets" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"/>
                  <div className="absolute inset-0 bg-storeBlack/20 group-hover:bg-storeBlack/40 transition-colors duration-500"></div>
                  <div className="relative z-10 text-center">
                   <h2 className="text-2xl font-black text-storeWhite uppercase tracking-widest mb-4 drop-shadow-lg">Jackets</h2>
                   <Link href="/shop" className="bg-storeWhite text-storeBlack px-4 py-2 text-[10px] font-bold uppercase hover:bg-storeBlack hover:text-storeWhite transition-colors shadow-lg">See Collection</Link>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- 4. MARQUEE DIVIDER --- */}
      <div className="w-full bg-storeBlack text-storeWhite overflow-hidden py-4 my-10 flex whitespace-nowrap">
        <div className="animate-marquee flex space-x-8 items-center">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="font-bold tracking-[0.2em] uppercase text-xl shrink-0">FOR THE CULTURE &bull; BREAK THE MOLD &bull;</span>
          ))}
        </div>
      </div>

      {/* --- 5. INTERACTIVE TRENDING GRID --- */}
      <TrendingGrid />

    </div>
  );
}