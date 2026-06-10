import MountainRidgeDivider from '../../components/MountainRidgeDivider';
import ScrollReveal from '../../components/ScrollReveal';
import { generateInquiryMessage, getWhatsAppLink } from '../../lib/whatsapp';

export default function Contact() {
  const waLink = getWhatsAppLink(generateInquiryMessage());

  return (
    <div className="bg-storeWhite min-h-screen pb-24">

      <section className="bg-midnightNavy py-16 md:py-24 text-center px-4">
        <h1 className="font-display text-5xl md:text-8xl text-summitGold uppercase tracking-wide mb-4">
          Hit Us Up
        </h1>
        <p className="text-storeWhite/60 text-sm font-medium tracking-widest uppercase max-w-2xl mx-auto">
          Direct, uncompromising support for the Cloudpeak community.
        </p>
      </section>

      <MountainRidgeDivider />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

          <ScrollReveal>
            <div className="bg-storeWhite p-8 md:p-10 border border-borderGray group hover:border-summitGold transition-colors duration-300 flex flex-col justify-between h-full">
              <div>
                <h2 className="font-display text-2xl text-midnightNavy uppercase tracking-widest mb-4">VIP WhatsApp</h2>
                <p className="text-midnightNavy/70 text-sm mb-8 leading-relaxed font-medium">
                  Skip the wait. Connect instantly with our styling and support team via WhatsApp for personalized assistance, order tracking, and exclusive POD inquiries.
                </p>
              </div>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-center bg-[#25D366] text-white font-bold uppercase tracking-widest text-xs px-8 py-4 hover:bg-[#1fb855] transition-colors w-full"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Start Chat
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <div className="bg-cardGray p-8 md:p-10 border border-borderGray flex flex-col justify-between h-full">
              <div>
                <h2 className="font-display text-2xl text-midnightNavy uppercase tracking-widest mb-4">Collabs & B2B</h2>
                <p className="text-midnightNavy/70 text-sm mb-8 leading-relaxed font-medium">
                  For brand partnerships, bulk Print-on-Demand orders, and media inquiries, our corporate team is ready to build.
                </p>
              </div>
              <div className="space-y-4 border-t border-borderGray pt-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-midnightNavy/50 mb-1">Email</p>
                  <a href="mailto:collabs@cloudpeak.in" className="text-midnightNavy font-bold uppercase tracking-widest text-sm hover:text-summitGoldDark transition-colors">collabs@cloudpeak.in</a>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-midnightNavy/50 mb-1">HQ</p>
                  <p className="text-midnightNavy font-bold uppercase tracking-widest text-sm">Shillong, Meghalaya</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

    </div>
  );
}
