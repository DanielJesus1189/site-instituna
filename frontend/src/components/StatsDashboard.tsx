import { useMemo } from 'react';
import type { Festival } from '../types';
import { AWARD_CATEGORIES, categorizePremio, getDistrict } from '../utils/districts';
import { PortugalMap } from './PortugalMap';

interface StatsDashboardProps {
  festivals: Festival[];
}

/** Inline SVG icons — black stroke, ~40px, optional small blue accent fill. */
function StatIcon({ icon }: { icon: string }) {
  const size = 40;

  switch (icon) {
    case 'trophy':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 6h16v4a8 8 0 0 1-16 0V6Z" />
          <path d="M12 6H8a2 2 0 0 0-2 2v1a4 4 0 0 0 4 4h2" />
          <path d="M28 6h4a2 2 0 0 1 2 2v1a4 4 0 0 1-4 4h-2" />
          <path d="M20 22v6" />
          <path d="M16 32h8a2 2 0 0 1 2 2H14a2 2 0 0 1 2-2Z" />
        </svg>
      );
    case 'tambourine':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="20" cy="20" r="14" />
          <circle cx="20" cy="20" r="10" strokeDasharray="3 2" />
          <circle cx="20" cy="20" r="4" fill="#4a90d9" stroke="#4a90d9" />
          <line x1="20" y1="6" x2="20" y2="10" strokeWidth="2.5" />
          <line x1="20" y1="30" x2="20" y2="34" strokeWidth="2.5" />
          <line x1="6" y1="20" x2="10" y2="20" strokeWidth="2.5" />
          <line x1="30" y1="20" x2="34" y2="20" strokeWidth="2.5" />
        </svg>
      );
    case 'flag':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="8" y2="34" />
          <polygon points="8,6 30,10 8,18" fill="#4a90d9" stroke="#4a90d9" />
        </svg>
      );
    case 'guitar':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="28" cy="12" r="5" />
          <line x1="25" y1="15" x2="12" y2="28" />
          <rect x="9" y="27" width="6" height="8" rx="3" />
          <line x1="12" y1="22" x2="12" y2="27" />
          <line x1="15" y1="10" x2="28" y2="10" />
          <circle cx="28" cy="12" r="2" fill="#4a90d9" stroke="none" />
        </svg>
      );
    case 'vinyl':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="20" cy="20" r="14" />
          <circle cx="20" cy="20" r="6" />
          <line x1="20" y1="14" x2="20" y2="26" />
          <line x1="14" y1="20" x2="26" y2="20" />
          <circle cx="20" cy="20" r="2" fill="#4a90d9" stroke="none" />
        </svg>
      );
    case 'microphone':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="15" y="4" width="10" height="16" rx="5" />
          <line x1="20" y1="22" x2="20" y2="30" />
          <line x1="14" y1="30" x2="26" y2="30" />
          <path d="M12 18a8 8 0 0 0 16 0" />
          <circle cx="20" cy="10" r="2" fill="#4a90d9" stroke="none" />
        </svg>
      );
    case 'moon':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M28 6c-7.7 0-14 6.3-14 14s6.3 14 14 14c-3.3 0-6.5-1.2-8.8-3.5a12.5 12.5 0 0 1 0-17.7A12.3 12.3 0 0 1 28 6Z" />
          <circle cx="26" cy="12" r="1.5" fill="#4a90d9" stroke="none" />
          <circle cx="30" cy="9" r="1" fill="#4a90d9" stroke="none" />
          <circle cx="32" cy="14" r="1.2" fill="#4a90d9" stroke="none" />
        </svg>
      );
    case 'beer':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="10" y="8" width="14" height="24" rx="2" />
          <rect x="10" y="8" width="14" height="6" rx="1" fill="#4a90d9" stroke="#4a90d9" />
          <rect x="24" y="14" width="6" height="8" rx="1" />
          <line x1="17" y1="18" x2="17" y2="28" />
          <line x1="13" y1="18" x2="13" y2="24" />
        </svg>
      );
    case 'grid':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="14" height="14" rx="2" />
          <rect x="22" y="4" width="14" height="14" rx="2" />
          <rect x="4" y="22" width="14" height="14" rx="2" />
          <rect x="22" y="22" width="14" height="14" rx="2" />
          <rect x="22" y="22" width="14" height="14" rx="2" fill="#4a90d9" stroke="#4a90d9" opacity="0.3" />
          <polygon points="29,26 31,30 35,30 32,33 33,37 29,34 25,37 26,33 23,30 27,30" fill="#4a90d9" stroke="none" />
        </svg>
      );
    default:
      return null;
  }
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
      <div className="mb-12 flex flex-wrap justify-center gap-4">
        {AWARD_CATEGORIES.map((cat) => (
          <div
            key={cat.key}
            className="flex w-[130px] flex-col items-center rounded-xl border border-zinc-200 bg-white px-3 py-5 shadow-sm"
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
        <PortugalMap districtCounts={districtCounts} districtFestivals={districtFestivals} />
      </div>

      <h3 className="mt-6 text-center text-lg font-bold tracking-widest text-zinc-900">
        FESTIVAIS
      </h3>
    </section>
  );
}
