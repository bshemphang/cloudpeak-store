import Link from 'next/link'

export default function Contact() {
  // Remember to replace this with your actual WhatsApp Business number (e.g., 919876543210)
  const whatsappNumber = "910000000000"; 
  const defaultMessage = "Hi Cloudpeak! I'm interested in the latest drops. Can you help me out?";
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="bg-storeWhite min-h-screen pb-24">
      
      {/* --- CONTACT HEADER --- */}
      <section className="bg-cardGray py-24 border-b border-borderGray text-center px-4">
        <h1 className="text-5xl md:text-7xl font-black text-storeBlack uppercase tracking-tighter mb-4">
          Hit Us Up
        </h1>
        <p className="text-storeBlack/60 text-sm font-medium tracking-widest uppercase max-w-2xl mx-auto">
          Direct, uncompromising support for the Cloudpeak community.
        </p>
      </section>

      {/* --- CONTACT GRID --- */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* WhatsApp VIP Line */}
          <div className="bg-storeWhite p-10 border border-borderGray group hover:border-storeBlack transition-colors duration-300 flex flex-col justify-between h-full">
            <div>
              <h2 className="text-2xl font-black text-storeBlack uppercase tracking-widest mb-4">VIP WhatsApp</h2>
              <p className="text-storeBlack/70 text-sm mb-8 leading-relaxed font-medium">
                Skip the wait. Connect instantly with our styling and support team via WhatsApp for personalized assistance, order tracking, and exclusive POD inquiries.
              </p>
            </div>
            <a 
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-storeBlack text-storeWhite font-bold uppercase tracking-widest text-xs px-8 py-4 hover:bg-storeBlack/80 transition-colors w-full"
            >
              Start Chat
            </a>
          </div>

          {/* Corporate & Collabs */}
          <div className="bg-cardGray p-10 border border-borderGray flex flex-col justify-between h-full">
            <div>
              <h2 className="text-2xl font-black text-storeBlack uppercase tracking-widest mb-4">Collabs & B2B</h2>
              <p className="text-storeBlack/70 text-sm mb-8 leading-relaxed font-medium">
                For brand partnerships, bulk Print-on-Demand orders, and media inquiries, our corporate team is ready to build. 
              </p>
            </div>
            <div className="space-y-4 border-t border-borderGray pt-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-storeBlack/50 mb-1">Email</p>
                <a href="mailto:collabs@cloudpeak.in" className="text-storeBlack font-bold uppercase tracking-widest text-sm hover:underline">collabs@cloudpeak.in</a>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-storeBlack/50 mb-1">HQ</p>
                <p className="text-storeBlack font-bold uppercase tracking-widest text-sm">Shillong, Meghalaya</p>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  )
}