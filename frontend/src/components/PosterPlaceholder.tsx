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
      className="relative flex h-full w-full flex-col justify-between overflow-hidden border border-ink/20 p-3 text-paper"
      style={{ backgroundImage: `linear-gradient(160deg, ${from}, ${to})` }}
    >
      <div className="flex items-center justify-between font-mono text-[7px] uppercase tracking-[0.18em] text-paper/55">
        <span>Cartaz</span>
        <span>Arquivo</span>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <span className="font-serif text-4xl font-semibold tracking-wide text-paper/90">
          {initials}
        </span>
      </div>

      <div className="border-t border-paper/25 pt-2 text-center">
        <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-paper/55">
          sem cartaz
        </span>
      </div>
    </div>
  );
}
