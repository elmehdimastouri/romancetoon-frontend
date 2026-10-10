'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bookmark, BookOpen, Flame } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookmarksModal, setShowBookmarksModal] = useState(false);
  const router = useRouter();
  const { bookmarks } = useBookmarks();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
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

            {/* Navigation links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-text-muted">
              <Link href="/manhwa" className="hover:text-text-main transition flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-soft" /> Directory
              </Link>
              <Link href="/genre/romance" className="hover:text-text-main transition">
                Romance
              </Link>
              <Link href="/genre/fantasy" className="hover:text-text-main transition">
                Fantasy
              </Link>
              <Link href="/manhwa?sort=chapters" className="hover:text-text-main transition">
                Popular
              </Link>
            </nav>
          </div>

          {/* Search bar & Actions */}
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative hidden sm:block w-64 lg:w-80">
              <input
                type="text"
                placeholder="Search romance manhwa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full bg-surface-card px-4 py-1.5 pl-10 text-sm text-text-main placeholder-text-dim border border-surface-border focus:border-rose-accent focus:outline-none focus:ring-1 focus:ring-rose-accent"
              />
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-text-dim" />
            </form>

            {/* Bookmarks Toggle Button */}
            <button
              onClick={() => setShowBookmarksModal(true)}
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-surface-card border border-surface-border text-text-muted hover:text-rose-accent hover:border-rose-accent/50 transition"
              aria-label="View Saved Bookmarks"
            >
              <Bookmark className="h-4 w-4" />
              {bookmarks.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-accent text-[10px] font-bold text-white">
                  {bookmarks.length > 9 ? '9+' : bookmarks.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Bookmarks Quick Modal */}
      {showBookmarksModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-surface-border bg-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-surface-border">
              <h3 className="font-serif text-lg font-bold text-text-main flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-rose-accent" /> Your Bookmarks
              </h3>
              <button
                onClick={() => setShowBookmarksModal(false)}
                className="text-text-dim hover:text-text-main text-sm"
              >
                Close
              </button>
            </div>
            <div className="mt-4 max-h-80 overflow-y-auto space-y-3">
              {bookmarks.length === 0 ? (
                <p className="text-center text-sm text-text-dim py-8">
                  No saved manhwa yet. Tap the bookmark icon on any title to save it locally.
                </p>
              ) : (
                bookmarks.map((b) => (
                  <Link
                    key={b.mangaSlug}
                    href={`/manhwa/${b.mangaSlug}`}
                    onClick={() => setShowBookmarksModal(false)}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-card border border-transparent hover:border-surface-border transition group"
                  >
                    {b.coverUrl ? (
                      <img src={b.coverUrl} alt={b.mangaTitle} className="w-12 h-16 object-cover rounded-lg" />
                    ) : (
                      <div className="w-12 h-16 bg-surface-card rounded-lg flex items-center justify-center text-xs text-text-dim">Cover</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-text-main group-hover:text-rose-soft truncate">{b.mangaTitle}</p>
                      <p className="text-xs text-text-dim mt-0.5">Saved to browser</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
