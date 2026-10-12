'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bookmark, BookOpen, Flame, History } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useReadingHistory } from '@/hooks/useReadingHistory';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { bookmarks } = useBookmarks();
  const { history } = useReadingHistory();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-accent/15 text-rose-accent ring-1 ring-rose-accent/30 group-hover:bg-rose-accent/25 transition">
              <BookOpen className="h-5 w-5" />
            </span>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-text-main group-hover:text-rose-soft transition">
              Romance<span className="text-rose-accent">Toon</span>
            </span>
          </Link>

          {/* Navigation links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-text-muted">
            <Link href="/manhwa" className="hover:text-text-main transition">
              Directory
            </Link>
            <Link href="/manhwa?sort=chapters" className="hover:text-text-main transition flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-soft" /> Popular
            </Link>
            <Link href="/library?tab=bookmarks" className="hover:text-text-main transition flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-rose-accent" /> Library
            </Link>
            <Link href="/library?tab=history" className="hover:text-text-main transition flex items-center gap-1.5">
              <History className="w-4 h-4 text-rose-soft" /> History
            </Link>
          </nav>
        </div>

        {/* Search bar, Theme Toggle & Direct Page Links */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <form onSubmit={handleSearchSubmit} className="relative hidden sm:block w-56 lg:w-80">
            <input
              type="text"
              placeholder="Search romance manhwa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full bg-surface-card px-4 py-1.5 pl-10 text-sm text-text-main placeholder-text-dim border border-surface-border focus:border-rose-accent focus:outline-none focus:ring-1 focus:ring-rose-accent"
            />
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-text-dim" />
          </form>

          {/* Light / Calm Dark Theme Toggle */}
          <ThemeToggle />

          {/* Direct Link to Reading History Page */}
          <Link
            href="/library?tab=history"
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-surface-card border border-surface-border text-text-muted hover:text-rose-soft hover:border-rose-soft/50 transition"
            aria-label="View Reading History Page"
            title="Reading History"
          >
            <History className="h-4 w-4" />
            {history.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-rose-soft"></span>
            )}
          </Link>

          {/* Direct Link to Bookmarks Library Page */}
          <Link
            href="/library?tab=bookmarks"
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-surface-card border border-surface-border text-text-muted hover:text-rose-accent hover:border-rose-accent/50 transition"
            aria-label="View Saved Bookmarks Page"
            title="Saved Bookmarks"
          >
            <Bookmark className="h-4 w-4" />
            {bookmarks.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-accent text-[10px] font-bold text-white">
                {bookmarks.length > 9 ? '9+' : bookmarks.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
