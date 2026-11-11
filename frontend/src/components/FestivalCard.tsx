import type { CSSProperties } from 'react';
import type { Festival } from '../types';
import { formatDatePT } from '../utils/date';
import { PremioTag } from './PremioTag';
import { TunaList } from './TunaList';
import { PosterPlaceholder } from './PosterPlaceholder';
import { Button } from './ui/Button';
import { PolaroidCard } from './ui/PolaroidCard';

interface FestivalCardProps {
  festival: Festival;
  onEdit?: (festival: Festival) => void;
  onDelete?: (festival: Festival) => void;
  isDeleting?: boolean;
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function tiltFor(seed: string): number {
  const normalized = (hashString(seed) % 1000) / 1000;
  return Number((-0.7 + normalized * 1.4).toFixed(2));
}

export function FestivalCard({ festival, onEdit, onDelete, isDeleting }: FestivalCardProps) {
  const hasPremios = festival.premios.length > 0;
  const style = {
    '--tilt': `${tiltFor(festival.id || festival.name)}deg`,
  } as CSSProperties;

  return (
    <article className="festival-card" style={style}>
      <div className="festival-card__top">
        <time className="label">{formatDatePT(festival.date)}</time>

        {(onEdit || onDelete) && (
          <div className="festival-actions">
            {onEdit && (
              <Button
                type="button"
                variant="text"
                size="small"
                onClick={() => onEdit(festival)}
                aria-label={`Editar ${festival.name}`}
              >
                Editar
              </Button>
            )}
            {onDelete && (
              <Button
                type="button"
                variant="text"
                size="small"
                onClick={() => onDelete(festival)}
                disabled={isDeleting}
                aria-label={`Eliminar ${festival.name}`}
              >
                {isDeleting ? 'A eliminar…' : 'Eliminar'}
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="festival-card__body">
        <PolaroidCard className="festival-poster" seed={festival.id || festival.name}>
          <div className="aspect-[3/4] w-full overflow-hidden">
            {festival.cartazUrl ? (
              <img
                src={festival.cartazUrl}
                alt={`Cartaz de ${festival.name}`}
                width={600}
                height={800}
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  target.parentElement?.querySelector('.cartaz-fallback')?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`cartaz-fallback h-full w-full ${festival.cartazUrl ? 'hidden' : ''}`}>
              <PosterPlaceholder seed={festival.id || festival.name} title={festival.tuna.name} />
            </div>
          </div>
        </PolaroidCard>

        <div className="flex min-w-0 flex-col">
          <p className="festival-city">{festival.location}</p>
          <h3 className="festival-title">{festival.name}</h3>
          <p className="festival-tuna label">{festival.tuna.name}</p>

          <div className="festival-awards">
            <p className="label">Prémios</p>
            {hasPremios ? (
              <ul className="mt-2 flex flex-col gap-1.5">
                {festival.premios.map((premio, i) => (
                  <PremioTag key={`${premio.name}-${i}`} label={premio.name} />
                ))}
              </ul>
            ) : (
              <p className="premio-empty mt-2 text-sm">Sem prémios atribuídos</p>
            )}
          </div>

          <div className="festival-tunas">
            <TunaList label="Tunas a concurso" tunas={festival.tunasConcurso} />
            <TunaList label="Extra concurso" tunas={festival.tunasExtra} />
          </div>
        </div>
      </div>
    </article>
  );
}
