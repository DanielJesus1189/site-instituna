import type { TunaRef } from '../types';

interface TunaListProps {
  label: string;
  tunas: TunaRef[];
}

export function TunaList({ label, tunas }: TunaListProps) {
  if (tunas.length === 0) return null;

  return (
    <div className="text-center">
      <p className="text-[11px] font-bold uppercase tracking-wide text-zinc-800">{label}</p>
      <p className="mt-1 text-sm font-medium text-teal-700">
        {tunas.map((t) => t.name).join(' · ')}
      </p>
    </div>
  );
}
