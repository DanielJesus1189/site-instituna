import type { CSSProperties } from 'react';
import { initialsFor, paletteFor } from '../utils/color';

interface PosterPlaceholderProps {
  seed: string;
  title: string;
}

export function PosterPlaceholder({ seed, title }: PosterPlaceholderProps) {
  const { from, to } = paletteFor(seed);
  const initials = initialsFor(title) || '?';
  const style = {
    '--poster-from': from,
    '--poster-to': to,
  } as CSSProperties;

  return (
    <div className="poster-placeholder" style={style} aria-hidden="true">
      <div className="poster-placeholder__top">
        <span>Cartaz</span>
        <span>Arquivo</span>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <span className="poster-placeholder__initials">{initials}</span>
      </div>

      <div className="poster-placeholder__bottom">
        <span>sem cartaz</span>
      </div>
    </div>
  );
}
