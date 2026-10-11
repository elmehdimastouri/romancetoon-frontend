import { notFound, permanentRedirect } from 'next/navigation';
import { Metadata } from 'next';
import { getChapter, getMangaList, getMangaBySlug } from '@/lib/api';
import {
  constructChapterMetadata,
  generateChapterJsonLd,
  generateBreadcrumbJsonLd,
} from '@/lib/seo';
import { ContinuousReader } from '@/components/reader/ContinuousReader';
import { ChapterSummary, MangaDetail, MangaSummary } from '@/types/manga';
import { ChapterDetail } from '@/types/chapter';
import { RedirectResponse } from '@/types/api';

interface PageProps {
  params: Promise<{
    mangaSlug: string;
    chapterSlug: string;
  }>;
}

const CHAPTER_SLUG_REGEX = /^chapter-([0-9]+(?:\.[0-9]+)?)$/;

function isRedirectResponse(data: ChapterDetail | RedirectResponse): data is RedirectResponse {
  return 'redirect' in data && data.redirect === true;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { mangaSlug, chapterSlug } = await params;
  const match = chapterSlug.match(CHAPTER_SLUG_REGEX);
  if (!match) {
    return { title: 'Chapter Not Found' };
  }

  const chapterNumber = match[1];
  try {
    const data = await getChapter(mangaSlug, chapterNumber);
    if (isRedirectResponse(data)) {
      return {};
    }
    return constructChapterMetadata(data);
  } catch {
    return { title: 'Chapter Not Found' };
  }
}

export default async function ChapterReaderPage({ params }: PageProps) {
  const { mangaSlug, chapterSlug } = await params;

  // 1. Strict Regex validation: Must follow pattern 'chapter-{number}' (integer or decimal)
  const match = chapterSlug.match(CHAPTER_SLUG_REGEX);
  if (!match) {
    notFound();
  }

  const chapterNumber = match[1];

  let result: ChapterDetail | RedirectResponse;
  let mangaResult: MangaDetail | RedirectResponse | null = null;

  try {
    [result, mangaResult] = await Promise.all([
      getChapter(mangaSlug, chapterNumber),
      getMangaBySlug(mangaSlug).catch(() => null),
    ]);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'NOT_FOUND') {
      notFound();
    }
    throw err;
  }

  // 2. Handle permanent redirect outside try/catch so NEXT_REDIRECT is not intercepted
  if (isRedirectResponse(result)) {
    permanentRedirect(result.target_url.replace(/\/+$/, '') || '/');
  }

  const chapter: ChapterDetail = result;
  const allChapters: ChapterSummary[] =
    mangaResult && 'chapters' in mangaResult && Array.isArray(mangaResult.chapters)
      ? mangaResult.chapters
      : [];

  // Fetch recommended romance manhwa for the bottom of the chapter
  let relatedManga: MangaSummary[] = [];
  try {
    const relatedRes = await getMangaList({
      sort: 'chapters',
      per_page: 7,
    });
    relatedManga = relatedRes.items.filter((m) => m.id !== chapter.manga.id).slice(0, 6);
  } catch {}

  const chapterJsonLd = generateChapterJsonLd(chapter);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Manhwa', url: '/manhwa' },
    { name: chapter.manga.title, url: `/manhwa/${chapter.manga.slug}` },
    { name: `Chapter ${chapter.chapter_number}`, url: `/manhwa/${chapter.manga.slug}/chapter-${chapter.chapter_number}` },
  ]);

  return (
    <div>
      {/* Structured Data injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(chapterJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Reader View with all chapters list passed */}
      <ContinuousReader chapter={chapter} relatedManga={relatedManga} allChapters={allChapters} />
    </div>
  );
}
