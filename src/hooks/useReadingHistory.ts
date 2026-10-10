'use client';

import { useState, useEffect } from 'react';

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

  const recordChapter = (item: Omit<HistoryItem, 'updatedAt'>) => {
    try {
      const existing = history.filter((h) => h.mangaSlug !== item.mangaSlug);
      const updated: HistoryItem[] = [
        { ...item, updatedAt: Date.now() },
        ...existing,
      ].slice(0, MAX_HISTORY_ITEMS);

      setHistory(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  };

  const clearHistory = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setHistory([]);
    } catch {}
  };

  return { history, isLoaded, recordChapter, clearHistory };
}
