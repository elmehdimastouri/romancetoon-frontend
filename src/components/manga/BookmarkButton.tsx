'use client';

import { useBookmarks } from '@/hooks/useBookmarks';
import { Bookmark, Check } from 'lucide-react';

interface BookmarkButtonProps {
  manga: {
    id: number;
    title: string;
    slug: string;
    cover_url: string;
  };
}

export function BookmarkButton({ manga }: BookmarkButtonProps) {
  const { toggleBookmark, isBookmarked, isLoaded } = useBookmarks();
  const bookmarked = isLoaded && isBookmarked(manga.slug);

  const handleClick = () => {
    toggleBookmark({
      mangaId: manga.id,
      mangaSlug: manga.slug,
      mangaTitle: manga.title,
      coverUrl: manga.cover_url,
    });
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition border ${
        bookmarked
          ? 'bg-rose-burgundy/80 border-rose-accent text-rose-soft shadow-rose-glow'
          : 'bg-surface border-surface-border text-text-muted hover:border-rose-soft hover:text-text-main'
      }`}
    >
      <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-rose-soft text-rose-soft' : ''}`} />
      <span>{bookmarked ? 'Bookmarked' : 'Add to Library'}</span>
      {bookmarked && <Check className="w-3.5 h-3.5 text-rose-soft" />}
    </button>
  );
}
