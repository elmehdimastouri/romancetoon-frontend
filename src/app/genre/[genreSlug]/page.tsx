import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getGenreBySlug } from '@/lib/api';
import { MangaCard } from '@/components/manga/MangaCard';
import { constructGenreMetadata, generateGenreJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';

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
    return constructGenreMetadata(data.genre);
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

  const genreJsonLd = generateGenreJsonLd(data.genre.name, data.genre.slug);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Genres', url: '/manhwa' },
    { name: data.genre.name, url: `/genre/${data.genre.slug}` },
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(genreJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

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
        <p className="text-sm text-text-muted mt-1">
          {data.total} series available in {data.genre.name.toLowerCase()} romance
        </p>
      </div>

      {data.items.length === 0 ? (
        <div className="p-12 text-center text-text-dim border border-surface-border rounded-2xl bg-surface">
          No series found in this genre yet. Check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {data.items.map((manga) => (
            <MangaCard key={manga.id} manga={manga} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data.total_pages > 1 && (
        <div className="flex justify-center gap-3 pt-6 border-t border-surface-border">
          {page > 1 && (
            <Link
              href={`/genre/${genreSlug}?page=${page - 1}`}
              className="px-4 py-2 text-sm rounded-lg bg-surface border border-surface-border hover:bg-surface-card"
            >
              Previous
            </Link>
          )}
          <span className="px-4 py-2 text-sm text-text-muted">
            Page {page} of {data.total_pages}
          </span>
          {page < data.total_pages && (
            <Link
              href={`/genre/${genreSlug}?page=${page + 1}`}
              className="px-4 py-2 text-sm rounded-lg bg-surface border border-surface-border hover:bg-surface-card"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
