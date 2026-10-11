'use client';

import { useState, useEffect, useCallback } from 'react';

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

  const toggleBookmark = useCallback((manga: Omit<BookmarkItem, 'savedAt'>) => {
    try {
      setBookmarks((prev) => {
        const exists = prev.some((b) => b.mangaSlug === manga.mangaSlug);
        let updated: BookmarkItem[];

        if (exists) {
          updated = prev.filter((b) => b.mangaSlug !== manga.mangaSlug);
        } else {
          updated = [{ ...manga, savedAt: Date.now() }, ...prev];
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch {}
  }, []);

  const removeBookmark = useCallback((slug: string) => {
    try {
      setBookmarks((prev) => {
        const updated = prev.filter((b) => b.mangaSlug !== slug);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch {}
  }, []);

  const isBookmarked = useCallback(
    (slug: string) => {
      return bookmarks.some((b) => b.mangaSlug === slug);
    },
    [bookmarks]
  );

  return { bookmarks, isLoaded, toggleBookmark, removeBookmark, isBookmarked };
}
