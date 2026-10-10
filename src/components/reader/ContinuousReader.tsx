'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChapterDetail } from '@/types/chapter';
import { useReadingHistory } from '@/hooks/useReadingHistory';
import { useBookmarks } from '@/hooks/useBookmarks';
import { ChevronLeft, ChevronRight, Bookmark, ArrowUp, RefreshCw, BookOpen } from 'lucide-react';

interface ContinuousReaderProps {
  chapter: ChapterDetail;
}

export function ContinuousReader({ chapter }: ContinuousReaderProps) {
  const { recordChapter } = useReadingHistory();
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  useEffect(() => {
    // Record reading progress in local storage
    recordChapter({
      mangaId: chapter.manga.id,
      mangaSlug: chapter.manga.slug,
      mangaTitle: chapter.manga.title,
      coverUrl: chapter.manga.cover_url,
      chapterNumber: chapter.chapter_number,
    });
  }, [chapter, recordChapter]);

  const handleImageError = (index: number) => {
    setFailedImages((prev) => ({ ...prev, [index]: true }));
  };

  const handleRetryImage = (index: number) => {
    setFailedImages((prev) => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isCurrentBookmarked = isBookmarked(chapter.manga.slug);

  return (
    <div className="relative min-h-screen bg-background">
      {/* Top Chapter Header Banner */}
      <div className="border-b border-surface-border bg-surface/80 backdrop-blur-md px-4 py-3 sticky top-16 z-30 flex items-center justify-between text-sm">
        <Link
          href={`/manhwa/${chapter.manga.slug}`}
          className="font-medium text-text-muted hover:text-rose-soft flex items-center gap-1.5 transition truncate max-w-[60%]"
        >
          <BookOpen className="w-4 h-4 text-rose-accent flex-shrink-0" />
          <span className="truncate">{chapter.manga.title}</span>
        </Link>
        <span className="font-semibold text-text-main flex-shrink-0">
          Chapter {chapter.chapter_number}
        </span>
      </div>

      {/* Reserved Slot: Top Advertisement (Non-Intrusive) */}
      <div className="mx-auto max-w-3xl my-3 text-center">
        <div className="bg-surface-card/40 border border-surface-border/40 rounded-lg p-2 text-xs text-text-dim">
          Advertisement Space
        </div>
      </div>

      {/* Continuous Vertical Webtoon Strip */}
      <div className="mx-auto max-w-3xl flex flex-col items-center">
        {chapter.images.map((rawUrl, idx) => {
          const url = rawUrl.replace(/^http:\/\//i, 'https://');
          const isPriority = idx < 2;
          const isFailed = failedImages[idx];

          return (
            <div
              key={`${url}-${idx}`}
              className="relative w-full min-h-[400px] flex items-center justify-center bg-surface-card/50 overflow-hidden"
            >
              {isFailed ? (
                <div className="flex flex-col items-center justify-center p-8 text-center text-text-dim">
                  <p className="text-sm mb-3">Image {idx + 1} failed to load.</p>
                  <button
                    onClick={() => handleRetryImage(idx)}
                    className="flex items-center gap-2 rounded-lg bg-surface border border-surface-border px-3 py-1.5 text-xs text-text-main hover:border-rose-accent transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Retry Image
                  </button>
                </div>
              ) : (
                <img
                  src={url}
                  alt={`${chapter.manga.title} Chapter ${chapter.chapter_number} - Page ${idx + 1}`}
                  loading={isPriority ? 'eager' : 'lazy'}
                  decoding="async"
                  onError={() => handleImageError(idx)}
                  className="w-full h-auto block select-none"
                />
              )}

              {/* Reserved Slot: Mid-Chapter Break Ad (after image 15) */}
              {idx === 14 && (
                <div className="w-full my-4 py-2 bg-surface-card/30 border-y border-surface-border/40 text-center text-xs text-text-dim">
                  Advertisement Space
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Chapter End Navigation Actions */}
      <div className="mx-auto max-w-xl my-16 px-4 text-center">
        <h4 className="font-serif text-lg font-bold text-text-main mb-6">
          Finished reading Chapter {chapter.chapter_number}
        </h4>

        <div className="flex items-center justify-center gap-4">
          {chapter.navigation.prev_chapter_slug ? (
            <Link
              href={`/manhwa/${chapter.manga.slug}/${chapter.navigation.prev_chapter_slug}`}
              className="flex items-center gap-2 rounded-xl bg-surface-card border border-surface-border px-5 py-2.5 text-sm font-medium text-text-main hover:border-rose-accent transition"
            >
              <ChevronLeft className="w-4 h-4" /> Previous Chapter
            </Link>
          ) : (
            <span className="rounded-xl bg-surface-card/50 border border-surface-border/50 px-5 py-2.5 text-sm text-text-dim cursor-not-allowed">
              First Chapter
            </span>
          )}

          {chapter.navigation.next_chapter_slug ? (
            <Link
              href={`/manhwa/${chapter.manga.slug}/${chapter.navigation.next_chapter_slug}`}
              className="flex items-center gap-2 rounded-xl bg-rose-accent px-6 py-2.5 text-sm font-semibold text-white shadow-rose-glow hover:bg-rose-accent/90 transition"
            >
              Next Chapter <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href={`/manhwa/${chapter.manga.slug}`}
              className="rounded-xl bg-surface-card border border-rose-accent/40 px-6 py-2.5 text-sm font-semibold text-rose-soft"
            >
              All Chapters Released
            </Link>
          )}
        </div>
      </div>

      {/* Floating Bottom Navigation Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-full border border-surface-border bg-surface/90 px-4 py-2 shadow-2xl backdrop-blur-md">
        {chapter.navigation.prev_chapter_slug ? (
          <Link
            href={`/manhwa/${chapter.manga.slug}/${chapter.navigation.prev_chapter_slug}`}
            className="flex h-9 w-9 items-center justify-center rounded-full text-text-muted hover:bg-surface-hover hover:text-text-main transition"
            title="Previous Chapter"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
        ) : (
          <span className="flex h-9 w-9 items-center justify-center text-text-dim/40 cursor-not-allowed">
            <ChevronLeft className="w-5 h-5" />
          </span>
        )}

        <Link
          href={`/manhwa/${chapter.manga.slug}`}
          className="px-3 text-xs font-semibold text-text-main hover:text-rose-soft transition border-x border-surface-border"
        >
          Ch. {chapter.chapter_number}
        </Link>

        {chapter.navigation.next_chapter_slug ? (
          <Link
            href={`/manhwa/${chapter.manga.slug}/${chapter.navigation.next_chapter_slug}`}
            className="flex h-9 w-9 items-center justify-center rounded-full text-text-muted hover:bg-surface-hover hover:text-text-main transition"
            title="Next Chapter"
          >
            <ChevronRight className="w-5 h-5" />
          </Link>
        ) : (
          <span className="flex h-9 w-9 items-center justify-center text-text-dim/40 cursor-not-allowed">
            <ChevronRight className="w-5 h-5" />
          </span>
        )}

        <button
          onClick={() =>
            toggleBookmark({
              mangaId: chapter.manga.id,
              mangaSlug: chapter.manga.slug,
              mangaTitle: chapter.manga.title,
              coverUrl: chapter.manga.cover_url,
            })
          }
          className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
            isCurrentBookmarked
              ? 'text-rose-accent'
              : 'text-text-muted hover:bg-surface-hover hover:text-text-main'
          }`}
          title={isCurrentBookmarked ? 'Bookmarked' : 'Add to Bookmarks'}
        >
          <Bookmark className={`w-4 h-4 ${isCurrentBookmarked ? 'fill-rose-accent' : ''}`} />
        </button>

        <button
          onClick={scrollToTop}
          className="flex h-9 w-9 items-center justify-center rounded-full text-text-muted hover:bg-surface-hover hover:text-text-main transition"
          title="Scroll to Top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
