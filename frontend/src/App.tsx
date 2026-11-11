import { useMemo, useState } from 'react';
import { useFestivals } from './hooks/useFestivals';
import { useAuth } from './hooks/useAuth';
import { YearSection } from './components/YearSection';
import { FestivalFormModal } from './components/FestivalFormModal';
import { LoginPage } from './components/LoginPage';
import { SkeletonCard } from './components/SkeletonCard';
import { StatsDashboard } from './components/StatsDashboard';
import { yearOf } from './utils/date';
import type { Festival } from './types';

const primaryButton =
  'border border-ink bg-ink px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-paper transition-colors hover:border-wine hover:bg-wine';
const textButton =
  'font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft underline decoration-rule underline-offset-4 transition-colors hover:text-wine';

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

  const { user, isAuthenticated, login, logout } = useAuth();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingFestival, setEditingFestival] = useState<Festival | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

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
    if (!isAuthenticated) return;

    const confirmed = window.confirm(
      `Eliminar "${festival.name}" (${festival.tuna.name})? Esta ação não pode ser desfeita.`
    );
    if (!confirmed) return;
    await removeFestival(festival.id);
  }

  if (isLoginOpen) {
    return (
      <LoginPage
        onLogin={login}
        onSuccess={() => setIsLoginOpen(false)}
        onBack={() => setIsLoginOpen(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-ink/15">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between border-b border-ink/10 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
            <span>Arquivo de festivais de tunas</span>
            <span className="hidden sm:inline">Portugal</span>
          </div>

          <div className="flex flex-col gap-6 py-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-wine">
                Instituna
              </p>
              <h1 className="mt-2 font-serif text-4xl font-semibold leading-none tracking-tight sm:text-5xl">
                Cartaz &amp; Palmarés
              </h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
                Um registo dos festivais, cartazes e prémios das tunas académicas.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              {isAuthenticated ? (
                <>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                    {user?.username}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(true)}
                    className={primaryButton}
                  >
                    Novo festival
                  </button>
                  <button type="button" onClick={logout} className={textButton}>
                    Sair
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsLoginOpen(true)}
                  className={primaryButton}
                >
                  Entrar
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {error && (
          <div className="mx-auto max-w-xl border border-rule bg-paper-deep/50 p-8 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-wine">
              Erro de ligação
            </p>
            <p className="mt-3 font-serif text-xl">Não foi possível carregar os festivais</p>
            <p className="mt-2 text-sm text-ink-soft">{error}</p>
            <button type="button" onClick={refetch} className={`mt-6 ${primaryButton}`}>
              Tentar novamente
            </button>
          </div>
        )}

        {!error && isLoading && (
          <div className="grid grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!error && !isLoading && festivals.length === 0 && (
          <div className="mx-auto max-w-xl border border-dashed border-rule bg-paper-deep/30 p-10 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-wine">
              Arquivo vazio
            </p>
            <p className="mt-3 font-serif text-2xl">Ainda não há festivais registados</p>
            <p className="mt-2 text-sm text-ink-soft">
              Cria o primeiro festival para começares a construir o palmarés.
            </p>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className={`mt-6 ${primaryButton}`}
              >
                Novo festival
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsLoginOpen(true)}
                className={`mt-6 ${primaryButton}`}
              >
                Entrar para adicionar
              </button>
            )}
          </div>
        )}

        {!error && !isLoading && festivals.length > 0 && (
          <>
            <StatsDashboard festivals={festivals} />

            <div className="mb-10 flex items-end justify-between border-b border-ink/15 pb-3">
              <h2 className="font-serif text-2xl font-semibold">Arquivo por ano</h2>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                {festivals.length} {festivals.length === 1 ? 'festival' : 'festivais'}
              </span>
            </div>

            <div className="flex flex-col gap-20">
              {groupedByYear.map(([year, yearFestivals]) => (
                <YearSection
                  key={year}
                  year={year}
                  festivals={yearFestivals}
                  onEdit={isAuthenticated ? setEditingFestival : undefined}
                  onDelete={isAuthenticated ? handleDelete : undefined}
                  deletingId={deletingId}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="border-t border-ink/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>Cartaz &amp; Palmarés</span>
          <span>Arquivo de festivais de tunas</span>
        </div>
      </footer>

      {isAuthenticated && isCreateOpen && (
        <FestivalFormModal
          onClose={() => setIsCreateOpen(false)}
          onSubmit={addFestival}
          isSubmitting={isSubmitting}
        />
      )}

      {isAuthenticated && editingFestival && (
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
