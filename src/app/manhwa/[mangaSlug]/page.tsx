import { notFound, permanentRedirect } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getMangaBySlug, getMangaList } from '@/lib/api';
import { BookmarkButton } from '@/components/manga/BookmarkButton';
import { MangaCard } from '@/components/manga/MangaCard';
import {
  constructMangaMetadata,
  generateMangaJsonLd,
  generateBreadcrumbJsonLd,
} from '@/lib/seo';
import { BookOpen, Calendar, Clock, ArrowRight, User, Sparkles } from 'lucide-react';
import { MangaDetail, MangaSummary } from '@/types/manga';
import { RedirectResponse } from '@/types/api';

interface PageProps {
  params: Promise<{
    mangaSlug: string;
  }>;
}

function isRedirectResponse(data: MangaDetail | RedirectResponse): data is RedirectResponse {
  return 'redirect' in data && data.redirect === true;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { mangaSlug } = await params;
  try {
    const data = await getMangaBySlug(mangaSlug);
    if (isRedirectResponse(data)) {
      return {};
    }
    return constructMangaMetadata(data);
  } catch {
    return { title: 'Manga Not Found' };
  }
}

export default async function MangaDetailPage({ params }: PageProps) {
  const { mangaSlug } = await params;

  let result: MangaDetail | RedirectResponse;
  try {
    result = await getMangaBySlug(mangaSlug);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'NOT_FOUND') {
      notFound();
    }
    throw err;
  }

  // Handle permanent redirect outside try/catch so NEXT_REDIRECT is not intercepted
  if (isRedirectResponse(result)) {
    permanentRedirect(result.target_url.replace(/\/+$/, '') || '/');
  }

  const manga: MangaDetail = result;

  // Fetch related manga by primary genre or popularity
  let relatedManga: MangaSummary[] = [];
  try {
    const genreToQuery = manga.genres && manga.genres.length > 0 ? manga.genres[0].toLowerCase() : '';
    const relatedRes = await getMangaList({
      genre: genreToQuery || undefined,
      sort: 'chapters',
      per_page: 7,
    });
    relatedManga = relatedRes.items.filter((m) => m.id !== manga.id).slice(0, 6);
  } catch {}

  const mangaJsonLd = generateMangaJsonLd(manga);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Manhwa', url: '/manhwa' },
    { name: manga.title, url: `/manhwa/${manga.slug}` },
  ]);

  const firstChapter = manga.chapters[0];
  const latestChapter = manga.chapters[manga.chapters.length - 1];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Structured Data injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mangaJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb nav */}
      <nav className="text-xs text-text-dim flex items-center gap-2">
        <Link href="/" className="hover:text-rose-soft">Home</Link>
        <span>/</span>
        <Link href="/manhwa" className="hover:text-rose-soft">Manhwa</Link>
        <span>/</span>
        <span className="text-text-main truncate max-w-xs">{manga.title}</span>
      </nav>

      {/* Main Manga Overview Card */}
      <div className="rounded-3xl bg-surface-card border border-surface-border p-6 md:p-10 shadow-xl">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Cover Art */}
          <div className="w-full md:w-72 lg:w-80 flex-shrink-0">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-surface border border-surface-border shadow-rose-glow">
              {manga.cover_url ? (
                <img
                  src={manga.cover_url}
                  alt={manga.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-text-dim">
                  <BookOpen className="h-16 w-16 opacity-30" />
                </div>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="mt-4 flex gap-3">
              {firstChapter && (
                <Link
                  href={`/manhwa/${manga.slug}/${firstChapter.chapter_slug}`}
                  className="flex-1 rounded-xl bg-rose-accent py-3 text-center text-sm font-semibold text-white shadow-rose-glow hover:bg-rose-accent/90 transition"
                >
                  Read First Ch.
                </Link>
              )}
              {latestChapter && latestChapter !== firstChapter && (
                <Link
                  href={`/manhwa/${manga.slug}/${latestChapter.chapter_slug}`}
                  className="flex-1 rounded-xl bg-surface border border-surface-border py-3 text-center text-sm font-semibold text-text-main hover:border-rose-soft transition"
                >
                  Latest Ch.
                </Link>
              )}
            </div>

            {/* Bookmark to Library Button */}
            <div className="mt-3">
              <BookmarkButton manga={manga} />
            </div>
          </div>

          {/* Details & Synopsis */}
          <div className="flex-1 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-md bg-rose-burgundy/80 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-rose-soft border border-rose-soft/20">
                  {manga.publication_status}
                </span>
                {manga.release_year && (
                  <span className="text-xs text-text-dim flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {manga.release_year}
                  </span>
                )}
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-text-main leading-tight">
                {manga.title}
              </h1>

              {manga.alternative_titles && manga.alternative_titles.length > 0 && (
                <p className="text-xs text-text-dim mt-2 italic">
                  Also known as: {manga.alternative_titles.join(' • ')}
                </p>
              )}
            </div>

            {/* Genre Badges */}
            <div className="flex flex-wrap gap-2">
              {manga.genres.map((g) => (
                <Link
                  key={g}
                  href={`/manhwa?genre=${g.toLowerCase()}`}
                  className="rounded-lg bg-surface border border-surface-border px-3 py-1 text-xs text-text-muted hover:border-rose-accent hover:text-rose-soft transition"
                >
                  {g}
                </Link>
              ))}
            </div>

            {/* Author / Artist */}
            <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-surface-border/60">
              <div>
                <span className="text-text-dim block mb-0.5">Author</span>
                <span className="font-semibold text-text-main flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-rose-soft" /> {manga.author || 'Unknown'}
                </span>
              </div>
              <div>
                <span className="text-text-dim block mb-0.5">Artist</span>
                <span className="font-semibold text-text-main flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-rose-soft" /> {manga.artist || 'Unknown'}
                </span>
              </div>
            </div>

            {/* Synopsis */}
            <div className="space-y-2 pt-2 border-t border-surface-border/60">
              <h3 className="font-serif text-sm font-bold text-text-main uppercase tracking-wider">
                Synopsis
              </h3>
              <div
                className="text-sm text-text-muted leading-relaxed prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: manga.synopsis || '<p>No synopsis available yet.</p>' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Chapter List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <h2 className="font-serif text-2xl font-bold text-text-main flex items-center gap-2">
            Chapters <span className="text-xs font-sans text-rose-soft bg-rose-dark/60 px-2.5 py-0.5 rounded-full">{manga.total_chapters}</span>
          </h2>
          <span className="text-xs text-text-dim">
            Sorted oldest to newest
          </span>
        </div>

        {manga.chapters.length === 0 ? (
          <div className="rounded-2xl border border-surface-border bg-surface-card p-12 text-center text-text-dim">
            <p>No chapters published yet for this title.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {manga.chapters.map((ch) => (
              <Link
                key={ch.id}
                href={`/manhwa/${manga.slug}/${ch.chapter_slug}`}
                className="flex items-center justify-between p-3.5 rounded-xl bg-surface-card border border-surface-border hover:border-rose-accent/50 hover:bg-surface-hover transition group"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-text-main group-hover:text-rose-soft truncate">
                    Chapter {ch.chapter_number}
                  </p>
                  <p className="text-[11px] text-text-dim mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(ch.published_at).toLocaleDateString()}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-text-dim group-hover:text-rose-accent transition ml-2 flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* You May Also Like Section */}
      {relatedManga.length > 0 && (
        <div className="space-y-4 pt-10 border-t border-surface-border/60">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-accent/15 text-rose-accent">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="font-serif text-2xl font-bold text-text-main">
              You May Also Like
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {relatedManga.map((m) => (
              <MangaCard key={m.id} manga={m} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
