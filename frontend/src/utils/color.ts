/** Muted, archival tones for posters that do not have an uploaded image. */
const PALETTE: Array<{ from: string; to: string }> = [
  { from: '#26221d', to: '#3b342c' }, // ink
  { from: '#5f2630', to: '#7a3540' }, // wine
  { from: '#38443a', to: '#4f5c4c' }, // olive
  { from: '#34424a', to: '#4b5c65' }, // slate
  { from: '#6b4f2d', to: '#86663d' }, // ochre
  { from: '#5a352b', to: '#75483a' }, // rust
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function paletteFor(seed: string) {
  return PALETTE[hashString(seed) % PALETTE.length];
}

export function initialsFor(name: string) {
  return name
    .replace(/[^\p{L}\p{N} ]/gu, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('');
}
