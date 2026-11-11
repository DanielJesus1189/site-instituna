import type { CSSProperties, ReactNode } from 'react';

interface PolaroidCardProps {
  children: ReactNode;
  /** Stable seed used to derive the card's slight rotation. */
  seed?: string | number;
  /** Explicit rotation in degrees. Overrides the seed. */
  rotation?: number;
  className?: string;
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function rotationFor(seed: string | number): number {
  const normalized = (hashString(String(seed)) % 1000) / 1000;
  return Number((-1.5 + normalized * 3).toFixed(2));
}

/** White photo frame with a stable, hand-placed tilt. */
export function PolaroidCard({
  children,
  seed = 0,
  rotation,
  className = '',
}: PolaroidCardProps) {
  const tilt = rotation ?? rotationFor(seed);
  const style = { '--tilt': `${tilt}deg` } as CSSProperties;

  return (
    <div className={`polaroid ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}
