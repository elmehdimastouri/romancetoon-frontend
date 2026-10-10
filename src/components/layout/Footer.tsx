import Link from 'next/link';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface/50 text-text-muted mt-20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <Link href="/" className="font-serif text-xl font-bold text-text-main">
              Romance<span className="text-rose-accent">Toon</span>
            </Link>
            <p className="text-sm text-text-dim max-w-md">
              The premier destination for English-translated romance, fantasy, historical, and villainess manhwa. High-resolution fast vertical scrolling tailored for passionate webtoon readers.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-sm font-semibold text-text-main uppercase tracking-wider mb-3">Popular Genres</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/genre/romance" className="hover:text-rose-soft transition">Romance Manhwa</Link></li>
              <li><Link href="/genre/historical" className="hover:text-rose-soft transition">Historical & Royalty</Link></li>
              <li><Link href="/genre/villainess" className="hover:text-rose-soft transition">Villainess Reincarnation</Link></li>
              <li><Link href="/genre/fantasy" className="hover:text-rose-soft transition">Fantasy Romance</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-sm font-semibold text-text-main uppercase tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/manhwa" className="hover:text-rose-soft transition">All Manhwa Directory</Link></li>
              <li><Link href="/search" className="hover:text-rose-soft transition">Advanced Search</Link></li>
              <li><span className="text-text-dim">DMCA & Content Policy</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-surface-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-text-dim gap-4">
          <p>© {new Date().getFullYear()} RomanceToon. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted for manhwa lovers with <Heart className="w-3.5 h-3.5 text-rose-accent fill-rose-accent inline" />
          </p>
        </div>
      </div>
    </footer>
  );
}
