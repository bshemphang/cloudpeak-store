import './globals.css'
import { Inter, Bebas_Neue } from 'next/font/google'
import { CartProvider } from '../context/CartContext'
import { AuthProvider } from '../context/AuthContext'
import { SITE } from '../lib/site'
import StoreLayoutWrapper from '../components/StoreLayoutWrapper'

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
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${bebasNeue.variable} bg-storeWhite text-midnightNavy font-sans antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <CartProvider>
            <StoreLayoutWrapper>
              {children}
            </StoreLayoutWrapper>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
