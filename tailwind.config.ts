import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        midnightNavy: '#0A1628',
        midnightNavyLight: '#132040',
        midnightNavyDark: '#060E1A',
        summitGold: '#D4A843',
        summitGoldLight: '#E8C76A',
        summitGoldDark: '#B8922F',
        storeWhite: '#FFFFFF',
        storeBlack: '#0A1628',
        cardGray: '#F4F1EB',
        accentRed: '#D4A843',
        borderGray: '#E2DDD4',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-bebas)', 'Impact', 'sans-serif'],
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        'slide-in': 'slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-out': 'slideOut 0.3s ease-in forwards',
        'cursor-ring': 'cursorRing 1.5s ease-out infinite',
        'fade-up': 'fadeUp 0.7s ease forwards',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        cursorRing: {
          '0%': { transform: 'translate(-50%, -50%) scale(1)', opacity: '0.6' },
          '100%': { transform: 'translate(-50%, -50%) scale(2.2)', opacity: '0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
