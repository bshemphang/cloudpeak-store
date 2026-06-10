import './globals.css'
import { Inter, Bebas_Neue } from 'next/font/google'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import CartSidebar from '../components/CartSidebar'
import AnnouncementBar from '../components/AnnouncementBar'
import CustomCursor from '../components/CustomCursor'
import WhatsAppButton from '../components/WhatsAppButton'
import Logo from '../components/Logo'
import { CartProvider } from '../context/CartContext'
import Newsletter from '../components/Newsletter'
import { SITE } from '../lib/site'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas' })

export const metadata = {
  title: 'Cloudpeak | Premier Streetwear & POD',
  description: 'Shillong Born. For The Culture. Shop exclusive footwear, POD, and dropshipping apparel.',
  icons: {
    icon: SITE.logo,
    apple: SITE.logo,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${bebasNeue.variable} bg-storeWhite text-midnightNavy font-sans antialiased min-h-screen flex flex-col`}>

        <CartProvider>
          <CustomCursor />
          <AnnouncementBar />
          <Navbar />
          <CartSidebar />
          <WhatsAppButton />

          <main className="flex-grow">
            {children}
          </main>

          <footer className="mt-auto">
            <Newsletter />

            <div className="bg-midnightNavy text-storeWhite py-16 md:py-20 px-4">
              <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12">
                <div className="space-y-6">
                  <Logo variant="footer" />
                  <p className="text-storeWhite/50 text-sm leading-relaxed font-medium">
                    {SITE.location}<br />WhatsApp: +91 00000 00000<br />{SITE.email}
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest mb-6 text-summitGold">Main Menu</h4>
                  <ul className="space-y-4 text-sm text-storeWhite/60 font-medium">
                    <li><Link href="/" className="hover:text-summitGold transition-colors">Home</Link></li>
                    <li><Link href="/shop" className="hover:text-summitGold transition-colors">Shop All</Link></li>
                    <li><Link href="/about" className="hover:text-summitGold transition-colors">Our Story</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest mb-6 text-summitGold">Policies</h4>
                  <ul className="space-y-4 text-sm text-storeWhite/60 font-medium">
                    <li><Link href="/privacy-policy" className="hover:text-summitGold transition-colors">Privacy Policy</Link></li>
                    <li><Link href="/return-policy" className="hover:text-summitGold transition-colors">Return Policy</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest mb-6 text-summitGold">Socials</h4>
                  <div className="flex flex-col space-y-4 text-sm text-storeWhite/60 font-medium">
                    <span className="cursor-pointer hover:text-summitGold transition-colors">Instagram</span>
                    <span className="cursor-pointer hover:text-summitGold transition-colors">WhatsApp</span>
                  </div>
                </div>
              </div>
              <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-summitGold/20 flex flex-col md:flex-row justify-between items-center text-xs text-storeWhite/40 uppercase tracking-widest font-bold">
                <p>&copy; {new Date().getFullYear()} Cloudpeak. All rights reserved.</p>
                <p className="mt-4 md:mt-0 text-summitGold/60">INR (₹) | India</p>
              </div>
            </div>
          </footer>

        </CartProvider>
      </body>
    </html>
  )
}
