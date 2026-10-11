'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChapterDetail } from '@/types/chapter';
import { MangaSummary, ChapterSummary } from '@/types/manga';
import { MangaCard } from '@/components/manga/MangaCard';
import { useReadingHistory } from '@/hooks/useReadingHistory';
import { useBookmarks } from '@/hooks/useBookmarks';
import {
  Home,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Bookmark,
  ArrowUp,
  RefreshCw,
  Sparkles,
  X,
  Search,
  ArrowUpDown,
  List,
} from 'lucide-react';

interface ContinuousReaderProps {
  chapter: ChapterDetail;
  relatedManga?: MangaSummary[];
  allChapters?: ChapterSummary[];
}

export function ContinuousReader({
  chapter,
  relatedManga = [],
  allChapters = [],
}: ContinuousReaderProps) {
  const router = useRouter();
  const { recordChapter } = useReadingHistory();
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  // Chapter Drawer / Selector State
  const [showChapterDrawer, setShowChapterDrawer] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [sortDescending, setSortDescending] = useState(true);

  const mangaId = chapter.manga.id;
  const mangaSlug = chapter.manga.slug;
  const mangaTitle = chapter.manga.title;
  const coverUrl = chapter.manga.cover_url;
  const chapterNumber = chapter.chapter_number;

  useEffect(() => {
    // Record reading progress stably in local storage
    recordChapter({
      mangaId,
      mangaSlug,
      mangaTitle,
      coverUrl,
      chapterNumber,
    });
  }, [mangaId, mangaSlug, mangaTitle, coverUrl, chapterNumber, recordChapter]);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showChapterDrawer) {
        setShowChapterDrawer(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showChapterDrawer]);

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

  // Process and sort all available chapters for the quick picker
  const filteredChapters = useMemo(() => {
    let list = [...allChapters];

    // Sort numerically
    list.sort((a, b) => {
      const numA = parseFloat(a.chapter_number) || 0;
      const numB = parseFloat(b.chapter_number) || 0;
      return sortDescending ? numB - numA : numA - numB;
    });

    if (searchFilter.trim()) {
      const q = searchFilter.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.chapter_number.toLowerCase().includes(q) ||
          c.title?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [allChapters, sortDescending, searchFilter]);

  const handleSelectChapter = (slug: string) => {
    setShowChapterDrawer(false);
    router.push(`/manhwa/${chapter.manga.slug}/${slug}`);
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* Top Chapter Header Banner */}
      <div className="border-b border-surface-border bg-surface/90 backdrop-blur-md px-3 sm:px-4 py-2.5 sticky top-16 z-30 flex items-center justify-between text-sm gap-2">
        {/* Left: Quick Back & Home Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <Link
            href="/"
            title="Return to Home Page"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-surface-card border border-surface-border text-text-muted hover:text-text-main hover:border-rose-soft/50 transition text-xs font-semibold shrink-0"
          >
            <Home className="w-3.5 h-3.5 text-rose-accent" />
            <span className="hidden sm:inline">Home</span>
          </Link>

          <Link
            href={`/manhwa/${chapter.manga.slug}`}
            title="Return to Manhwa Overview"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-surface-card border border-surface-border text-text-muted hover:text-rose-soft hover:border-rose-soft/50 transition text-xs font-semibold truncate"
          >
            <BookOpen className="w-3.5 h-3.5 text-rose-soft shrink-0" />
            <span className="truncate max-w-[110px] sm:max-w-[260px]">{chapter.manga.title}</span>
          </Link>
        </div>

        {/* Right: Chapter Selector Trigger Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowChapterDrawer(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-accent/15 text-rose-accent hover:bg-rose-accent/25 border border-rose-accent/30 text-xs font-bold transition shadow-sm active:scale-95"
            title="Open Chapter List"
          >
            <span>Chapter {chapter.chapter_number}</span>
            <ChevronDown className="w-3 h-3 text-rose-accent" />
          </button>
        </div>
      </div>

      {/* Reserved Slot: Top Advertisement (Non-Intrusive) */}
      <div className="mx-auto max-w-3xl my-3 text-center px-4">
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
              className="relative w-full min-h-[360px] sm:min-h-[400px] flex items-center justify-center bg-surface-card/50 overflow-hidden"
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
      <div className="mx-auto max-w-2xl my-16 px-4 text-center">
        <h4 className="font-serif text-lg font-bold text-text-main mb-6">
          Finished reading Chapter {chapter.chapter_number}
        </h4>

        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {/* Previous Chapter */}
          {chapter.navigation.prev_chapter_slug ? (
            <Link
              href={`/manhwa/${chapter.manga.slug}/${chapter.navigation.prev_chapter_slug}`}
              className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-surface-card border border-surface-border px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-medium text-text-main hover:border-rose-accent transition"
            >
              <ChevronLeft className="w-4 h-4" /> Prev Chapter
            </Link>
          ) : (
            <span className="rounded-xl bg-surface-card/50 border border-surface-border/50 px-4 sm:px-5 py-2.5 text-xs sm:text-sm text-text-dim cursor-not-allowed">
              First Chapter
            </span>
          )}

          {/* Quick Chapter Selector from End of Chapter */}
          <button
            onClick={() => setShowChapterDrawer(true)}
            className="flex items-center gap-1.5 rounded-xl bg-surface-card border border-surface-border px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold text-text-main hover:border-rose-accent transition"
          >
            <List className="w-4 h-4 text-rose-soft" /> Select Chapter
          </button>

          {/* Back to Manhwa Details */}
          <Link
            href={`/manhwa/${chapter.manga.slug}`}
            className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-surface-card border border-rose-soft/40 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold text-rose-soft hover:bg-rose-soft/10 transition"
          >
            <BookOpen className="w-4 h-4" /> Overview
          </Link>

          {/* Return Home */}
          <Link
            href="/"
            className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-surface-card border border-surface-border px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-medium text-text-muted hover:text-text-main hover:border-rose-soft transition"
          >
            <Home className="w-4 h-4 text-rose-accent" /> Home
          </Link>

          {/* Next Chapter */}
          {chapter.navigation.next_chapter_slug ? (
            <Link
              href={`/manhwa/${chapter.manga.slug}/${chapter.navigation.next_chapter_slug}`}
              className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-rose-accent px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-rose-glow hover:bg-rose-accent/90 transition"
            >
              Next Chapter <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="rounded-xl bg-surface-card border border-surface-border px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold text-text-dim">
              All Chapters Released
            </span>
          )}
        </div>
      </div>

      {/* Recommended Romance Manhwa at End of Chapter */}
      {relatedManga && relatedManga.length > 0 && (
        <div className="mx-auto max-w-4xl my-16 px-4 pt-8 border-t border-surface-border/60">
          <div className="flex items-center gap-2 mb-6">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-accent/15 text-rose-accent">
              <Sparkles className="w-4 h-4" />
            </span>
            <h4 className="font-serif text-xl font-bold text-text-main">
              You May Also Like
            </h4>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {relatedManga.map((m) => (
              <MangaCard key={m.id} manga={m} />
            ))}
          </div>
        </div>
      )}

      {/* Floating Bottom Navigation Bar (Optimized for Mobile & Desktop) */}
      <div className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 sm:gap-1.5 rounded-full border border-surface-border/80 bg-surface/95 px-2 sm:px-3 py-1 sm:py-1.5 shadow-2xl shadow-black/80 backdrop-blur-xl ring-1 ring-white/10 max-w-[96vw]">
        {/* Home Button */}
        <Link
          href="/"
          className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-text-muted hover:bg-surface-card hover:text-rose-soft active:scale-95 transition"
          title="Return to Home"
          aria-label="Home"
        >
          <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-accent" />
        </Link>

        {/* Back to Manhwa Overview Button */}
        <Link
          href={`/manhwa/${chapter.manga.slug}`}
          className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-text-muted hover:bg-surface-card hover:text-rose-soft active:scale-95 transition"
          title="Return to Manhwa Overview"
          aria-label="Manhwa Overview"
        >
          <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Link>

        {/* Separator */}
        <div className="h-3.5 w-px bg-surface-border/80 mx-0.5" />

        {/* Previous Chapter */}
        {chapter.navigation.prev_chapter_slug ? (
          <Link
            href={`/manhwa/${chapter.manga.slug}/${chapter.navigation.prev_chapter_slug}`}
            className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-text-muted hover:bg-surface-card hover:text-text-main active:scale-95 transition"
            title="Previous Chapter"
            aria-label="Previous Chapter"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        ) : (
          <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center text-text-dim/30 cursor-not-allowed">
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </span>
        )}

        {/* Interactive Chapter Selector Button (Opens Full Chapters List Sheet) */}
        <button
          onClick={() => setShowChapterDrawer(true)}
          className="flex items-center gap-1 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-surface-card hover:bg-surface-border border border-rose-accent/30 hover:border-rose-accent text-xs font-bold text-text-main hover:text-rose-soft transition shadow-inner active:scale-95 whitespace-nowrap shrink-0"
          title="Tap to browse and jump between chapters"
          aria-label="Open Chapter Selector"
        >
          <span className="whitespace-nowrap">Ch. {chapter.chapter_number}</span>
          <ChevronDown className="w-3 h-3 text-rose-accent shrink-0" />
        </button>

        {/* Next Chapter */}
        {chapter.navigation.next_chapter_slug ? (
          <Link
            href={`/manhwa/${chapter.manga.slug}/${chapter.navigation.next_chapter_slug}`}
            className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-text-muted hover:bg-surface-card hover:text-text-main active:scale-95 transition"
            title="Next Chapter"
            aria-label="Next Chapter"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        ) : (
          <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center text-text-dim/30 cursor-not-allowed">
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </span>
        )}

        {/* Separator */}
        <div className="h-3.5 w-px bg-surface-border/80 mx-0.5" />

        {/* Bookmark Button */}
        <button
          onClick={() =>
            toggleBookmark({
              mangaId: chapter.manga.id,
              mangaSlug: chapter.manga.slug,
              mangaTitle: chapter.manga.title,
              coverUrl: chapter.manga.cover_url,
            })
          }
          className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full active:scale-95 transition ${
            isCurrentBookmarked
              ? 'text-rose-accent bg-rose-accent/15 ring-1 ring-rose-accent/30'
              : 'text-text-muted hover:bg-surface-card hover:text-text-main'
          }`}
          title={isCurrentBookmarked ? 'Bookmarked' : 'Add to Bookmarks'}
          aria-label="Bookmark this manhwa"
        >
          <Bookmark className={`w-3.5 h-3.5 ${isCurrentBookmarked ? 'fill-rose-accent' : ''}`} />
        </button>

        {/* Scroll to Top */}
        <button
          onClick={scrollToTop}
          className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-text-muted hover:bg-surface-card hover:text-text-main active:scale-95 transition"
          title="Scroll to Top"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Interactive Chapter Selector Bottom Sheet / Modal */}
      {showChapterDrawer && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setShowChapterDrawer(false)}
          />

          {/* Drawer Sheet */}
          <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 w-full sm:max-w-lg max-h-[85vh] sm:max-h-[80vh] bg-surface border border-surface-border rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
            {/* Mobile Drag Indicator */}
            <div className="w-12 h-1.5 bg-surface-border rounded-full mx-auto mt-3 sm:hidden shrink-0" />

            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-surface-border shrink-0">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-serif text-base sm:text-lg font-bold text-text-main flex items-center gap-2 truncate">
                    <List className="w-4 h-4 text-rose-accent shrink-0" />
                    <span>All Chapters</span>
                    <span className="text-xs font-normal text-text-dim">
                      ({allChapters.length > 0 ? allChapters.length : '—'})
                    </span>
                  </h3>
                  <p className="text-xs text-text-dim truncate mt-0.5">
                    {chapter.manga.title}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/manhwa/${chapter.manga.slug}`}
                    onClick={() => setShowChapterDrawer(false)}
                    className="text-xs font-semibold text-rose-soft hover:underline hidden sm:inline"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => setShowChapterDrawer(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-card border border-surface-border text-text-muted hover:text-text-main transition"
                    aria-label="Close chapter list"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Search filter & Sort toggle bar */}
              <div className="mt-3.5 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-text-dim" />
                  <input
                    type="text"
                    placeholder="Search chapter number..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full rounded-xl bg-surface-card pl-9 pr-3 py-1.5 text-xs text-text-main placeholder-text-dim border border-surface-border focus:border-rose-accent focus:outline-none focus:ring-1 focus:ring-rose-accent"
                  />
                  {searchFilter && (
                    <button
                      onClick={() => setSearchFilter('')}
                      className="absolute right-2.5 top-2 text-text-dim hover:text-text-main text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setSortDescending((prev) => !prev)}
                  className="flex items-center gap-1 rounded-xl bg-surface-card border border-surface-border px-3 py-1.5 text-xs font-medium text-text-muted hover:text-text-main hover:border-rose-soft/50 transition shrink-0"
                  title="Toggle chapter order"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-rose-soft" />
                  <span>{sortDescending ? 'Newest' : 'Oldest'}</span>
                </button>
              </div>
            </div>

            {/* Scrollable Chapter List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 divide-y-0">
              {filteredChapters.length === 0 ? (
                <div className="py-12 text-center text-xs text-text-dim">
                  {allChapters.length === 0
                    ? 'Loading chapter list...'
                    : 'No chapters found matching your filter.'}
                </div>
              ) : (
                filteredChapters.map((ch) => {
                  const isCurrent =
                    ch.chapter_number.toString() === chapter.chapter_number.toString();

                  return (
                    <button
                      key={ch.id}
                      onClick={() => handleSelectChapter(ch.chapter_slug)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition active:scale-[0.99] ${
                        isCurrent
                          ? 'bg-rose-accent/15 border-rose-accent text-rose-accent font-bold shadow-md shadow-rose-accent/10'
                          : 'bg-surface-card/60 border-surface-border/60 hover:bg-surface-card hover:border-rose-soft/40 text-text-main'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold shrink-0 ${
                            isCurrent
                              ? 'bg-rose-accent text-white'
                              : 'bg-surface border border-surface-border text-text-muted'
                          }`}
                        >
                          {ch.chapter_number}
                        </span>
                        <div className="truncate">
                          <p className="text-xs sm:text-sm truncate">
                            Chapter {ch.chapter_number}
                          </p>
                          {ch.title && ch.title !== `Chapter ${ch.chapter_number}` && (
                            <p className="text-[11px] text-text-dim truncate mt-0.5">
                              {ch.title}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {isCurrent ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-accent text-white uppercase tracking-wider">
                            Reading
                          </span>
                        ) : (
                          ch.image_count > 0 && (
                            <span className="text-[11px] text-text-dim">
                              {ch.image_count} pages
                            </span>
                          )
                        )}
                        <ChevronRight className={`w-3.5 h-3.5 ${isCurrent ? 'text-rose-accent' : 'text-text-dim'}`} />
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
