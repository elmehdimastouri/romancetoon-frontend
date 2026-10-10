import { MetadataRoute } from 'next';
import { getSitemapData, getGenres } from '@/lib/api';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://romancetoon.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/manhwa/`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
  ];

  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    const [sitemapData, genres] = await Promise.all([
      getSitemapData(),
      getGenres(),
    ]);

    // 1. Genres
    const genreEntries: MetadataRoute.Sitemap = genres.map((g) => ({
      url: `${SITE_URL}/genre/${g.slug}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }));

    // 2. Published Manga
    const mangaEntries: MetadataRoute.Sitemap = sitemapData.manga.map((m) => ({
      url: `${SITE_URL}${m.url}`,
      lastModified: new Date(m.lastmod),
      changeFrequency: 'daily',
      priority: 0.85,
    }));

    // 3. Strictly Published Chapters
    const chapterEntries: MetadataRoute.Sitemap = sitemapData.chapters.map((c) => ({
      url: `${SITE_URL}${c.url}`,
      lastModified: new Date(c.lastmod),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

    dynamicRoutes = [...genreEntries, ...mangaEntries, ...chapterEntries];
  } catch {
    // If backend is during initial deployment, return static entries
  }

  return [...staticRoutes, ...dynamicRoutes];
}
