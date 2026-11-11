import type { Festival } from '../types';
import { FestivalCard } from './FestivalCard';

interface YearSectionProps {
  year: number;
  festivals: Festival[];
  onEdit?: (festival: Festival) => void;
  onDelete?: (festival: Festival) => void;
  deletingId?: string | null;
}

export function YearSection({ year, festivals, onEdit, onDelete, deletingId }: YearSectionProps) {
  return (
    <section>
      <div className="flex items-baseline gap-5">
        <h2 className="font-serif text-5xl font-semibold leading-none tracking-tight text-ink">
          {year}
        </h2>
        <div className="mb-1 h-px flex-1 bg-ink/20" />
        <span className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
          {festivals.length} {festivals.length === 1 ? 'registo' : 'registos'}
        </span>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-14 lg:grid-cols-2">
        {festivals.map((festival) => (
          <FestivalCard
            key={festival.id}
            festival={festival}
            onEdit={onEdit}
            onDelete={onDelete}
            isDeleting={deletingId === festival.id}
          />
        ))}
      </div>
    </section>
  );
}
