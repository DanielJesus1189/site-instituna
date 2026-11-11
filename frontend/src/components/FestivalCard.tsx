import type { Festival } from '../types';
import { formatDatePT } from '../utils/date';
import { PremioTag } from './PremioTag';
import { TunaList } from './TunaList';
import { PosterPlaceholder } from './PosterPlaceholder';

interface FestivalCardProps {
  festival: Festival;
  onEdit?: (festival: Festival) => void;
  onDelete?: (festival: Festival) => void;
  isDeleting?: boolean;
}

const controlButton =
  'font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft underline decoration-rule underline-offset-4 transition-colors hover:text-wine disabled:opacity-50';

export function FestivalCard({ festival, onEdit, onDelete, isDeleting }: FestivalCardProps) {
  const hasPremios = festival.premios.length > 0;

  return (
    <article className="group border-t border-ink/20 pt-4">
      <div className="flex min-h-4 items-center justify-between gap-4">
        <time className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
          {formatDatePT(festival.date)}
        </time>

        {(onEdit || onDelete) && (
          <div className="flex items-center gap-4 opacity-60 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(festival)}
                aria-label={`Editar ${festival.name}`}
                className={controlButton}
              >
                Editar
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(festival)}
                disabled={isDeleting}
                aria-label={`Eliminar ${festival.name}`}
                className={controlButton}
              >
                {isDeleting ? 'A eliminar…' : 'Eliminar'}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] gap-5 sm:gap-6">
        <div className="self-start border border-ink/15 bg-paper-deep/40 p-1.5">
          <div className="aspect-[3/4] w-full">
            {festival.cartazUrl ? (
              <img
                src={festival.cartazUrl}
                alt={`Cartaz de ${festival.name}`}
                className="h-full w-full border border-black/10 object-cover"
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
        </div>

        <div className="flex min-w-0 flex-col">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-wine">
            {festival.location}
          </p>
          <h3 className="mt-1 font-serif text-2xl font-semibold leading-tight text-ink">
            {festival.name}
          </h3>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
            {festival.tuna.name}
          </p>

          <div className="mt-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-soft">
              Prémios
            </p>
            {hasPremios ? (
              <ul className="mt-2 flex flex-col gap-1.5">
                {festival.premios.map((premio, i) => (
                  <PremioTag key={`${premio.name}-${i}`} label={premio.name} />
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs italic text-ink-soft">Sem prémios atribuídos</p>
            )}
          </div>

          <div className="mt-auto flex flex-col gap-3 pt-5">
            <TunaList label="Tunas a concurso" tunas={festival.tunasConcurso} />
            <TunaList label="Extra concurso" tunas={festival.tunasExtra} />
          </div>
        </div>
      </div>
    </article>
  );
}
