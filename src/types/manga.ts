export interface MangaSummary {
  id: number;
  title: string;
  slug: string;
  cover_url: string;
  status: 'ongoing' | 'completed' | 'hiatus';
  chapter_count: number;
  latest_chapter: string;
  genres: string[];
  updated_at: string;
}

export interface ChapterSummary {
  id: number;
  chapter_number: string;
  chapter_slug: string;
  title: string;
  published_at: string;
  image_count: number;
}

export interface MangaDetail {
  id: number;
  title: string;
  slug: string;
  synopsis: string;
  excerpt: string;
  cover_url: string;
  author: string;
  artist: string;
  publication_status: 'ongoing' | 'completed' | 'hiatus';
  release_year: number;
  alternative_titles: string[];
  genres: string[];
  total_chapters: number;
  chapters: ChapterSummary[];
  published_at: string;
  updated_at: string;
}

export interface GenreItem {
  id: number;
  name: string;
  slug: string;
  count: number;
}
