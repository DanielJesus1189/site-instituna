import { initialsFor, paletteFor } from '../utils/color';

interface PosterPlaceholderProps {
  seed: string;
  title: string;
}

export function PosterPlaceholder({ seed, title }: PosterPlaceholderProps) {
  const { from, to } = paletteFor(seed);
  const initials = initialsFor(title) || '?';

  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-sm border border-black/10"
      style={{ backgroundImage: `linear-gradient(155deg, ${from}, ${to})` }}
    >
      <span className="font-serif text-3xl font-semibold tracking-wide text-white/90">
        {initials}
      </span>
      <span className="absolute bottom-1.5 left-1.5 right-1.5 truncate text-center text-[9px] font-medium uppercase tracking-wider text-white/50">
        sem cartaz
      </span>
    </div>
  );
}
