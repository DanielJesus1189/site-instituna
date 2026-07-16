/** A small, curated set of hue pairs so placeholders stay tasteful instead of neon-random. */
const PALETTE: Array<{ from: string; to: string }> = [
  { from: '#1e293b', to: '#334155' }, // slate
  { from: '#1c1917', to: '#44403c' }, // stone
  { from: '#164e63', to: '#0e7490' }, // cyan-dark
  { from: '#3f3f46', to: '#52525b' }, // zinc
  { from: '#134e4a', to: '#0f766e' }, // teal-dark
  { from: '#1e1b4b', to: '#312e81' }, // indigo-dark
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
