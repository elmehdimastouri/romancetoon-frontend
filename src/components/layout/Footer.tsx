import Link from 'next/link';
import { BookOpen, Bookmark, Flame, Heart, History, Sparkles, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface/60 text-text-muted mt-20 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-accent/15 text-rose-accent ring-1 ring-rose-accent/30 group-hover:bg-rose-accent/25 transition">
                <BookOpen className="h-4 w-4" />
              </span>
              <span className="font-serif text-xl font-bold text-text-main group-hover:text-rose-soft transition">
                Romance<span className="text-rose-accent">Toon</span>
              </span>
            </Link>
            <p className="text-xs text-text-dim leading-relaxed">
              The premier destination for English romance, historical, royalty, and fantasy manhwa. High-speed reader tailored for passionate readers.
            </p>
          </div>

          {/* Popular & Trending */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-text-main uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-soft" /> Popular & Trending
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/manhwa?sort=chapters" className="hover:text-rose-soft transition">
                  Most Popular Titles
                </Link>
              </li>
              <li>
                <Link href="/manhwa?sort=latest" className="hover:text-rose-soft transition">
                  Latest Releases
                </Link>
              </li>
              <li>
                <Link href="/manhwa" className="hover:text-rose-soft transition">
                  Complete Manhwa Directory
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-rose-soft transition">
                  Search All Series
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Genres */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-text-main uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-rose-soft" /> Top Genres
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/genre/historical" className="hover:text-rose-soft transition">
                  Historical & Royalty
                </Link>
              </li>
              <li>
                <Link href="/genre/romance" className="hover:text-rose-soft transition">
                  Romance Manhwa
                </Link>
              </li>
              <li>
                <Link href="/genre/fantasy" className="hover:text-rose-soft transition">
                  Fantasy Romance
                </Link>
              </li>
              <li>
                <Link href="/genre/villainess" className="hover:text-rose-soft transition">
                  Villainess & Rebirth
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-text-main uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-rose-accent" /> Legal & Library
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/library?tab=bookmarks" className="hover:text-rose-soft transition flex items-center gap-2">
                  <Bookmark className="w-3.5 h-3.5 text-rose-accent" /> Saved Favorites
                </Link>
              </li>
              <li>
                <Link href="/library?tab=history" className="hover:text-rose-soft transition flex items-center gap-2">
                  <History className="w-3.5 h-3.5 text-rose-soft" /> Reading History
                </Link>
              </li>
              <li>
                <Link href="/dmca" className="hover:text-rose-soft transition">
                  DMCA & Copyright Notice
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-rose-soft transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-rose-soft transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-rose-soft transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-surface-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-text-dim gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <p>© {new Date().getFullYear()} RomanceToon. All rights reserved.</p>
            <span className="hidden sm:inline text-surface-border">|</span>
            <Link href="/dmca" className="hover:text-rose-soft transition">DMCA</Link>
            <Link href="/terms" className="hover:text-rose-soft transition">Terms</Link>
            <Link href="/privacy" className="hover:text-rose-soft transition">Privacy</Link>
            <Link href="/contact" className="hover:text-rose-soft transition">Contact</Link>
          </div>
          <p className="flex items-center gap-1">
            Crafted for romance & webtoon lovers with <Heart className="w-3.5 h-3.5 text-rose-accent fill-rose-accent inline" />
          </p>
        </div>
      </div>
    </footer>
  );
}
