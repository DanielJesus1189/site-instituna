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
      <h2 className="text-center font-serif text-3xl font-bold text-zinc-900">{year}</h2>
      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
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
