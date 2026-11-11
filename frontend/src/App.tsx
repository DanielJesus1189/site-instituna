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
import { ArchFrame } from './components/ui/ArchFrame';
import { Brand } from './components/ui/Brand';
import { BrushStripes } from './components/ui/BrushStripes';
import { Button } from './components/ui/Button';
import { InkDivider } from './components/ui/InkDivider';
import { Watercolor } from './components/ui/Watercolor';

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
    <div className="min-h-screen text-ink">
      <header className="site-header">
        <div className="page-shell">
          <div className="header-topline label">
            <span>Arquivo de festivais de tunas</span>
            <span className="hidden sm:inline">Portugal</span>
          </div>

          <div className="header-main">
            <Brand />

            <div className="header-actions">
              {isAuthenticated ? (
                <>
                  <span className="user-name">{user?.username}</span>
                  <Button type="button" onClick={() => setIsCreateOpen(true)}>
                    Novo festival
                  </Button>
                  <Button type="button" variant="text" onClick={logout}>
                    Sair
                  </Button>
                </>
              ) : (
                <Button type="button" onClick={() => setIsLoginOpen(true)}>
                  Entrar
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <Watercolor tone="green" className="-left-28 -top-32" />
        <Watercolor tone="ochre" className="right-[-7rem] top-8" />
        <Watercolor tone="blue" className="bottom-[-10rem] left-1/3" />

        <div className="page-shell relative">
          <div className="hero-grid">
            <div>
              <p className="label label--green">Instituna</p>
              <h1 id="hero-title" className="hero-title display-ink mt-3">
                Cartaz &amp; Palmarés
              </h1>
              <BrushStripes className="hero-stripes" />
              <p className="hero-copy">
                Um registo dos festivais, cartazes e prémios das tunas académicas.
              </p>
            </div>

            <ArchFrame className="hero-arch hidden lg:block">
              <div className="relative flex h-full w-full flex-col items-center justify-center">
                <span className="hero-arch__monogram" aria-hidden="true">
                  I
                </span>
                <span className="hero-arch__caption label label--ink">Arquivo</span>
              </div>
            </ArchFrame>
          </div>
        </div>
      </section>

      <main className="page-shell pb-16 pt-4 sm:pt-8">
        {error && (
          <div className="state-card">
            <p className="label label--navy">Erro de ligação</p>
            <h2 className="mt-2">Não foi possível carregar os festivais</h2>
            <p className="mt-3 text-ink-soft">{error}</p>
            <Button type="button" onClick={refetch} className="mt-6">
              Tentar novamente
            </Button>
          </div>
        )}

        {!error && isLoading && (
          <div>
            <div className="mb-8 flex items-center gap-3">
              <BrushStripes loading className="h-5 w-24" />
              <span className="label">A carregar arquivo…</span>
            </div>
            <div className="grid grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        )}

        {!error && !isLoading && festivals.length === 0 && (
          <div className="state-card">
            <p className="label label--navy">Arquivo vazio</p>
            <h2 className="mt-2">Ainda não há festivais registados</h2>
            <p className="mt-3 text-ink-soft">
              Cria o primeiro festival para começares a construir o palmarés.
            </p>
            {isAuthenticated ? (
              <Button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="mt-6"
              >
                Novo festival
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => setIsLoginOpen(true)}
                className="mt-6"
              >
                Entrar para adicionar
              </Button>
            )}
          </div>
        )}

        {!error && !isLoading && festivals.length > 0 && (
          <>
            <StatsDashboard festivals={festivals} />

            <div className="mb-10 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-title text-2xl sm:text-3xl">Arquivo por ano</h2>
                <InkDivider className="mt-2 w-44 opacity-70" />
              </div>
              <span className="label">
                {festivals.length} {festivals.length === 1 ? 'festival' : 'festivais'}
              </span>
            </div>

            <div className="flex flex-col gap-24">
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

      <footer className="site-footer">
        <Watercolor tone="green" className="bottom-[-8rem] left-[-5rem]" />
        <Watercolor tone="ochre" className="right-[-6rem] top-[-4rem]" />
        <div className="page-shell relative">
          <BrushStripes className="footer-stripes" />
          <InkDivider className="mb-4 opacity-60" />
          <div className="footer-inner">
            <Brand compact className="footer-brand" />
            <div className="flex flex-col items-start gap-1 sm:items-end">
              <p className="label label--ink">© {new Date().getFullYear()} Instituna</p>
              <p className="label">Arquivo de festivais de tunas</p>
            </div>
          </div>
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
