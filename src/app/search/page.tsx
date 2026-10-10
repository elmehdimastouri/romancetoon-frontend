import { Metadata } from 'next';
import { searchManga } from '@/lib/api';
import { MangaCard } from '@/components/manga/MangaCard';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}

export const metadata: Metadata = {
  title: 'Search Manhwa',
  description: 'Search for romance, historical, and fantasy manhwa titles.',
  // Crucial SEO: Allow crawlers to follow internal links but keep search URLs out of the index
  robots: {
    index: false,
    follow: true,
  },
};

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = (params.q || '').trim();
  const page = Math.max(1, parseInt(params.page || '1', 10));

  let data: import('@/types/api').SearchResponse = { items: [], total: 0, total_pages: 0, page: 1, per_page: 18, query: '' };

  if (query.length >= 2) {
    try {
      data = await searchManga(query, page);
    } catch {}
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-extrabold text-text-main">Search Results</h1>
        {query ? (
          <p className="text-sm text-text-dim mt-1">
            Found {data.total} manhwa matching &ldquo;<span className="text-rose-soft">{query}</span>&rdquo;
          </p>
        ) : (
          <p className="text-sm text-text-dim mt-1">
            Please enter at least 2 characters to search across titles and aliases.
          </p>
        )}
      </div>

      {query.length >= 2 && data.items.length === 0 ? (
        <div className="rounded-2xl border border-surface-border bg-surface-card p-16 text-center text-text-dim">
          <p>No results found for &ldquo;{query}&rdquo;. Try another title or check our directory.</p>
          <div className="mt-4">
            <Link
              href="/manhwa"
              className="inline-block rounded-xl bg-surface border border-surface-border px-5 py-2.5 text-xs text-rose-soft hover:border-rose-accent transition"
            >
              Go to Full Directory
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {data.items.map((m) => (
            <MangaCard key={m.id} manga={m} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          {page > 1 && (
            <Link
              href={`/search?q=${encodeURIComponent(query)}&page=${page - 1}`}
              className="px-4 py-2 text-xs rounded-xl bg-surface-card border border-surface-border hover:border-rose-soft transition"
            >
              Previous
            </Link>
          )}
          <span className="text-xs text-text-dim px-3">
            Page {page} of {data.total_pages}
          </span>
          {page < data.total_pages && (
            <Link
              href={`/search?q=${encodeURIComponent(query)}&page=${page + 1}`}
              className="px-4 py-2 text-xs rounded-xl bg-surface-card border border-surface-border hover:border-rose-soft transition"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
