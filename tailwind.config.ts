import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B090F',
        surface: {
          DEFAULT: '#15121E',
          card: '#181424',
          hover: '#1F1A2E',
          border: '#262035',
        },
        rose: {
          accent: '#E11D48',
          soft: '#FB7185',
          burgundy: '#881337',
          dark: '#4C0519',
        },
        text: {
          main: '#F1F0F5',
          muted: '#A19BAF',
          dim: '#716B7F',
        },
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'rose-glow': '0 0 20px -5px rgba(225, 29, 72, 0.3)',
        'rose-glow-lg': '0 0 35px -5px rgba(225, 29, 72, 0.45)',
      },
    },
  },
  plugins: [],
};

export default config;
