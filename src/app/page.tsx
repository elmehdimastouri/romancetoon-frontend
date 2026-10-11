import Link from 'next/link';
import { getLatestUpdates, getMangaList } from '@/lib/api';
import { MangaCard } from '@/components/manga/MangaCard';
import { RandomHeroSlider } from '@/components/home/RandomHeroSlider';
import { Flame, Clock } from 'lucide-react';
import { MangaSummary } from '@/types/manga';
import { generateHomeJsonLd } from '@/lib/seo';

export const revalidate = 120; // 2 minutes ISR

export default async function HomePage() {
  let latestManga: MangaSummary[] = [];
  let featuredManga: MangaSummary[] = [];
  let sliderManga: MangaSummary[] = [];

  try {
    const [latest, featured] = await Promise.all([
      getLatestUpdates(12),
      getMangaList({ page: 1, per_page: 12, sort: 'chapters' }),
    ]);
    latestManga = latest;
    featuredManga = featured.items;

    // Build a unique pool of manga for the random hero slider
    const map = new Map<number, MangaSummary>();
    [...featuredManga, ...latestManga].forEach((m) => map.set(m.id, m));
    sliderManga = Array.from(map.values());
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

      {/* Random / Dynamic Featured Manhwa Hero Slider */}
      <RandomHeroSlider initialManga={sliderManga} />

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
            {featuredManga.slice(0, 6).map((m) => (
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
