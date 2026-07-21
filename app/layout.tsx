import './globals.css'
import { Inter, Bebas_Neue } from 'next/font/google'
import { CartProvider } from '../context/CartContext'
import { AuthProvider as OriginalAuthProvider } from '../context/AuthContext'
import { SITE } from '../lib/site'
import StoreLayoutWrapper from '../components/StoreLayoutWrapper'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas' })

export const metadata = {
  metadataBase: new URL('https://cloudpeak.in'),
  title: 'Cloudpeak | Premier Streetwear Drops',
  description: 'Shop exclusive premium streetwear, footwear, and apparel collections.',
  icons: {
    icon: SITE.logo,
    apple: SITE.logo,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || 'YOUR_GSC_VERIFICATION_KEY_HERE',
  },
  openGraph: {
    title: 'Cloudpeak | Premier Streetwear Drops',
    description: 'Shop exclusive premium streetwear, footwear, and apparel collections.',
    url: 'https://cloudpeak.in',
    siteName: 'Cloudpeak',
    images: [
      {
        url: 'https://cloudpeak.in/images/square-image.png',
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
    description: 'Shop exclusive premium streetwear, footwear, and apparel collections.',
    images: ['https://cloudpeak.in/images/square-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" className={`${inter.variable} ${bebasNeue.variable} scroll-smooth`} data-scroll-behavior="smooth">
      <body className="bg-storeWhite text-midnightNavy font-sans antialiased min-h-screen flex flex-col">
        {/* Google Analytics 4 Script */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        {/* Client Error Monitoring Telemetry script */}
        <Script id="client-error-monitor" strategy="afterInteractive">
          {`
            window.addEventListener('error', function(event) {
              if (!event.message) return;
              
              fetch('/api/logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  level: 'ERROR',
                  message: event.message,
                  meta: {
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno,
                    stack: event.error ? event.error.stack : null,
                    url: window.location.href,
                    userAgent: navigator.userAgent
                  }
                })
              }).catch(function(err) {
                console.warn('Failed to send error log to telemetry API:', err);
              });
            });

            window.addEventListener('unhandledrejection', function(event) {
              fetch('/api/logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  level: 'ERROR',
                  message: 'Unhandled Promise Rejection: ' + String(event.reason),
                  meta: {
                    reason: String(event.reason),
                    url: window.location.href,
                    userAgent: navigator.userAgent
                  }
                })
              }).catch(function(err) {
                console.warn('Failed to send error log to telemetry API:', err);
              });
            });
          `}
        </Script>

        <OriginalAuthProvider>
          <CartProvider>
            <StoreLayoutWrapper>
              {children}
            </StoreLayoutWrapper>
          </CartProvider>
        </OriginalAuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
