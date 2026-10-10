import { getMangaList, getGenres } from '@/lib/api';
import { MangaCard } from '@/components/manga/MangaCard';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Manhwa Directory',
  description: 'Browse the complete catalog of English romance, historical, and fantasy manhwa titles.',
};

export const revalidate = 300; // 5 min ISR

interface PageProps {
  searchParams: Promise<{
    page?: string;
    genre?: string;
    status?: string;
    sort?: string;
  }>;
}

export default async function ManhwaDirectoryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || '1', 10));
  const currentGenre = params.genre || '';
  const currentStatus = params.status || '';
  const currentSort = params.sort || 'latest';

  let data: import('@/types/api').PaginatedResponse<import('@/types/manga').MangaSummary> = {
    items: [],
    total: 0,
    total_pages: 1,
    page: 1,
    per_page: 24,
  };
  let genres: import('@/types/manga').GenreItem[] = [];

  try {
    const [mangaRes, genresRes] = await Promise.all([
      getMangaList({
        page,
        per_page: 24,
        genre: currentGenre,
        status: currentStatus,
        sort: currentSort,
      }),
      getGenres(),
    ]);
    data = mangaRes;
    genres = genresRes;
  } catch {}

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-extrabold text-text-main">Manhwa Directory</h1>
        <p className="text-sm text-text-dim mt-1">
          Explore {data.total} titles in our romance collection
        </p>
      </div>

      {/* Filter Tabs & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-surface-card border border-surface-border">
        {/* Genre Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <Link
            href={`/manhwa?${new URLSearchParams({ ...(currentStatus && { status: currentStatus }), ...(currentSort && { sort: currentSort }) }).toString()}`}
            className={`px-3 py-1.5 rounded-lg border transition ${
              !currentGenre
                ? 'bg-rose-accent text-white border-rose-accent'
                : 'bg-surface text-text-muted border-surface-border hover:border-rose-soft'
            }`}
          >
            All Genres
          </Link>
          {genres.map((g) => (
            <Link
              key={g.slug}
              href={`/manhwa?genre=${g.slug}${currentStatus ? `&status=${currentStatus}` : ''}${currentSort ? `&sort=${currentSort}` : ''}`}
              className={`px-3 py-1.5 rounded-lg border transition ${
                currentGenre === g.slug
                  ? 'bg-rose-accent text-white border-rose-accent'
                  : 'bg-surface text-text-muted border-surface-border hover:border-rose-soft'
              }`}
            >
              {g.name}
            </Link>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span>Sort:</span>
          <Link
            href={`/manhwa?sort=latest${currentGenre ? `&genre=${currentGenre}` : ''}${currentStatus ? `&status=${currentStatus}` : ''}`}
            className={`px-2.5 py-1 rounded ${currentSort === 'latest' ? 'text-rose-soft font-bold' : 'hover:text-text-main'}`}
          >
            Latest
          </Link>
          <Link
            href={`/manhwa?sort=alphabetical${currentGenre ? `&genre=${currentGenre}` : ''}${currentStatus ? `&status=${currentStatus}` : ''}`}
            className={`px-2.5 py-1 rounded ${currentSort === 'alphabetical' ? 'text-rose-soft font-bold' : 'hover:text-text-main'}`}
          >
            A-Z
          </Link>
          <Link
            href={`/manhwa?sort=chapters${currentGenre ? `&genre=${currentGenre}` : ''}${currentStatus ? `&status=${currentStatus}` : ''}`}
            className={`px-2.5 py-1 rounded ${currentSort === 'chapters' ? 'text-rose-soft font-bold' : 'hover:text-text-main'}`}
          >
            Most Chapters
          </Link>
        </div>
      </div>

      {/* Grid */}
      {data.items.length === 0 ? (
        <div className="rounded-2xl border border-surface-border bg-surface-card p-16 text-center text-text-dim">
          <p>No manhwa found matching your criteria.</p>
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
              href={`/manhwa?page=${page - 1}${currentGenre ? `&genre=${currentGenre}` : ''}${currentStatus ? `&status=${currentStatus}` : ''}${currentSort ? `&sort=${currentSort}` : ''}`}
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
              href={`/manhwa?page=${page + 1}${currentGenre ? `&genre=${currentGenre}` : ''}${currentStatus ? `&status=${currentStatus}` : ''}${currentSort ? `&sort=${currentSort}` : ''}`}
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
