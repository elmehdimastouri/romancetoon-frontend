export interface ChapterNavigation {
  prev_chapter_number: string | null;
  prev_chapter_slug: string | null;
  next_chapter_number: string | null;
  next_chapter_slug: string | null;
}

export interface ChapterParentManga {
  id: number;
  title: string;
  slug: string;
  cover_url: string;
}

export interface ChapterDetail {
  id: number;
  title: string;
  chapter_number: string;
  chapter_slug: string;
  published_at: string;
  manga: ChapterParentManga;
  navigation: ChapterNavigation;
  images: string[];
  image_count: number;
}
