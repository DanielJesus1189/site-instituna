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

export function FestivalCard({ festival, onEdit, onDelete, isDeleting }: FestivalCardProps) {
  const hasPremios = festival.premios.length > 0;

  return (
    <article className="group relative">
      {/* stacked "folder" shadow behind the card */}
      <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-lg bg-zinc-300/70 transition-transform duration-200 group-hover:translate-x-2 group-hover:translate-y-2" />

      <div className="relative flex h-full flex-col rounded-lg border border-zinc-200 bg-zinc-50 shadow-sm">
        {(onEdit || onDelete) && (
          <div className="absolute right-2 top-2 z-10 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(festival)}
                aria-label={`Editar ${festival.name}`}
                className="rounded-md bg-white/90 p-1.5 text-xs font-semibold text-zinc-600 shadow-sm hover:bg-white hover:text-zinc-900"
              >
                ✎
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(festival)}
                disabled={isDeleting}
                aria-label={`Eliminar ${festival.name}`}
                className="rounded-md bg-white/90 p-1.5 text-xs font-semibold text-red-600 shadow-sm hover:bg-white hover:text-red-700 disabled:opacity-50"
              >
                {isDeleting ? '…' : '🗑'}
              </button>
            )}
          </div>
        )}

        {/* folder tab */}
        <div
          className="mx-4 -mt-3 flex justify-center"
          style={{ clipPath: 'polygon(6% 0, 94% 0, 100% 100%, 0 100%)' }}
        >
          <div className="w-full max-w-[85%] bg-zinc-900 px-6 py-2 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-white">
              {festival.name}
            </span>
          </div>
        </div>

        <div className="px-5 pb-5 pt-4">
          <header className="text-center">
            <h3 className="font-serif text-lg font-semibold text-zinc-900">
              {festival.tuna.name}
            </h3>
            <p className="mt-0.5 text-sm font-semibold text-emerald-700">
              {festival.location} — {formatDatePT(festival.date)}
            </p>
          </header>

          <div className="mt-4 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4">
            <div className="aspect-[3/4] w-full">
              {festival.cartazUrl ? (
                <img
                  src={festival.cartazUrl}
                  alt={`Cartaz de ${festival.name}`}
                  className="h-full w-full rounded-sm border border-black/10 object-cover"
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

            <div className="flex flex-col gap-2">
              <p className="text-center text-[11px] font-bold uppercase tracking-wide text-zinc-800">
                Prémios
              </p>
              {hasPremios ? (
                festival.premios.map((premio, i) => (
                  <PremioTag key={`${premio.name}-${i}`} label={premio.name} />
                ))
              ) : (
                <PremioTag label="Sem prémios atribuídos" variant="empty" />
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-zinc-200 pt-4">
            <TunaList label="Tunas a Concurso" tunas={festival.tunasConcurso} />
            <TunaList label="Extra Concurso" tunas={festival.tunasExtra} />
          </div>
        </div>
      </div>
    </article>
  );
}
