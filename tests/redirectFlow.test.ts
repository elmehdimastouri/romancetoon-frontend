import fs from 'fs';
import path from 'path';
import type { MangaDetail } from '../src/types/manga';
import type { ChapterDetail } from '../src/types/chapter';
import type { RedirectResponse } from '../src/types/api';

console.log('Running redirectFlow and error-handling tests...');

/**
 * Simulates Next.js navigation control-flow exceptions:
 * - permanentRedirect() throws an Error('NEXT_REDIRECT') with digest metadata
 * - notFound() throws an Error('NEXT_NOT_FOUND')
 */
class NextRedirectSignal extends Error {
  readonly digest: string;
  readonly targetUrl: string;
  readonly statusCode: number;

  constructor(targetUrl: string, statusCode = 308) {
    super('NEXT_REDIRECT');
    this.targetUrl = targetUrl;
    this.statusCode = statusCode;
    this.digest = `NEXT_REDIRECT;replace;${targetUrl};${statusCode};`;
  }
}

class NextNotFoundSignal extends Error {
  readonly digest = 'NEXT_HTTP_ERROR_FALLBACK;404';

  constructor() {
    super('NEXT_NOT_FOUND');
  }
}

function simulatePermanentRedirect(url: string): never {
  throw new NextRedirectSignal(url, 308);
}

function simulateNotFound(): never {
  throw new NextNotFoundSignal();
}

function isRedirectResponse(
  data: MangaDetail | ChapterDetail | RedirectResponse
): data is RedirectResponse {
  return 'redirect' in data && data.redirect === true;
}

/**
 * Mirrors the exact control flow in MangaDetailPage (`src/app/manhwa/[mangaSlug]/page.tsx`)
 */
async function resolveMangaPageData(
  mangaSlug: string,
  fetcher: (slug: string) => Promise<MangaDetail | RedirectResponse>,
  hooks: {
    onPermanentRedirect: (url: string) => never;
    onNotFound: () => never;
  }
): Promise<MangaDetail> {
  let result: MangaDetail | RedirectResponse;
  try {
    result = await fetcher(mangaSlug);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'NOT_FOUND') {
      hooks.onNotFound();
    }
    throw err;
  }

  if (isRedirectResponse(result)) {
    hooks.onPermanentRedirect(result.target_url.replace(/\/+$/, '') || '/');
  }

  const manga: MangaDetail = result;
  return manga;
}

/**
 * Mirrors the exact control flow in ChapterReaderPage (`src/app/manhwa/[mangaSlug]/[chapterSlug]/page.tsx`)
 */
async function resolveChapterPageData(
  mangaSlug: string,
  chapterNumber: string,
  fetchChapter: (slug: string, num: string) => Promise<ChapterDetail | RedirectResponse>,
  fetchManga: (slug: string) => Promise<MangaDetail | RedirectResponse>,
  hooks: {
    onPermanentRedirect: (url: string) => never;
    onNotFound: () => never;
  }
): Promise<ChapterDetail> {
  let result: ChapterDetail | RedirectResponse;
  let mangaResult: MangaDetail | RedirectResponse | null = null;

  try {
    [result, mangaResult] = await Promise.all([
      fetchChapter(mangaSlug, chapterNumber),
      fetchManga(mangaSlug).catch(() => null),
    ]);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'NOT_FOUND') {
      hooks.onNotFound();
    }
    throw err;
  }

  if (isRedirectResponse(result)) {
    hooks.onPermanentRedirect(result.target_url.replace(/\/+$/, '') || '/');
  }

  void mangaResult;
  const chapter: ChapterDetail = result;
  return chapter;
}

async function runTests() {
  // 1. Test: Renamed manga resolves in a single hop to canonical URL without trailing slash
  for (const rawTargetUrl of ['/manhwa/new-manga-slug', '/manhwa/new-manga-slug/']) {
    let notFoundCalled = false;
    const hooks = {
      onPermanentRedirect: simulatePermanentRedirect,
      onNotFound: (): never => {
        notFoundCalled = true;
        return simulateNotFound();
      },
    };

    let caughtError: unknown = null;
    try {
      await resolveMangaPageData(
        'old-manga-slug',
        async () => ({
          redirect: true,
          status: 301,
          target_url: rawTargetUrl,
          new_slug: 'new-manga-slug',
        }),
        hooks
      );
    } catch (err: unknown) {
      caughtError = err;
    }

    if (notFoundCalled) {
      throw new Error('Test 1 failed: notFound() was called during a manga permanentRedirect!');
    }
    if (!(caughtError instanceof NextRedirectSignal)) {
      throw new Error(`Test 1 failed: expected NextRedirectSignal, got ${String(caughtError)}`);
    }
    if (caughtError.targetUrl !== '/manhwa/new-manga-slug') {
      throw new Error(
        `Test 1 failed: expected trailing-slash-free '/manhwa/new-manga-slug', got '${caughtError.targetUrl}'`
      );
    }
  }

  // 2. Test: Chapter under renamed manga (including decimal 10.5) resolves in a single hop without trailing slash
  for (const rawTargetUrl of ['/manhwa/new-manga-slug/chapter-10.5', '/manhwa/new-manga-slug/chapter-10.5/']) {
    let notFoundCalled = false;
    const hooks = {
      onPermanentRedirect: simulatePermanentRedirect,
      onNotFound: (): never => {
        notFoundCalled = true;
        return simulateNotFound();
      },
    };

    let caughtError: unknown = null;
    try {
      await resolveChapterPageData(
        'old-manga-slug',
        '10.5',
        async () => ({
          redirect: true,
          status: 301,
          target_url: rawTargetUrl,
          new_slug: 'new-manga-slug',
        }),
        async () => ({
          redirect: true,
          status: 301,
          target_url: '/manhwa/new-manga-slug',
          new_slug: 'new-manga-slug',
        }),
        hooks
      );
    } catch (err: unknown) {
      caughtError = err;
    }

    if (notFoundCalled) {
      throw new Error('Test 2 failed: notFound() was called during a chapter permanentRedirect!');
    }
    if (!(caughtError instanceof NextRedirectSignal)) {
      throw new Error(`Test 2 failed: expected NextRedirectSignal, got ${String(caughtError)}`);
    }
    if (caughtError.targetUrl !== '/manhwa/new-manga-slug/chapter-10.5') {
      throw new Error(
        `Test 2 failed: expected trailing-slash-free '/manhwa/new-manga-slug/chapter-10.5', got '${caughtError.targetUrl}'`
      );
    }
  }

  // 3. Test: No circular redirect when following redirect target to canonical manga
  {
    const canonicalManga: MangaDetail = {
      id: 101,
      title: 'Canonical Manga',
      slug: 'new-manga-slug',
      synopsis: 'Synopsis',
      excerpt: 'Excerpt',
      cover_url: '',
      author: 'Author',
      artist: 'Artist',
      publication_status: 'ongoing',
      release_year: 2026,
      alternative_titles: [],
      genres: ['Romance'],
      total_chapters: 0,
      chapters: [],
      published_at: '2026-01-01',
      updated_at: '2026-01-01',
    };

    const fetcher = async (slug: string): Promise<MangaDetail | RedirectResponse> => {
      if (slug === 'old-manga-slug') {
        return {
          redirect: true,
          status: 301,
          target_url: '/manhwa/new-manga-slug',
          new_slug: 'new-manga-slug',
        };
      }
      if (slug === 'new-manga-slug') {
        return canonicalManga;
      }
      throw new Error('NOT_FOUND');
    };

    const hooks = {
      onPermanentRedirect: simulatePermanentRedirect,
      onNotFound: simulateNotFound,
    };

    let redirectedTo = '';
    try {
      await resolveMangaPageData('old-manga-slug', fetcher, hooks);
    } catch (err: unknown) {
      if (err instanceof NextRedirectSignal) {
        redirectedTo = err.targetUrl;
      } else {
        throw err;
      }
    }

    if (redirectedTo !== '/manhwa/new-manga-slug') {
      throw new Error(`Test 3 failed: expected redirect to '/manhwa/new-manga-slug', got '${redirectedTo}'`);
    }

    const nextSlug = redirectedTo.replace(/^\/manhwa\//, '');
    const resolved = await resolveMangaPageData(nextSlug, fetcher, hooks);
    if (resolved.slug !== 'new-manga-slug') {
      throw new Error(`Test 3 failed: destination did not resolve to canonical manga`);
    }
  }

  // 4. Test: Non-existent manga (NOT_FOUND) triggers notFound()
  {
    let notFoundCalled = false;
    const hooks = {
      onPermanentRedirect: simulatePermanentRedirect,
      onNotFound: (): never => {
        notFoundCalled = true;
        return simulateNotFound();
      },
    };

    let caughtError: unknown = null;
    try {
      await resolveMangaPageData(
        'unknown-slug',
        async () => {
          throw new Error('NOT_FOUND');
        },
        hooks
      );
    } catch (err: unknown) {
      caughtError = err;
    }

    if (!notFoundCalled || !(caughtError instanceof NextNotFoundSignal)) {
      throw new Error(`Test 4 failed: expected NextNotFoundSignal for NOT_FOUND, got ${String(caughtError)}`);
    }
  }

  // 5. Test: Non-existent chapter (NOT_FOUND) triggers notFound()
  {
    let notFoundCalled = false;
    const hooks = {
      onPermanentRedirect: simulatePermanentRedirect,
      onNotFound: (): never => {
        notFoundCalled = true;
        return simulateNotFound();
      },
    };

    let caughtError: unknown = null;
    try {
      await resolveChapterPageData(
        'valid-slug',
        '999',
        async () => {
          throw new Error('NOT_FOUND');
        },
        async () => {
          throw new Error('NOT_FOUND');
        },
        hooks
      );
    } catch (err: unknown) {
      caughtError = err;
    }

    if (!notFoundCalled || !(caughtError instanceof NextNotFoundSignal)) {
      throw new Error(`Test 5 failed: expected NextNotFoundSignal for chapter NOT_FOUND, got ${String(caughtError)}`);
    }
  }

  // 6. Test: API / Server 500 error is re-thrown as-is and NOT converted into 404 notFound()
  {
    let notFoundCalled = false;
    const hooks = {
      onPermanentRedirect: simulatePermanentRedirect,
      onNotFound: (): never => {
        notFoundCalled = true;
        return simulateNotFound();
      },
    };

    let caughtError: unknown = null;
    try {
      await resolveMangaPageData(
        'any-slug',
        async () => {
          throw new Error('API Error: 500 Internal Server Error');
        },
        hooks
      );
    } catch (err: unknown) {
      caughtError = err;
    }

    if (notFoundCalled) {
      throw new Error('Test 6 failed: API 500 error was wrongly converted to notFound()!');
    }
    if (!(caughtError instanceof Error) || caughtError.message !== 'API Error: 500 Internal Server Error') {
      throw new Error(`Test 6 failed: expected original API Error to be re-thrown, got ${String(caughtError)}`);
    }
  }

  // 7. Test: Chapter API / Network error is re-thrown as-is and NOT converted into 404 notFound()
  {
    let notFoundCalled = false;
    const hooks = {
      onPermanentRedirect: simulatePermanentRedirect,
      onNotFound: (): never => {
        notFoundCalled = true;
        return simulateNotFound();
      },
    };

    let caughtError: unknown = null;
    try {
      await resolveChapterPageData(
        'any-slug',
        '1',
        async () => {
          throw new Error('API Error: 502 Bad Gateway');
        },
        async () => {
          throw new Error('Secondary fetch ignored');
        },
        hooks
      );
    } catch (err: unknown) {
      caughtError = err;
    }

    if (notFoundCalled) {
      throw new Error('Test 7 failed: Chapter API 502 error was wrongly converted to notFound()!');
    }
    if (!(caughtError instanceof Error) || caughtError.message !== 'API Error: 502 Bad Gateway') {
      throw new Error(`Test 7 failed: expected original Chapter API Error to be re-thrown, got ${String(caughtError)}`);
    }
  }

  // 8. Source code structure verification: frontend pages & backend controllers
  const pageFiles = [
    path.resolve(process.cwd(), 'src/app/manhwa/[mangaSlug]/page.tsx'),
    path.resolve(process.cwd(), 'src/app/manhwa/[mangaSlug]/[chapterSlug]/page.tsx'),
  ];

  for (const filePath of pageFiles) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Verify no try block contains permanentRedirect(
    const tryBlocks = content.match(/try\s*\{[\s\S]*?\}\s*catch/g) || [];
    for (const block of tryBlocks) {
      if (block.includes('permanentRedirect(')) {
        throw new Error(`Source check failed in ${filePath}: permanentRedirect() is still inside a try block!`);
      }
    }

    // Verify catch block re-throws non-NOT_FOUND errors
    if (!content.includes('throw err;')) {
      throw new Error(`Source check failed in ${filePath}: catch block does not re-throw non-NOT_FOUND errors ('throw err;')!`);
    }

    // Verify trailing-slash normalization on target_url
    if (!content.includes("result.target_url.replace(/\\/+$/, '')")) {
      throw new Error(`Source check failed in ${filePath}: missing trailing-slash normalization on result.target_url!`);
    }
  }

  const mangaControllerPath = path.resolve(
    process.cwd(),
    '../backend/wp-content/plugins/romancetoon-core/src/API/MangaController.php'
  );
  const chapterControllerPath = path.resolve(
    process.cwd(),
    '../backend/wp-content/plugins/romancetoon-core/src/API/ChapterController.php'
  );
  const redirectManagerPath = path.resolve(
    process.cwd(),
    '../backend/wp-content/plugins/romancetoon-core/src/Services/RedirectManager.php'
  );
  const pluginPath = path.resolve(
    process.cwd(),
    '../backend/wp-content/plugins/romancetoon-core/src/Plugin.php'
  );

  const mangaControllerContent = fs.readFileSync(mangaControllerPath, 'utf8');
  if (!mangaControllerContent.includes('\'target_url\'   => "/manhwa/{$newSlug}"')) {
    throw new Error('Source check failed in MangaController.php: target_url must not have a trailing slash!');
  }
  if (!mangaControllerContent.includes('$targetQuery->have_posts()')) {
    throw new Error('Source check failed in MangaController.php: missing target manga publish check before 301!');
  }

  const chapterControllerContent = fs.readFileSync(chapterControllerPath, 'utf8');
  if (!chapterControllerContent.includes('\'target_url\'   => "/manhwa/{$newMangaSlug}/chapter-{$chapterNumber}"')) {
    throw new Error('Source check failed in ChapterController.php: target_url must not have a trailing slash!');
  }
  if (!chapterControllerContent.includes('$chapterExists > 0')) {
    throw new Error('Source check failed in ChapterController.php: missing chapter existence check before 301!');
  }

  const redirectManagerContent = fs.readFileSync(redirectManagerPath, 'utf8');
  if (!redirectManagerContent.includes('$wpdb->insert(') || !redirectManagerContent.includes('old_slug <> %s')) {
    throw new Error('Source check failed in RedirectManager.php: missing deduplicated insert or self-redirect guard!');
  }

  const pluginContent = fs.readFileSync(pluginPath, 'utf8');
  if (!pluginContent.includes("add_action('post_updated', [AdminManager::class, 'track_slug_changes'], 10, 3);")) {
    throw new Error('Source check failed in Plugin.php: track_slug_changes must be registered globally in Plugin::init()!');
  }

  // 9. Test: RedirectManager algorithm (chain flattening, cycle reversion, deduplication, no self-redirects)
  {
    interface RedirectRow {
      id: number;
      entity_type: string;
      old_slug: string;
      new_slug: string;
      parent_slug: string;
    }

    let nextId = 1;
    let tableRows: RedirectRow[] = [];

    const recordSlugChange = (entityType: string, oldSlug: string, newSlug: string, parentSlug = '') => {
      if (!oldSlug || !newSlug || oldSlug === newSlug) return;

      // 1. Prevent cycles: remove any redirect where old_slug = newSlug
      tableRows = tableRows.filter(
        (r) => !(r.entity_type === entityType && r.old_slug === newSlug && r.parent_slug === parentSlug)
      );

      // 2. Deduplicate: remove any prior transition for oldSlug
      tableRows = tableRows.filter(
        (r) => !(r.entity_type === entityType && r.old_slug === oldSlug && r.parent_slug === parentSlug)
      );

      // 3. Insert direct transition
      tableRows.push({
        id: nextId++,
        entity_type: entityType,
        old_slug: oldSlug,
        new_slug: newSlug,
        parent_slug: parentSlug,
      });

      // 4. Chain flattening
      for (const r of tableRows) {
        if (
          r.entity_type === entityType &&
          r.new_slug === oldSlug &&
          r.parent_slug === parentSlug &&
          r.old_slug !== newSlug
        ) {
          r.new_slug = newSlug;
        }
      }
    };

    const getRedirectTarget = (entityType: string, requestedSlug: string, parentSlug = ''): string | null => {
      const matches = tableRows
        .filter((r) => r.entity_type === entityType && r.old_slug === requestedSlug && r.parent_slug === parentSlug)
        .sort((a, b) => b.id - a.id);
      return matches.length > 0 ? matches[0].new_slug : null;
    };

    // Chain flattening: A -> B -> C
    recordSlugChange('manga', 'slug-a', 'slug-b');
    recordSlugChange('manga', 'slug-b', 'slug-c');
    if (getRedirectTarget('manga', 'slug-a') !== 'slug-c' || getRedirectTarget('manga', 'slug-b') !== 'slug-c') {
      throw new Error('Test 9 failed: chain flattening A -> B -> C did not point both A and B to C');
    }

    // 3-step cycle reversion: C -> A
    recordSlugChange('manga', 'slug-c', 'slug-a');
    if (getRedirectTarget('manga', 'slug-a') !== null) {
      throw new Error('Test 9 failed: active slug-a still has a redirect!');
    }
    if (getRedirectTarget('manga', 'slug-b') !== 'slug-a' || getRedirectTarget('manga', 'slug-c') !== 'slug-a') {
      throw new Error('Test 9 failed: B and C should point to A after C -> A reversion');
    }

    // Rename again: A -> D and verify zero duplicate keys or self-redirects
    recordSlugChange('manga', 'slug-a', 'slug-d');
    const seenKeys = new Set<string>();
    for (const r of tableRows) {
      const key = `${r.entity_type}:${r.old_slug}:${r.parent_slug}`;
      if (seenKeys.has(key)) {
        throw new Error(`Test 9 failed: duplicate redirect key '${key}'`);
      }
      seenKeys.add(key);
      if (r.old_slug === r.new_slug) {
        throw new Error(`Test 9 failed: self-redirect detected for '${r.old_slug}'`);
      }
      if (r.new_slug !== 'slug-d') {
        throw new Error(`Test 9 failed: expected all historical slugs to point to 'slug-d', got '${r.new_slug}'`);
      }
    }
  }

  console.log('✓ All redirectFlow and error-handling tests passed successfully!');
}

runTests().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
