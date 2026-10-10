import Link from 'next/link';
import { getLatestUpdates, getMangaList } from '@/lib/api';
import { MangaCard } from '@/components/manga/MangaCard';
import { Sparkles, Flame, Clock, ArrowRight } from 'lucide-react';

import { MangaSummary } from '@/types/manga';
import { generateHomeJsonLd } from '@/lib/seo';

export const revalidate = 120; // 2 minutes ISR

export default async function HomePage() {
  let latestManga: MangaSummary[] = [];
  let featuredManga: MangaSummary[] = [];

  try {
    const [latest, featured] = await Promise.all([
      getLatestUpdates(12),
      getMangaList({ page: 1, per_page: 6, sort: 'chapters' }),
    ]);
    latestManga = latest;
    featuredManga = featured.items;
  } catch {
    // Graceful fallback for initial zero-data states
  }

  const homeJsonLd = generateHomeJsonLd();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-16">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-surface-card via-surface to-rose-dark/30 border border-surface-border p-8 md:p-12 shadow-2xl">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-accent/15 px-3 py-1 text-xs font-semibold text-rose-soft border border-rose-accent/25">
            <Sparkles className="w-3.5 h-3.5" /> High-Resolution Vertical Webtoon Reader
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight text-text-main leading-tight">
            Immerse Yourself in <span className="text-rose-accent">Romantic Manhwa</span>
          </h1>
          <p className="text-base text-text-muted leading-relaxed">
            Discover passionate stories of royalty, reincarnated villainesses, and timeless romances. Continuous vertical scrolling with seamless Cloudflare CDN image delivery.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/manhwa"
              className="inline-flex items-center gap-2 rounded-xl bg-rose-accent px-6 py-3 text-sm font-semibold text-white shadow-rose-glow hover:bg-rose-accent/90 transition"
            >
              Explore Directory <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/genre/fantasy"
              className="inline-flex items-center gap-2 rounded-xl bg-surface border border-surface-border px-6 py-3 text-sm font-semibold text-text-main hover:border-rose-soft transition"
            >
              Fantasy Romance
            </Link>
          </div>
        </div>
      </section>

      {/* Featured / Most Popular Section */}
      {featuredManga.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-accent/15 text-rose-accent">
                <Flame className="w-5 h-5" />
              </span>
              <h2 className="font-serif text-2xl font-bold text-text-main">Trending & Popular</h2>
            </div>
            <Link href="/manhwa?sort=chapters" className="text-xs font-semibold text-rose-soft hover:underline">
              View all
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {featuredManga.map((m) => (
              <MangaCard key={m.id} manga={m} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Updates Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-accent/15 text-rose-accent">
              <Clock className="w-5 h-5" />
            </span>
            <h2 className="font-serif text-2xl font-bold text-text-main">Latest Chapter Updates</h2>
          </div>
          <Link href="/manhwa" className="text-xs font-semibold text-rose-soft hover:underline">
            Browse all
          </Link>
        </div>

        {latestManga.length === 0 ? (
          <div className="rounded-2xl border border-surface-border bg-surface-card p-12 text-center text-text-dim">
            <p>No chapters published yet. Check back soon for fresh updates!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {latestManga.map((m) => (
              <MangaCard key={m.id} manga={m} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
