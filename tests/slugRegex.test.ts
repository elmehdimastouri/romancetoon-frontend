const CHAPTER_SLUG_REGEX = /^chapter-([0-9]+(?:\.[0-9]+)?)$/;

function validateSlug(slug: string): { valid: boolean; chapterNumber: string | null } {
  const match = slug.match(CHAPTER_SLUG_REGEX);
  if (!match) {
    return { valid: false, chapterNumber: null };
  }
  return { valid: true, chapterNumber: match[1] };
}

console.log('Running frontend slugRegex tests...');

const validCases = [
  { slug: 'chapter-1', expectedNum: '1' },
  { slug: 'chapter-10', expectedNum: '10' },
  { slug: 'chapter-10.1', expectedNum: '10.1' },
  { slug: 'chapter-10.5', expectedNum: '10.5' },
  { slug: 'chapter-10.10', expectedNum: '10.10' },
  { slug: 'chapter-10.100', expectedNum: '10.100' },
  { slug: 'chapter-999', expectedNum: '999' },
];

for (const c of validCases) {
  const res = validateSlug(c.slug);
  if (!res.valid || res.chapterNumber !== c.expectedNum) {
    throw new Error(`Valid test failed for '${c.slug}': got ${JSON.stringify(res)}`);
  }
}

const invalidCases = [
  'chapter-',
  'chapter-abc',
  'ch-10',
  'chapter-10a',
  'chapter-10.5.1',
  'random-slug',
  'chapter-10/sub',
];

for (const inv of invalidCases) {
  const res = validateSlug(inv);
  if (res.valid) {
    throw new Error(`Invalid test wrongly passed for '${inv}'`);
  }
}

console.log('✓ All slugRegex tests passed successfully!');
