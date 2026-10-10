'use client';

import { useState, useEffect } from 'react';

export interface BookmarkItem {
  mangaId: number;
  mangaSlug: string;
  mangaTitle: string;
  coverUrl: string;
  savedAt: number;
}

const STORAGE_KEY = 'rt_bookmarks';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setBookmarks(JSON.parse(stored));
      }
    } catch {}
    setIsLoaded(true);
  }, []);

  const toggleBookmark = (manga: Omit<BookmarkItem, 'savedAt'>) => {
    try {
      const exists = bookmarks.some((b) => b.mangaSlug === manga.mangaSlug);
      let updated: BookmarkItem[];

      if (exists) {
        updated = bookmarks.filter((b) => b.mangaSlug !== manga.mangaSlug);
      } else {
        updated = [{ ...manga, savedAt: Date.now() }, ...bookmarks];
      }

      setBookmarks(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  const isBookmarked = (slug: string) => {
    return bookmarks.some((b) => b.mangaSlug === slug);
  };

  return { bookmarks, isLoaded, toggleBookmark, isBookmarked };
}
