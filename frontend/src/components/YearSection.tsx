import type { Festival } from '../types';
import { FestivalCard } from './FestivalCard';
import { BrushStripes } from './ui/BrushStripes';
import { Reveal } from './ui/Reveal';

interface YearSectionProps {
  year: number;
  festivals: Festival[];
  onEdit?: (festival: Festival) => void;
  onDelete?: (festival: Festival) => void;
  deletingId?: string | null;
}

export function YearSection({ year, festivals, onEdit, onDelete, deletingId }: YearSectionProps) {
  return (
    <section className="year-section">
      <div className="year-heading">
        <h2 className="year-number display-ink">{year}</h2>
        <BrushStripes className="year-stripes" />
        <span className="year-count label">
          {festivals.length} {festivals.length === 1 ? 'registo' : 'registos'}
        </span>
      </div>

      <div className="year-grid">
        {festivals.map((festival, index) => (
          <Reveal key={festival.id} delay={Math.min(index * 70, 280)}>
            <FestivalCard
              festival={festival}
              onEdit={onEdit}
              onDelete={onDelete}
              isDeleting={deletingId === festival.id}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
