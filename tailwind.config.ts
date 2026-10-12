import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          card: 'rgb(var(--color-surface-card) / <alpha-value>)',
          hover: 'rgb(var(--color-surface-hover) / <alpha-value>)',
          border: 'rgb(var(--color-surface-border) / <alpha-value>)',
        },
        rose: {
          accent: 'rgb(var(--color-rose-accent) / <alpha-value>)',
          soft: 'rgb(var(--color-rose-soft) / <alpha-value>)',
          burgundy: 'rgb(var(--color-rose-burgundy) / <alpha-value>)',
          dark: 'rgb(var(--color-rose-dark) / <alpha-value>)',
        },
        text: {
          main: 'rgb(var(--color-text-main) / <alpha-value>)',
          muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
          dim: 'rgb(var(--color-text-dim) / <alpha-value>)',
        },
      },
      fontFamily: {
        serif: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'rose-glow': 'var(--shadow-glow)',
        'rose-glow-lg': 'var(--shadow-glow-lg)',
      },
    },
  },
  plugins: [],
};

export default config;
