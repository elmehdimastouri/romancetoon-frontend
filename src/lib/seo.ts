import { Metadata } from 'next';
import { MangaDetail } from '@/types/manga';
import { ChapterDetail } from '@/types/chapter';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://romancetoon.com';
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'RomanceToon';

/**
 * Metadata for Manga Detail Page
 * Title format requested: "Read {Title} Romance Manhwa" (absolute, without site name suffix)
 */
export function constructMangaMetadata(manga: MangaDetail): Metadata {
  const url = `${SITE_URL}/manhwa/${manga.slug}/`;
  const title = `Read ${manga.title} Romance Manhwa`;
  const description =
    manga.excerpt ||
    manga.synopsis?.slice(0, 160) ||
    `Read ${manga.title} romance manhwa with high-quality English scans. Follow ${manga.title} and all latest chapters with fast vertical scrolling online.`;

  return {
    title: {
      absolute: title,
    },
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

/**
 * Metadata for Chapter Reader Page
 * Title format requested: "Read Chapter {Number} of {Title} Romance Manhwa" (absolute, without site name suffix)
 */
export function constructChapterMetadata(chapter: ChapterDetail): Metadata {
  const url = `${SITE_URL}/manhwa/${chapter.manga.slug}/chapter-${chapter.chapter_number}/`;
  const title = `Read Chapter ${chapter.chapter_number} of ${chapter.manga.title} Romance Manhwa`;
  const description = `Read ${chapter.manga.title} Chapter ${chapter.chapter_number} in high quality English on the continuous vertical reader. Follow this romance story online.`;

  return {
    title: {
      absolute: title,
    },
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

/**
 * Metadata for Genre Page
 * Title format requested: "Read Best {Genre Name} Romance manhwa"
 */
export function constructGenreMetadata(genre: { name: string; slug: string }): Metadata {
  const url = `${SITE_URL}/genre/${genre.slug}/`;
  const title = `Read Best ${genre.name} Romance manhwa`;
  const description = `Discover and read the best ${genre.name.toLowerCase()} romance manhwa and webtoons online in high quality English.`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

/**
 * Schema.org ComicSeries / Book for Manga Detail
 */
export function generateMangaJsonLd(manga: MangaDetail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ComicSeries',
    '@id': `${SITE_URL}/manhwa/${manga.slug}/#series`,
    name: manga.title,
    headline: `Read ${manga.title} Romance Manhwa`,
    alternateName: manga.alternative_titles,
    description: manga.synopsis,
    url: `${SITE_URL}/manhwa/${manga.slug}/`,
    image: manga.cover_url,
    genre: manga.genres,
    inLanguage: 'en',
    author: manga.author ? { '@type': 'Person', name: manga.author } : undefined,
    illustrator: manga.artist ? { '@type': 'Person', name: manga.artist } : undefined,
    numberOfItems: manga.total_chapters,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

/**
 * Schema.org ComicIssue for Chapter Reader
 */
export function generateChapterJsonLd(chapter: ChapterDetail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ComicIssue',
    '@id': `${SITE_URL}/manhwa/${chapter.manga.slug}/chapter-${chapter.chapter_number}/#issue`,
    name: `Read Chapter ${chapter.chapter_number} of ${chapter.manga.title} Romance Manhwa`,
    issueNumber: chapter.chapter_number,
    datePublished: chapter.published_at,
    inLanguage: 'en',
    url: `${SITE_URL}/manhwa/${chapter.manga.slug}/chapter-${chapter.chapter_number}/`,
    partOfSeries: {
      '@type': 'ComicSeries',
      name: chapter.manga.title,
      url: `${SITE_URL}/manhwa/${chapter.manga.slug}/`,
    },
  };
}

/**
 * Schema.org Home Page structured data (WebSite + SearchAction + Organization)
 */
export function generateHomeJsonLd() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: 'Premier destination for English romance, fantasy, and historical manhwa with continuous vertical reader.',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/icon`,
    },
  ];
}

/**
 * Schema.org Genre / CollectionPage structured data
 */
export function generateGenreJsonLd(genreName: string, genreSlug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}/genre/${genreSlug}/#collection`,
    name: `Read Best ${genreName} Romance manhwa`,
    url: `${SITE_URL}/genre/${genreSlug}/`,
    description: `Collection of top rated ${genreName.toLowerCase()} romance manhwa and webtoons.`,
    inLanguage: 'en',
  };
}

/**
 * Schema.org BreadcrumbList for rich snippet breadcrumb hierarchy
 */
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
