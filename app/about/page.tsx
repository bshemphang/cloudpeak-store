import Link from 'next/link'

export default function About() {
  return (
    <div className="bg-storeWhite min-h-screen pb-24">
      
      {/* --- CULTURE HERO --- */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 text-center">
        <h1 className="text-5xl md:text-8xl font-black text-storeBlack uppercase tracking-tighter leading-none mb-8">
          For The <br/> Culture.
        </h1>
        <p className="text-storeBlack/50 font-bold tracking-[0.3em] uppercase text-xs mb-16">
          Shillong Born &bull; Globally Minded
        </p>
        
        {/* --- BRAND MANIFESTO BOX --- */}
        <div className="bg-cardGray p-8 md:p-16 text-left border border-borderGray">
          
          <p className="text-2xl md:text-4xl font-black text-storeBlack uppercase tracking-tight leading-snug mb-8">
            Born from the unapologetic energy of the Northeast, Cloudpeak isn&apos;t just retail. It&apos;s a movement.
          </p>
          
          <div className="space-y-6 text-sm text-storeBlack/70 font-medium leading-relaxed">
            <p>
              We operate at the intersection of streetwear culture and premium e-commerce. Whether we are sourcing trending dropshipping sneakers or engineering bespoke Print-on-Demand (POD) apparel, our rigorous commitment to quality remains our northern star.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-borderGray my-8">
              <div>
                <h3 className="font-bold text-storeBlack uppercase tracking-widest text-xs mb-3">The Mission</h3>
                <p>To curate and deliver high-grade lifestyle pieces that empower the modern youth to walk with confidence and cultural pride.</p>
              </div>
              <div>
                <h3 className="font-bold text-storeBlack uppercase tracking-widest text-xs mb-3">The Method</h3>
                <p>A seamless digital experience paired with a highly vetted supply chain, ensuring every product represents peak performance and aesthetics.</p>
              </div>
            </div>

            <p>
              We don&apos;t follow trends; we curate them for the bold. Welcome to the peak.
            </p>
          </div>

          <div className="mt-12">
            <Link href="/contact" className="inline-block border-2 border-storeBlack text-storeBlack font-bold uppercase tracking-widest text-xs px-10 py-4 hover:bg-storeBlack hover:text-storeWhite transition-colors">
              Connect With Us
            </Link>
          </div>

        </div>
      </section>

    </div>
  )
}