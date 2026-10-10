import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getGenreBySlug } from '@/lib/api';
import { MangaCard } from '@/components/manga/MangaCard';

interface PageProps {
  params: Promise<{
    genreSlug: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { genreSlug } = await params;
  try {
    const data = await getGenreBySlug(genreSlug, 1);
    return {
      title: `${data.genre.name} Manhwa`,
      description: `Browse all English-translated ${data.genre.name.toLowerCase()} manhwa titles and chapters.`,
    };
  } catch {
    return { title: 'Genre Not Found' };
  }
}

export const revalidate = 600; // 10 min ISR

export default async function GenreArchivePage({ params, searchParams }: PageProps) {
  const { genreSlug } = await params;
  const sParams = await searchParams;
  const page = Math.max(1, parseInt(sParams.page || '1', 10));

  let data;
  try {
    data = await getGenreBySlug(genreSlug, page);
  } catch (err: any) {
    if (err?.message === 'NOT_FOUND') {
      notFound();
    }
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb nav */}
      <nav className="text-xs text-text-dim flex items-center gap-2">
        <Link href="/" className="hover:text-rose-soft">Home</Link>
        <span>/</span>
        <Link href="/manhwa" className="hover:text-rose-soft">Genres</Link>
        <span>/</span>
        <span className="text-text-main">{data.genre.name}</span>
      </nav>

      <div>
        <h1 className="font-serif text-3xl font-extrabold text-text-main">
          {data.genre.name} Manhwa
        </h1>
        <p className="text-sm text-text-dim mt-1">
          Showing {data.total} romance titles in this category
        </p>
      </div>

      {data.items.length === 0 ? (
        <div className="rounded-2xl border border-surface-border bg-surface-card p-16 text-center text-text-dim">
          <p>No titles currently listed under {data.genre.name}.</p>
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
              href={`/genre/${genreSlug}?page=${page - 1}`}
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
              href={`/genre/${genreSlug}?page=${page + 1}`}
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
