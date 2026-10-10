'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Bookmark, History, Trash2, ArrowRight, BookOpen } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useReadingHistory } from '@/hooks/useReadingHistory';

function LibraryContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'history' ? 'history' : 'bookmarks';
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'history'>(initialTab);

  const { bookmarks, removeBookmark } = useBookmarks();
  const { history, clearHistory } = useReadingHistory();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b border-surface-border pb-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text-main flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-rose-accent" />
          My Library
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Your saved favorite manhwa and recent reading history stored locally on your device.
        </p>

        {/* Tab switcher */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
              activeTab === 'bookmarks'
                ? 'bg-rose-accent text-white shadow-lg shadow-rose-accent/20'
                : 'bg-surface-card text-text-muted hover:text-text-main hover:bg-surface-border'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            Saved Bookmarks ({bookmarks.length})
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
              activeTab === 'history'
                ? 'bg-rose-accent text-white shadow-lg shadow-rose-accent/20'
                : 'bg-surface-card text-text-muted hover:text-text-main hover:bg-surface-border'
            }`}
          >
            <History className="w-4 h-4" />
            Reading History ({history.length})
          </button>
        </div>
      </div>

      {/* Bookmarks Tab Content */}
      {activeTab === 'bookmarks' && (
        <div className="mt-8">
          {bookmarks.length === 0 ? (
            <div className="rounded-2xl border border-surface-border bg-surface-card p-12 text-center max-w-md mx-auto">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-accent/15 text-rose-accent mb-4">
                <Bookmark className="h-7 w-7" />
              </div>
              <h3 className="font-serif text-lg font-bold text-text-main">No bookmarks yet</h3>
              <p className="mt-2 text-sm text-text-muted">
                Explore our collection and click the &ldquo;Add to Library&rdquo; button on any manhwa to keep track of your favorites.
              </p>
              <Link
                href="/manhwa"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-rose-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-600 transition"
              >
                Browse All Manhwa <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {bookmarks.map((manga) => (
                <div
                  key={manga.mangaSlug}
                  className="group relative flex flex-col rounded-2xl border border-surface-border bg-surface-card p-2 sm:p-3 transition hover:border-rose-accent/50 hover:shadow-xl hover:shadow-rose-accent/5"
                >
                  <Link href={`/manhwa/${manga.mangaSlug}`} className="block overflow-hidden rounded-xl">
                    {manga.coverUrl ? (
                      <img
                        src={manga.coverUrl}
                        alt={manga.mangaTitle}
                        className="aspect-[3/4] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="aspect-[3/4] w-full bg-surface-border flex items-center justify-center text-text-dim text-xs">
                        No Cover
                      </div>
                    )}
                  </Link>

                  <div className="mt-3 flex flex-1 flex-col justify-between">
                    <div>
                      <Link href={`/manhwa/${manga.mangaSlug}`}>
                        <h3 className="font-serif text-sm font-semibold text-text-main group-hover:text-rose-soft line-clamp-2 transition">
                          {manga.mangaTitle}
                        </h3>
                      </Link>
                      <span className="text-[11px] text-text-dim mt-1 block">
                        Saved: {new Date(manga.savedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-surface-border pt-2">
                      <Link
                        href={`/manhwa/${manga.mangaSlug}`}
                        className="text-xs font-semibold text-rose-soft hover:underline"
                      >
                        Read Now
                      </Link>
                      <button
                        onClick={() => removeBookmark(manga.mangaSlug)}
                        className="text-text-dim hover:text-rose-accent transition p-1"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reading History Tab Content */}
      {activeTab === 'history' && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium text-text-muted">
              Recently opened chapters (saved locally)
            </h2>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="flex items-center gap-1.5 text-xs text-text-dim hover:text-rose-accent transition px-3 py-1.5 rounded-lg border border-surface-border hover:border-rose-accent/40"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear History
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="rounded-2xl border border-surface-border bg-surface-card p-12 text-center max-w-md mx-auto">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-soft/15 text-rose-soft mb-4">
                <History className="h-7 w-7" />
              </div>
              <h3 className="font-serif text-lg font-bold text-text-main">No history yet</h3>
              <p className="mt-2 text-sm text-text-muted">
                Chapters you read will automatically appear here so you can pick up right where you left off.
              </p>
              <Link
                href="/manhwa"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-rose-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-600 transition"
              >
                Start Reading <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {history.map((item) => (
                <div
                  key={`${item.mangaSlug}-${item.chapterNumber}`}
                  className="group flex gap-3 rounded-2xl border border-surface-border bg-surface-card p-3 transition hover:border-rose-soft/50 hover:shadow-lg"
                >
                  <Link href={`/manhwa/${item.mangaSlug}`} className="shrink-0 w-20 overflow-hidden rounded-xl">
                    {item.coverUrl ? (
                      <img
                        src={item.coverUrl}
                        alt={item.mangaTitle}
                        className="aspect-[3/4] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="aspect-[3/4] w-full bg-surface-border flex items-center justify-center text-text-dim text-xs">
                        Cover
                      </div>
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <Link href={`/manhwa/${item.mangaSlug}`}>
                        <h4 className="font-serif text-sm font-semibold text-text-main group-hover:text-rose-soft line-clamp-2 transition">
                          {item.mangaTitle}
                        </h4>
                      </Link>
                      <p className="text-xs text-rose-soft font-medium mt-1">
                        Chapter {item.chapterNumber}
                      </p>
                      <p className="text-[11px] text-text-dim mt-0.5">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <Link
                      href={`/manhwa/${item.mangaSlug}/chapter-${item.chapterNumber}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-text-main hover:text-rose-soft transition mt-2"
                    >
                      Continue Reading <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function LibraryPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-16 text-center text-text-muted">Loading library...</div>}>
      <LibraryContent />
    </Suspense>
  );
}
