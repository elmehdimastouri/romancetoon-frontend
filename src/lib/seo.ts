import { Metadata } from 'next';
import { MangaDetail } from '@/types/manga';
import { ChapterDetail } from '@/types/chapter';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://romancetoon.com';
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'RomanceToon';

export function constructMangaMetadata(manga: MangaDetail): Metadata {
  const url = `${SITE_URL}/manhwa/${manga.slug}/`;
  const title = `${manga.title} - Read Manhwa Online | ${SITE_NAME}`;
  const description = manga.excerpt || manga.synopsis.slice(0, 160) || `Read ${manga.title} romance manhwa in high quality on ${SITE_NAME}.`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: manga.cover_url
        ? [
            {
              url: manga.cover_url,
              width: 600,
              height: 900,
              alt: `${manga.title} Cover`,
            },
          ]
        : [],
      type: 'book',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: manga.cover_url ? [manga.cover_url] : [],
    },
  };
}

export function constructChapterMetadata(chapter: ChapterDetail): Metadata {
  const url = `${SITE_URL}/manhwa/${chapter.manga.slug}/chapter-${chapter.chapter_number}/`;
  const title = `Chapter ${chapter.chapter_number} - ${chapter.manga.title} | ${SITE_NAME}`;
  const description = `Read ${chapter.manga.title} Chapter ${chapter.chapter_number} English manhwa online with high quality fast vertical scroll on ${SITE_NAME}.`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: chapter.manga.cover_url ? [{ url: chapter.manga.cover_url }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: chapter.manga.cover_url ? [chapter.manga.cover_url] : [],
    },
  };
}

export function generateMangaJsonLd(manga: MangaDetail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ComicSeries',
    name: manga.title,
    alternateName: manga.alternative_titles,
    description: manga.synopsis,
    url: `${SITE_URL}/manhwa/${manga.slug}/`,
    image: manga.cover_url,
    genre: manga.genres,
    author: manga.author ? { '@type': 'Person', name: manga.author } : undefined,
    illustrator: manga.artist ? { '@type': 'Person', name: manga.artist } : undefined,
    numberOfItems: manga.total_chapters,
  };
}

export function generateChapterJsonLd(chapter: ChapterDetail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ComicIssue',
    name: `Chapter ${chapter.chapter_number}: ${chapter.manga.title}`,
    issueNumber: chapter.chapter_number,
    datePublished: chapter.published_at,
    url: `${SITE_URL}/manhwa/${chapter.manga.slug}/chapter-${chapter.chapter_number}/`,
    partOfSeries: {
      '@type': 'ComicSeries',
      name: chapter.manga.title,
      url: `${SITE_URL}/manhwa/${chapter.manga.slug}/`,
    },
  };
}

export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}
