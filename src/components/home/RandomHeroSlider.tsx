'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MangaSummary } from '@/types/manga';
import {
  Sparkles,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Layers,
  Flame,
} from 'lucide-react';

interface RandomHeroSliderProps {
  initialManga: MangaSummary[];
}

export function RandomHeroSlider({ initialManga }: RandomHeroSliderProps) {
  const [items, setItems] = useState<MangaSummary[]>(initialManga);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Shuffle the items randomly on initial client mount
  useEffect(() => {
    if (initialManga && initialManga.length > 1) {
      const shuffled = [...initialManga].sort(() => 0.5 - Math.random());
      setItems(shuffled);
      setCurrentIndex(0);
    }
  }, [initialManga]);

  // Autoplay timer (every 6.5 seconds when not hovered/paused)
  useEffect(() => {
    if (items.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 6500);

    return () => clearInterval(timer);
  }, [items.length, isPaused]);

  if (!items || items.length === 0) {
    return (
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-surface-card via-surface to-rose-dark/30 border border-surface-border p-8 md:p-12 shadow-2xl">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-accent/15 px-3 py-1 text-xs font-semibold text-rose-soft border border-rose-accent/25">
            <Sparkles className="w-3.5 h-3.5" /> High-Resolution Vertical Webtoon Reader
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight text-text-main leading-tight">
            Immerse Yourself in <span className="text-rose-accent">Romantic Manhwa</span>
          </h1>
          <p className="text-base text-text-muted leading-relaxed">
            Discover passionate stories of royalty, reincarnated villainesses, and timeless romances.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/manhwa"
              className="inline-flex items-center gap-2 rounded-xl bg-rose-accent px-6 py-3 text-sm font-semibold text-white shadow-rose-glow hover:bg-rose-accent/90 transition"
            >
              Explore Directory
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const current = items[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleRandomPick = () => {
    if (items.length <= 1) return;
    let nextIdx = Math.floor(Math.random() * items.length);
    if (nextIdx === currentIndex) {
      nextIdx = (currentIndex + 1) % items.length;
    }
    setCurrentIndex(nextIdx);
  };

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  return (
    <section
      className="relative overflow-hidden rounded-3xl border border-surface-border bg-surface-card/85 shadow-rose-glow-lg backdrop-blur-md transition-all duration-500"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Blurred background cover image for ambient glow */}
      {current.cover_url && (
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <img
            src={current.cover_url}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover blur-3xl opacity-15 scale-125 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/60" />
        </div>
      )}

      {/* Main Slide Content */}
      <div className="p-5 sm:p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
        {/* Cover Image */}
        <Link
          href={`/manhwa/${current.slug}`}
          className="group relative shrink-0 block overflow-hidden rounded-2xl shadow-rose-glow ring-1 ring-surface-border transition hover:ring-rose-accent/50"
        >
          {current.cover_url ? (
            <img
              src={current.cover_url}
              alt={current.title}
              className="w-36 sm:w-44 md:w-56 aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-36 sm:w-44 md:w-56 aspect-[3/4] bg-surface-border flex items-center justify-center text-text-dim text-xs">
              Cover
            </div>
          )}

          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-bold text-white border border-white/10 flex items-center gap-1">
            <Flame className="w-3 h-3 text-rose-accent" />
            <span>Spotlight</span>
          </div>
        </Link>

        {/* Info & Details */}
        <div className="flex-1 min-w-0 text-center md:text-left space-y-3.5">
          {/* Top badges */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-accent/15 px-3 py-1 text-xs font-semibold text-rose-soft border border-rose-accent/30">
              <Sparkles className="w-3.5 h-3.5" /> Featured Manhwa
            </span>

            {current.status && (
              <span className="capitalize px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-surface border border-surface-border text-text-muted">
                {current.status}
              </span>
            )}

            {current.chapter_count > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-surface border border-surface-border text-text-muted flex items-center gap-1">
                <Layers className="w-3 h-3 text-rose-soft" />
                {current.chapter_count} Chapters
              </span>
            )}
          </div>

          {/* Title */}
          <Link href={`/manhwa/${current.slug}`}>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-text-main hover:text-rose-soft transition line-clamp-2 leading-tight">
              {current.title}
            </h2>
          </Link>

          {/* Genres Chips */}
          {current.genres && current.genres.length > 0 && (
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-0.5">
              {current.genres.slice(0, 4).map((g) => (
                <Link
                  key={g}
                  href={`/genre/${g.toLowerCase()}`}
                  className="rounded-lg bg-surface/80 hover:bg-surface-border px-2.5 py-1 text-[11px] font-medium text-text-dim hover:text-text-main border border-surface-border transition"
                >
                  {g}
                </Link>
              ))}
            </div>
          )}

          {/* Latest chapter indicator */}
          {current.latest_chapter && (
            <p className="text-xs text-text-dim">
              Latest Release:{' '}
              <span className="text-rose-soft font-semibold">
                Chapter {current.latest_chapter}
              </span>
            </p>
          )}

          {/* Actions & Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <Link
              href={`/manhwa/${current.slug}`}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-accent px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-rose-glow hover:bg-rose-accent/90 transition active:scale-95"
            >
              <BookOpen className="w-4 h-4" /> Start Reading
            </Link>

            <button
              onClick={handleRandomPick}
              className="inline-flex items-center gap-1.5 rounded-xl bg-surface hover:bg-surface-border border border-surface-border px-4 py-2.5 text-xs sm:text-sm font-semibold text-text-main hover:text-rose-soft transition active:scale-95"
              title="Surprise me with another random manhwa"
            >
              <Shuffle className="w-4 h-4 text-rose-accent" /> Surprise Me
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Controls Bar */}
      <div className="px-5 sm:px-8 pb-5 flex items-center justify-between border-t border-surface-border/50 pt-3 text-xs text-text-dim">
        {/* Slide Counter */}
        <div className="flex items-center gap-2 font-mono">
          <span className="font-bold text-text-main">{currentIndex + 1}</span>
          <span>/</span>
          <span>{items.length}</span>
        </div>

        {/* Slide Dots */}
        <div className="flex items-center gap-1.5 max-w-[200px] overflow-hidden">
          {items.slice(0, Math.min(items.length, 8)).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentIndex
                  ? 'w-6 bg-rose-accent'
                  : 'w-1.5 bg-surface-border hover:bg-text-dim'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Arrows */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrev}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-surface border border-surface-border text-text-muted hover:text-text-main hover:border-rose-accent/50 active:scale-95 transition"
            aria-label="Previous manhwa"
            title="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-surface border border-surface-border text-text-muted hover:text-text-main hover:border-rose-accent/50 active:scale-95 transition"
            aria-label="Next manhwa"
            title="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
