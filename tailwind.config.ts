import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        storeWhite: '#FFFFFF',     // Pure white background
        storeBlack: '#111111',     // Pitch black for high contrast text
        cardGray: '#F5F5F5',       // Light gray for product backgrounds
        accentRed: '#FF3333',      // For sale tags and notification dots
        borderGray: '#E5E5E5',     // Subtle dividers
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'slide-in': 'slideIn 0.3s ease-out forwards', // New cart animation
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }, // New cart keyframes
        }
      }
    },
  },
  plugins: [],
}
export default config