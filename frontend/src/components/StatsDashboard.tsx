import { useMemo } from 'react';
import type { Festival } from '../types';
import { AWARD_CATEGORIES, categorizePremio, getDistrict } from '../utils/districts';
import { PortugalMap } from './PortugalMap';

interface StatsDashboardProps {
  festivals: Festival[];
}

const ICON_MAP: Record<string, string> = {
  trophy: '/trophy-svgrepo-com.svg',
  tambourine: '/tambourine-svgrepo-com.svg',
  flag: '/flag-with-stick.svg',
  guitar: '/stringed-isntrument-violin-viola-cello-svgrepo-com.svg',
  vinyl: '/vinyl-svgrepo-com.svg',
  microphone: '/microphone-large-svgrepo-com.svg',
  moon: '/window-svgrepo-com.svg',
  beer: '/beer-mug-full-svgrepo-com.svg',
  grid: '/award-prize-rate-rating-reward-stars-2-svgrepo-com.svg',
};

function StatIcon({ icon }: { icon: string }) {
  const src = ICON_MAP[icon];
  if (!src) return null;
  return <img src={src} alt="" className="h-4 w-4 object-contain opacity-55 grayscale" />;
}

function categoryLabel(key: string): string {
  if (key === 'Outros Prémios') return 'Outros';
  return key.replace('Melhor ', '');
}

export function StatsDashboard({ festivals }: StatsDashboardProps) {
  const awardCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of AWARD_CATEGORIES) {
      counts[cat.key] = 0;
    }
    for (const festival of festivals) {
      for (const premio of festival.premios) {
        const category = categorizePremio(premio.name);
        counts[category] = (counts[category] ?? 0) + 1;
      }
    }
    return counts;
  }, [festivals]);

  const districtFestivals = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const festival of festivals) {
      const district = getDistrict(festival.location);
      if (district) {
        if (!map[district]) map[district] = [];
        map[district].push(festival.name);
      }
    }
    return map;
  }, [festivals]);

  const districtCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const [district, names] of Object.entries(districtFestivals)) {
      counts[district] = names.length;
    }
    return counts;
  }, [districtFestivals]);

  return (
    <section className="mb-20">
      <div className="flex items-baseline justify-between border-b border-ink/15 pb-3">
        <h2 className="font-serif text-2xl font-semibold">Palmarés acumulado</h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
          Totais por categoria
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 lg:grid-cols-9">
        {AWARD_CATEGORIES.map((cat) => (
          <div key={cat.key} className="border-l border-ink/15 pl-3">
            <div className="flex min-h-8 items-start gap-2">
              <StatIcon icon={cat.icon} />
              <p className="font-mono text-[9px] uppercase leading-tight tracking-[0.14em] text-ink-soft">
                {categoryLabel(cat.key)}
              </p>
            </div>
            <p className="mt-2 font-serif text-3xl font-semibold leading-none">
              {awardCounts[cat.key] ?? 0}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-14 border-y border-ink/15 py-8">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h3 className="font-serif text-2xl font-semibold">Mapa de festivais</h3>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
            Distribuição por distrito
          </span>
        </div>

        <div className="mx-auto max-w-3xl">
          <PortugalMap districtCounts={districtCounts} districtFestivals={districtFestivals} />
        </div>
      </div>
    </section>
  );
}
