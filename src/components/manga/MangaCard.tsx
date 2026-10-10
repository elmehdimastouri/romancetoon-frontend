import Link from 'next/link';
import { MangaSummary } from '@/types/manga';
import { BookOpen } from 'lucide-react';

interface MangaCardProps {
  manga: MangaSummary;
}

export function MangaCard({ manga }: MangaCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-surface-card border border-surface-border hover:border-rose-accent/40 transition duration-300 hover:shadow-rose-glow">
      {/* Cover Image Container */}
      <Link href={`/manhwa/${manga.slug}`} className="relative aspect-[3/4] w-full overflow-hidden bg-surface">
        {manga.cover_url ? (
          <img
            src={manga.cover_url}
            alt={manga.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-card text-text-dim">
            <BookOpen className="h-10 w-10 opacity-30" />
          </div>
        )}

        {/* Status Badge */}
        <span className="absolute top-2.5 left-2.5 rounded-md bg-black/75 px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase text-rose-soft backdrop-blur-sm border border-rose-soft/20">
          {manga.status}
        </span>

        {/* Chapters Badge */}
        {manga.chapter_count > 0 && (
          <span className="absolute bottom-2.5 right-2.5 rounded-md bg-rose-burgundy/90 px-2 py-0.5 text-[11px] font-semibold text-rose-soft backdrop-blur-sm">
            {manga.chapter_count} Ch
          </span>
        )}
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="font-serif font-bold text-sm text-text-main group-hover:text-rose-soft transition line-clamp-1">
          <Link href={`/manhwa/${manga.slug}`}>{manga.title}</Link>
        </h3>

        {/* Genres tag list */}
        {manga.genres && manga.genres.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {manga.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="text-[10px] text-text-dim bg-surface px-1.5 py-0.5 rounded border border-surface-border/60"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
