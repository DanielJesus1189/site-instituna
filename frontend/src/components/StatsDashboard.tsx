import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import type { Festival } from '../types';
import { AWARD_CATEGORIES, categorizePremio, getDistrict } from '../utils/districts';
import type { AwardKey } from '../utils/districts';
import { categoryLabel } from '../utils/categoryLabel';
import { PortugalMap } from './PortugalMap';
import { InkDivider } from './ui/InkDivider';
import { Reveal } from './ui/Reveal';

interface StatsDashboardProps {
  festivals: Festival[];
  activeCategory: AwardKey | null;
  onSelectCategory: (category: AwardKey) => void;
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

const STAMP_TILTS = [-1.1, 0.7, -0.5, 1.2, -0.8, 0.4, -1.3, 0.9, -0.3];

function StatIcon({ icon }: { icon: string }) {
  const src = ICON_MAP[icon];
  if (!src) return null;
  return <img src={src} alt="" width={18} height={18} loading="lazy" />;
}

export function StatsDashboard({
  festivals,
  activeCategory,
  onSelectCategory,
}: StatsDashboardProps) {
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
    <section className="mb-24">
      <div className="section-heading">
        <div>
          <h2>Palmarés acumulado</h2>
          <InkDivider className="mt-2 w-40 opacity-70" />
        </div>
        <span className="label">Totais por categoria</span>
      </div>

      <div className="stats-grid mt-7">
        {AWARD_CATEGORIES.map((cat, index) => {
          const style = {
            '--tilt': `${STAMP_TILTS[index] ?? 0}deg`,
          } as CSSProperties;
          const count = awardCounts[cat.key] ?? 0;
          const isActive = activeCategory === cat.key;
          const label = categoryLabel(cat.key);

          return (
            <Reveal key={cat.key} delay={index * 45} tilt={STAMP_TILTS[index] ?? 0}>
              <button
                type="button"
                className="stat-stamp"
                style={style}
                aria-pressed={isActive}
                aria-label={`${label}: ${count} ${count === 1 ? 'festival' : 'festivais'}`}
                disabled={count === 0 && !isActive}
                onClick={() => onSelectCategory(cat.key)}
              >
                <div className="stat-stamp__top">
                  <span className="stat-stamp__icon">
                    <StatIcon icon={cat.icon} />
                  </span>
                  <p className="stat-stamp__label">{label}</p>
                </div>
                <p className="stat-stamp__number">{count}</p>
              </button>
            </Reveal>
          );
        })}
      </div>

      <p className="field-hint mt-3">
        Toca num selo para ver apenas os festivais dessa categoria.
      </p>

      <div className="mt-16">
        <div className="section-heading">
          <div>
            <h3>Mapa de festivais</h3>
            <InkDivider className="mt-2 w-36 opacity-70" />
          </div>
          <span className="label">Distribuição por distrito</span>
        </div>

        <div className="mx-auto mt-6 max-w-3xl">
          <div className="map-frame">
            <PortugalMap
              districtCounts={districtCounts}
              districtFestivals={districtFestivals}
            />
          </div>

          <div className="map-legend" role="group" aria-label="Legenda do mapa">
            <span
              className="map-legend__swatch"
              style={{ background: 'var(--paper-light)' }}
              aria-hidden="true"
            />
            <span className="label">Sem festivais</span>
            <span className="label">Menos</span>
            <span className="map-legend__scale" aria-hidden="true" />
            <span className="label">Mais</span>
          </div>
        </div>
      </div>
    </section>
  );
}
