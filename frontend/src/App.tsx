import { useMemo, useState } from 'react';
import { useFestivals } from './hooks/useFestivals';
import { YearSection } from './components/YearSection';
import { FestivalFormModal } from './components/FestivalFormModal';
import { SkeletonCard } from './components/SkeletonCard';
import { StatsDashboard } from './components/StatsDashboard';
import { yearOf } from './utils/date';
import type { Festival } from './types';

function App() {
  const {
    festivals,
    isLoading,
    error,
    refetch,
    addFestival,
    editFestival,
    removeFestival,
    isSubmitting,
    deletingId,
  } = useFestivals();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingFestival, setEditingFestival] = useState<Festival | null>(null);

  const groupedByYear = useMemo(() => {
    const groups = new Map<number, typeof festivals>();
    for (const festival of festivals) {
      const year = yearOf(festival.date);
      const existing = groups.get(year) ?? [];
      existing.push(festival);
      groups.set(year, existing);
    }
    for (const list of groups.values()) {
      list.sort((a, b) => b.date.localeCompare(a.date));
    }
    return [...groups.entries()].sort((a, b) => b[0] - a[0]);
  }, [festivals]);

  async function handleDelete(festival: Festival) {
    const confirmed = window.confirm(
      `Eliminar "${festival.name}" (${festival.tuna.name})? Esta ação não pode ser desfeita.`
    );
    if (!confirmed) return;
    await removeFestival(festival.id);
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
              Festivais de Tunas
            </p>
            <h1 className="font-serif text-xl font-bold text-zinc-900">Cartaz &amp; Palmarés</h1>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            + Novo Festival
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {error && (
          <div className="mx-auto max-w-xl rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm font-semibold text-red-700">Não foi possível carregar os festivais</p>
            <p className="mt-1 text-sm text-red-600">{error}</p>
            <button
              type="button"
              onClick={refetch}
              className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!error && isLoading && (
          <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!error && !isLoading && festivals.length === 0 && (
          <div className="mx-auto max-w-xl rounded-lg border border-dashed border-zinc-300 p-10 text-center">
            <p className="text-sm font-semibold text-zinc-700">Ainda não há festivais registados</p>
            <p className="mt-1 text-sm text-zinc-500">
              Cria o primeiro festival para começares a construir o palmarés.
            </p>
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              + Novo Festival
            </button>
          </div>
        )}

        {!error && !isLoading && festivals.length > 0 && (
          <>
            <StatsDashboard festivals={festivals} />
            <div className="flex flex-col gap-16">
              {groupedByYear.map(([year, yearFestivals]) => (
                <YearSection
                  key={year}
                  year={year}
                  festivals={yearFestivals}
                  onEdit={setEditingFestival}
                  onDelete={handleDelete}
                  deletingId={deletingId}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {isCreateOpen && (
        <FestivalFormModal
          onClose={() => setIsCreateOpen(false)}
          onSubmit={addFestival}
          isSubmitting={isSubmitting}
        />
      )}

      {editingFestival && (
        <FestivalFormModal
          festival={editingFestival}
          onClose={() => setEditingFestival(null)}
            onSubmit={(input, cartaz) => editFestival(editingFestival.id, input, cartaz)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}

export default App;
