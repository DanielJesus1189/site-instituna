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
  return <img src={src} alt="" className="h-10 w-10 object-contain" />;
}

export function StatsDashboard({ festivals }: StatsDashboardProps) {
  // Compute award counts
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

  // Compute district → festival names from festival locations
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
    <section className="mb-16">
      {/* ---- Stat Card Row ---- */}
      <div className="mb-12 grid grid-cols-9 gap-4">
        {AWARD_CATEGORIES.map((cat) => (
          <div
            key={cat.key}
            className="flex flex-col items-center rounded-xl border border-zinc-200 bg-white px-3 py-5 shadow-sm"
          >
            <div className="mb-3">
              <StatIcon icon={cat.icon} />
            </div>
            <p className="text-center text-[11px] font-bold leading-tight tracking-wide text-zinc-800">
              {cat.key === 'Tuna Mais Tuna'
                ? 'Tuna Mais\nTuna'
                : cat.key === 'Outros Prémios'
                  ? 'Outros\nPrémios'
                  : cat.key.replace('Melhor ', 'Melhor\n')}
            </p>
            <p className="mt-2 text-2xl font-bold text-zinc-900">
              {awardCounts[cat.key] ?? 0}
            </p>
          </div>
        ))}
      </div>

      {/* ---- Map Section ---- */}
      <h2 className="mb-6 text-center text-xl font-bold tracking-widest text-zinc-900">
        MAPA DE FESTIVAIS
      </h2>

      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <PortugalMap districtCounts={districtCounts} districtFestivals={districtFestivals} />
        </div>
      </div>

      <h3 className="mt-6 text-center text-lg font-bold tracking-widest text-zinc-900">
        FESTIVAIS
      </h3>
    </section>
  );
}
