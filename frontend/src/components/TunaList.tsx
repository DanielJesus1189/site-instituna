import type { TunaRef } from '../types';

interface TunaListProps {
  label: string;
  tunas: TunaRef[];
}

export function TunaList({ label, tunas }: TunaListProps) {
  if (tunas.length === 0) return null;

  return (
    <div>
      <p className="label">{label}</p>
      <p className="tuna-list__names">{tunas.map((t) => t.name).join(' / ')}</p>
    </div>
  );
}
