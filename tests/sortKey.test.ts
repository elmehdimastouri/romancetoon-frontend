function generateSortKey(chapterRaw: string): string {
  const cleaned = (chapterRaw || '').trim() || '0';
  const parts = cleaned.split('.');
  const paddedParts: string[] = [];

  for (let i = 0; i < 4; i++) {
    if (parts[i] !== undefined) {
      const digits = parts[i].replace(/[^0-9]/g, '') || '0';
      paddedParts.push(digits.padStart(8, '0'));
    } else {
      paddedParts.push('0'.repeat(8));
    }
  }

  return paddedParts.join('.');
}

console.log('Running sortKey tests...');

const cases: Record<string, string> = {
  '10': '00000010.00000000.00000000.00000000',
  '10.1': '00000010.00000001.00000000.00000000',
  '10.10': '00000010.00000010.00000000.00000000',
  '10.100': '00000010.00000100.00000000.00000000',
  '11': '00000011.00000000.00000000.00000000',
};

for (const [raw, expected] of Object.entries(cases)) {
  const res = generateSortKey(raw);
  if (res !== expected) {
    throw new Error(`Failed for ${raw}: expected ${expected}, got ${res}`);
  }
}

// Verify ordering
const input = ['11', '10.100', '10.1', '10', '10.10'];
const sorted = [...input].sort((a, b) => generateSortKey(a).localeCompare(generateSortKey(b)));
const expectedOrder = ['10', '10.1', '10.10', '10.100', '11'];

if (JSON.stringify(sorted) !== JSON.stringify(expectedOrder)) {
  throw new Error(`Sorting order mismatch! Got: ${JSON.stringify(sorted)}`);
}

console.log('✓ All sortKey tests passed successfully!');
