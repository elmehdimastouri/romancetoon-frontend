'use client';

import { useState, useEffect, useCallback } from 'react';

export interface HistoryItem {
  mangaId: number;
  mangaSlug: string;
  mangaTitle: string;
  coverUrl: string;
  chapterNumber: string;
  updatedAt: number;
}

const STORAGE_KEY = 'rt_reading_history';
const MAX_HISTORY_ITEMS = 50;

export function useReadingHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      // Ignore storage errors in private browsing
    }
    setIsLoaded(true);
  }, []);

  const recordChapter = useCallback((item: Omit<HistoryItem, 'updatedAt'>) => {
    try {
      setHistory((prev) => {
        // If already the top item with the exact same manga and chapter, do not re-render
        if (
          prev.length > 0 &&
          prev[0].mangaSlug === item.mangaSlug &&
          prev[0].chapterNumber === item.chapterNumber
        ) {
          return prev;
        }

        const existing = prev.filter((h) => h.mangaSlug !== item.mangaSlug);
        const updated: HistoryItem[] = [
          { ...item, updatedAt: Date.now() },
          ...existing,
        ].slice(0, MAX_HISTORY_ITEMS);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch {
      // Ignore storage errors
    }
  }, []);

  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setHistory([]);
    } catch {}
  }, []);

  return { history, isLoaded, recordChapter, clearHistory };
}
