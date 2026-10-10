import { MangaSummary, GenreItem } from './manga';

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  total_pages: number;
  page: number;
  per_page: number;
}

export interface GenreArchiveResponse {
  genre: GenreItem;
  items: MangaSummary[];
  total: number;
  total_pages: number;
  page: number;
}

export interface SearchResponse {
  items: MangaSummary[];
  total: number;
  total_pages: number;
  page: number;
  per_page: number;
  query: string;
}

export interface SitemapItem {
  url: string;
  lastmod: string;
}

export interface SitemapDataResponse {
  manga: SitemapItem[];
  chapters: SitemapItem[];
}

export interface RedirectResponse {
  status: 301;
  redirect: true;
  target_url: string;
  new_slug: string;
}
