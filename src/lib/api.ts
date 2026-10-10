import {
  MangaDetail,
  MangaSummary,
  GenreItem,
} from '@/types/manga';
import { ChapterDetail } from '@/types/chapter';
import {
  PaginatedResponse,
  GenreArchiveResponse,
  SearchResponse,
  SitemapDataResponse,
  RedirectResponse,
} from '@/types/api';

const WP_API_URL = process.env.WORDPRESS_API_URL || 'https://api.romancetoon.com/wp-json';
const API_PREFIX = `${WP_API_URL.replace(/\/$/, '')}/romancetoon/v1`;

export async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_PREFIX}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      'Accept': 'application/json',
      ...options?.headers,
    },
  });

  if (res.status === 301) {
    const data = await res.json();
    return data as T;
  }

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('NOT_FOUND');
    }
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function getMangaList(params?: {
  page?: number;
  per_page?: number;
  genre?: string;
  status?: string;
  sort?: string;
}): Promise<PaginatedResponse<MangaSummary>> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.per_page) query.set('per_page', String(params.per_page));
  if (params?.genre) query.set('genre', params.genre);
  if (params?.status) query.set('status', params.status);
  if (params?.sort) query.set('sort', params.sort);

  const qs = query.toString();
  return fetchFromApi<PaginatedResponse<MangaSummary>>(`/manga${qs ? `?${qs}` : ''}`, {
    next: { tags: ['manga-list'], revalidate: 300 }, // 5 min default
  });
}

export async function getMangaBySlug(slug: string): Promise<MangaDetail | RedirectResponse> {
  return fetchFromApi<MangaDetail | RedirectResponse>(`/manga/${slug}`, {
    next: { tags: [`manga-${slug}`], revalidate: 600 }, // 10 min
  });
}

export async function getChapter(
  mangaSlug: string,
  chapterNumber: string
): Promise<ChapterDetail | RedirectResponse> {
  return fetchFromApi<ChapterDetail | RedirectResponse>(`/manga/${mangaSlug}/chapter/${chapterNumber}`, {
    next: { tags: [`chapter-${mangaSlug}-${chapterNumber}`], revalidate: 3600 }, // 1 hour
  });
}

export async function getGenres(): Promise<GenreItem[]> {
  return fetchFromApi<GenreItem[]>('/genres', {
    next: { tags: ['genres'], revalidate: 3600 },
  });
}

export async function getGenreBySlug(
  slug: string,
  page = 1
): Promise<GenreArchiveResponse> {
  return fetchFromApi<GenreArchiveResponse>(`/genres/${slug}?page=${page}`, {
    next: { tags: [`genre-${slug}`], revalidate: 600 },
  });
}

export async function getLatestUpdates(limit = 12): Promise<MangaSummary[]> {
  return fetchFromApi<MangaSummary[]>(`/latest-updates?limit=${limit}`, {
    next: { tags: ['latest-updates'], revalidate: 120 }, // 2 min
  });
}

export async function searchManga(
  query: string,
  page = 1
): Promise<SearchResponse> {
  const encoded = encodeURIComponent(query);
  return fetchFromApi<SearchResponse>(`/search?q=${encoded}&page=${page}`, {
    cache: 'no-store', // Search is dynamic
  });
}

export async function getSitemapData(): Promise<SitemapDataResponse> {
  return fetchFromApi<SitemapDataResponse>('/sitemap-data', {
    next: { tags: ['sitemaps'], revalidate: 3600 },
  });
}
