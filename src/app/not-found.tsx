import Link from 'next/link';
import { HeartCrack, ArrowLeft, BookOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 sm:py-32 text-center space-y-6">
      <div className="flex justify-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-dark/40 text-rose-soft ring-1 ring-rose-soft/20 shadow-rose-glow">
          <HeartCrack className="h-10 w-10 text-rose-accent" />
        </span>
      </div>

      <div className="space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-text-main">
          Chapter or Page Not Found
        </h1>
        <p className="text-sm text-text-muted leading-relaxed max-w-md mx-auto">
          The romantic manhwa or chapter you are looking for may have moved, been renamed, or is currently unpublished.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-rose-accent px-6 py-3 text-sm font-semibold text-white shadow-rose-glow hover:bg-rose-accent/90 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Return Home
        </Link>
        <Link
          href="/manhwa"
          className="inline-flex items-center gap-2 rounded-xl bg-surface-card border border-surface-border px-6 py-3 text-sm font-semibold text-text-main hover:border-rose-soft transition"
        >
          <BookOpen className="w-4 h-4 text-rose-soft" /> Browse Directory
        </Link>
      </div>
    </div>
  );
}
