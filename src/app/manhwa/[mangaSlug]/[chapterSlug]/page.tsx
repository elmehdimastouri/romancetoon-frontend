import { notFound, permanentRedirect } from 'next/navigation';
import { Metadata } from 'next';
import { getChapter } from '@/lib/api';
import {
  constructChapterMetadata,
  generateChapterJsonLd,
  generateBreadcrumbJsonLd,
} from '@/lib/seo';
import { ContinuousReader } from '@/components/reader/ContinuousReader';

interface PageProps {
  params: Promise<{
    mangaSlug: string;
    chapterSlug: string;
  }>;
}

const CHAPTER_SLUG_REGEX = /^chapter-([0-9]+(?:\.[0-9]+)?)$/;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { mangaSlug, chapterSlug } = await params;
  const match = chapterSlug.match(CHAPTER_SLUG_REGEX);
  if (!match) {
    return { title: 'Chapter Not Found' };
  }

  const chapterNumber = match[1];
  try {
    const data = await getChapter(mangaSlug, chapterNumber);
    if ('redirect' in data && data.redirect) {
      return {};
    }
    return constructChapterMetadata(data as import('@/types/chapter').ChapterDetail);
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

  let chapter;
  try {
    const result = await getChapter(mangaSlug, chapterNumber);

    // 2. Check 301 Permanent Redirect
    if ('redirect' in result && result.redirect) {
      permanentRedirect(result.target_url);
    }

    chapter = result as import('@/types/chapter').ChapterDetail;
  } catch (err: any) {
    if (err?.message === 'NOT_FOUND') {
      notFound();
    }
    notFound();
  }

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

      {/* Reader View */}
      <ContinuousReader chapter={chapter} />
    </div>
  );
}
