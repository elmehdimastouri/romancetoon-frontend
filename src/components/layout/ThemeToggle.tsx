'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const THEME_STORAGE_KEY = 'romancetoon_theme';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
      root.classList.remove('light', 'dark');
      root.classList.add(saved);
    } else {
      const current = root.classList.contains('light') ? 'light' : 'dark';
      setTheme(current);
    }

    const handleSync = (e: Event) => {
      const custom = e as CustomEvent<'dark' | 'light'>;
      if (custom.detail === 'dark' || custom.detail === 'light') {
        setTheme(custom.detail);
      }
    };

    window.addEventListener('romancetoon-theme-change', handleSync);
    return () => window.removeEventListener('romancetoon-theme-change', handleSync);
  }, []);

  const toggleTheme = () => {
    const nextTheme: 'dark' | 'light' = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(nextTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      window.dispatchEvent(new CustomEvent('romancetoon-theme-change', { detail: nextTheme }));
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative flex h-9 w-9 items-center justify-center rounded-full bg-surface-card border border-surface-border text-text-muted hover:text-rose-accent hover:border-rose-accent/50 transition active:scale-95"
      aria-label={mounted && theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={mounted && theme === 'dark' ? 'Switch to Warm Light Mode' : 'Switch to Calm Dark Mode'}
    >
      {mounted && theme === 'light' ? (
        <Moon className="h-4 w-4 text-text-main" />
      ) : (
        <Sun className="h-4 w-4 text-rose-soft" />
      )}
    </button>
  );
}
