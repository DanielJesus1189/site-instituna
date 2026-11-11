import type { TunaRef } from '../types';

interface TunaListProps {
  label: string;
  tunas: TunaRef[];
}

export function TunaList({ label, tunas }: TunaListProps) {
  if (tunas.length === 0) return null;

  return (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-soft">{label}</p>
      <p className="mt-1 text-xs leading-relaxed text-ink">
        {tunas.map((t) => t.name).join(' / ')}
      </p>
    </div>
  );
}
