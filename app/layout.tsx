import './globals.css'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import CartSidebar from '../components/CartSidebar'
import { CartProvider } from '../context/CartContext'
// 1. ADD THIS IMPORT LINE
import Newsletter from '../components/Newsletter' 

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
  title: 'Cloudpeak | Premier Streetwear & POD',
  description: 'Shillong Born. For The Culture. Shop exclusive footwear, POD, and dropshipping apparel.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} bg-storeWhite text-storeBlack font-sans antialiased min-h-screen flex flex-col`}>
        
        <CartProvider>
          <Navbar />
          <CartSidebar />
          
          <main className="flex-grow">
            {children}
          </main>

          <footer className="mt-auto">
            {/* 2. ADD THE COMPONENT HERE */}
            <Newsletter /> 

            {/* Dark Footer starts here */}
            <div className="bg-storeBlack text-storeWhite py-20 px-4">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* ... (rest of your footer content) */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Image src="/minimal-modern-professional-logo-for-brand-cloudpe.jpeg" alt="Cloudpeak Logo" width={40} height={40} className="object-contain invert brightness-0" />
                    <span className="font-black text-xl tracking-[0.2em] uppercase mt-1">CLOUDPEAK</span>
                  </div>
                  <p className="text-storeWhite/50 text-sm leading-relaxed font-medium">Shillong, Meghalaya<br/>WhatsApp: +91 00000 00000<br/>support@cloudpeak.in</p>
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest mb-6">Main Menu</h4>
                  <ul className="space-y-4 text-sm text-storeWhite/60 font-medium">
                    <li><Link href="/" className="hover:text-storeWhite transition-colors">Home</Link></li>
                    <li><Link href="/shop" className="hover:text-storeWhite transition-colors">Shop All</Link></li>
                    <li><Link href="/about" className="hover:text-storeWhite transition-colors">Our Story</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest mb-6">Policies</h4>
                  <ul className="space-y-4 text-sm text-storeWhite/60 font-medium">
                    <li><Link href="#" className="hover:text-storeWhite transition-colors">Privacy Policy</Link></li>
                    <li><Link href="#" className="hover:text-storeWhite transition-colors">Return Policy</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest mb-6">Socials</h4>
                  <div className="flex flex-col space-y-4 text-sm text-storeWhite/60 font-medium">
                    <span className="cursor-pointer hover:text-storeWhite transition-colors">Instagram</span>
                    <span className="cursor-pointer hover:text-storeWhite transition-colors">WhatsApp</span>
                  </div>
                </div>
              </div>
              <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-storeWhite/10 flex flex-col md:flex-row justify-between items-center text-xs text-storeWhite/40 uppercase tracking-widest font-bold">
                <p>&copy; {new Date().getFullYear()} Cloudpeak. All rights reserved.</p>
                <p className="mt-4 md:mt-0 text-storeWhite/60">INR (₹) | India</p>
              </div>
            </div>
          </footer>

        </CartProvider>
      </body>
    </html>
  )
}