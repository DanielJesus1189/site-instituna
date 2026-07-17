import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const GEOJSON_URL =
  'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/portugal.geojson';

const WIDTH = 900;
const HEIGHT = 750;

// ── Real coastline polygons for Madeira archipelago (Natural Earth data, 0.0005° tolerance) ──

const PORTO_SANTO_COORDS: [number, number][] = [
  [-16.48705, 32.49168], [-16.52184, 32.53950], [-16.53043, 32.54853],
  [-16.53677, 32.55801], [-16.54076, 32.56851], [-16.54235, 32.58051],
  [-16.52526, 32.56721], [-16.50666, 32.54418], [-16.49206, 32.51716],
];

const MADEIRA_COORDS: [number, number][] = [
  [-16.78869, 32.68667], [-16.80639, 32.65681], [-16.84781, 32.64403],
  [-16.89590, 32.64159], [-16.97680, 32.64720], [-17.14297, 32.70555],
  [-17.18065, 32.72598], [-17.21447, 32.75064], [-17.24120, 32.77912],
  [-17.24991, 32.79654], [-17.25211, 32.81452], [-17.24645, 32.82860],
  [-17.23127, 32.83438], [-17.22497, 32.83930], [-17.20027, 32.86848],
  [-17.19140, 32.87275], [-17.18489, 32.87417], [-17.17756, 32.87275],
  [-17.16613, 32.86848], [-17.15575, 32.86123], [-17.13195, 32.83906],
  [-17.12169, 32.83438], [-17.11555, 32.83344], [-17.09390, 32.82770],
  [-17.06798, 32.81415], [-17.04117, 32.81220], [-17.01431, 32.81704],
  [-16.99478, 32.82754], [-16.97997, 32.83324], [-16.95788, 32.83779],
  [-16.91975, 32.84121], [-16.90307, 32.83633], [-16.87287, 32.81745],
  [-16.86075, 32.81322], [-16.80870, 32.78001], [-16.79747, 32.77456],
  [-16.78563, 32.77228], [-16.74747, 32.77082], [-16.73013, 32.76679],
  [-16.71361, 32.75861], [-16.70368, 32.76463], [-16.69302, 32.76667],
  [-16.68248, 32.76463], [-16.67268, 32.75861], [-16.68977, 32.75487],
  [-16.72509, 32.74116], [-16.73786, 32.73810], [-16.74999, 32.73062],
  [-16.78222, 32.69611],
];

const DESERTAS_COORDS: [number, number][] = [
  [-16.33995, 33.05720], [-16.35269, 33.04377], [-16.36433, 33.03437],
  [-16.37829, 33.03205], [-16.39835, 33.03978], [-16.39835, 33.04662],
  [-16.38801, 33.04735], [-16.37987, 33.05134], [-16.37413, 33.05817],
  [-16.36168, 33.09032], [-16.34130, 33.10594], [-16.31713, 33.11078],
  [-16.29589, 33.10126], [-16.28913, 33.10871], [-16.28978, 33.07941],
  [-16.28600, 33.06753], [-16.27538, 33.06025], [-16.31078, 33.06607],
  [-16.32567, 33.06582],
];

// ── Real coastline polygons for Azores archipelago (Natural Earth data, 0.0005° tolerance) ──

const SANTA_MARIA_COORDS: [number, number][] = [
  [-25.06680, 37.02147], [-25.04674, 37.01073], [-25.02921, 36.99238],
  [-25.01692, 36.97044], [-25.01220, 36.94920], [-25.02709, 36.93431],
  [-25.06066, 36.93724], [-25.11901, 36.95262], [-25.15172, 36.94587],
  [-25.16910, 36.94599], [-25.17667, 36.95604], [-25.18322, 36.96890],
  [-25.19530, 36.98017], [-25.20165, 36.99042], [-25.19099, 37.00043],
  [-25.17032, 37.01553], [-25.13362, 37.02302], [-25.09447, 37.02448],
];

const SAO_MIGUEL_COORDS: [number, number][] = [
  [-25.19783, 37.86441], [-25.15917, 37.85204], [-25.13516, 37.82233],
  [-25.13231, 37.78620], [-25.15685, 37.75454], [-25.19473, 37.74071],
  [-25.32755, 37.72724], [-25.37243, 37.71743], [-25.42032, 37.71357],
  [-25.46544, 37.71540], [-25.48827, 37.71369], [-25.50569, 37.70673],
  [-25.53270, 37.72012], [-25.55907, 37.72907], [-25.61555, 37.74091],
  [-25.70425, 37.74404], [-25.82506, 37.81542], [-25.85949, 37.85391],
  [-25.84146, 37.90599], [-25.76456, 37.91157], [-25.73908, 37.90599],
  [-25.70421, 37.88264], [-25.69811, 37.87434], [-25.69717, 37.86254],
  [-25.69420, 37.85269], [-25.68883, 37.84585], [-25.68073, 37.84333],
  [-25.55378, 37.82966], [-25.53889, 37.83295], [-25.51256, 37.84748],
  [-25.49889, 37.85077], [-25.48986, 37.84805], [-25.46886, 37.83466],
  [-25.45848, 37.82966], [-25.44205, 37.83731], [-25.33975, 37.86180],
];

const TERCEIRA_COORDS: [number, number][] = [
  [-27.02013, 38.69367], [-27.02575, 38.69001], [-27.04776, 38.68293],
  [-27.05435, 38.67939], [-27.05614, 38.67133], [-27.05175, 38.65428],
  [-27.05435, 38.64521], [-27.06029, 38.64142], [-27.08910, 38.63101],
  [-27.11417, 38.63898], [-27.18171, 38.63935], [-27.20450, 38.65266],
  [-27.21715, 38.64130], [-27.22838, 38.64110], [-27.25292, 38.65266],
  [-27.27880, 38.65742], [-27.30476, 38.65888], [-27.32763, 38.66633],
  [-27.35269, 38.68439], [-27.37340, 38.70698], [-27.38329, 38.72773],
  [-27.39171, 38.75886], [-27.36876, 38.78266], [-27.33178, 38.79804],
  [-27.29821, 38.80353], [-27.14428, 38.79609], [-27.11555, 38.78608],
  [-27.07506, 38.76700], [-27.04255, 38.74445], [-27.03751, 38.72435],
  [-27.04088, 38.71442], [-27.03283, 38.70856], [-27.02282, 38.70283],
];

const GRACIOSA_COORDS: [number, number][] = [
  [-27.98347, 39.01512], [-28.00390, 39.01594], [-28.02522, 39.01911],
  [-28.04516, 39.02558], [-28.06163, 39.03628], [-28.07299, 39.05297],
  [-28.07152, 39.06761], [-28.05484, 39.09772], [-28.04483, 39.10322],
  [-28.03433, 39.10505], [-28.02383, 39.10322], [-28.01382, 39.09772],
  [-28.00707, 39.10456], [-27.99128, 39.08779], [-27.95808, 39.06647],
  [-27.94221, 39.05305], [-27.93590, 39.03596], [-27.94717, 39.02424],
  [-27.96622, 39.01732],
];

const SAO_JORGE_COORDS: [number, number][] = [
  [-27.89098, 38.60423], [-27.81664, 38.58283], [-27.77892, 38.56708],
  [-27.76061, 38.54902], [-27.77745, 38.54413], [-27.79646, 38.54157],
  [-27.83576, 38.54279], [-27.85220, 38.54727], [-27.88492, 38.56053],
  [-27.91515, 38.56517], [-27.93200, 38.57030], [-27.94860, 38.57783],
  [-27.96239, 38.58686], [-27.97688, 38.59309], [-28.00377, 38.58942],
  [-28.02074, 38.59740], [-28.03454, 38.59007], [-28.04418, 38.59394],
  [-28.06163, 38.61172], [-28.07437, 38.61762], [-28.17789, 38.64509],
  [-28.19579, 38.65575], [-28.21557, 38.68212], [-28.22305, 38.68623],
  [-28.23111, 38.68505], [-28.23473, 38.68325], [-28.23864, 38.68285],
  [-28.24722, 38.68623], [-28.24962, 38.68993], [-28.24853, 38.69440],
  [-28.24926, 38.69819], [-28.25719, 38.69990], [-28.26549, 38.70319],
  [-28.31212, 38.73526], [-28.31579, 38.74209], [-28.31554, 38.75507],
  [-28.29747, 38.74925], [-28.26448, 38.73151], [-28.25036, 38.72773],
  [-28.23253, 38.72557], [-28.03433, 38.66633],
];

const PICO_COORDS: [number, number][] = [
  [-28.10949, 38.44660], [-28.06383, 38.44278], [-28.04711, 38.43256],
  [-28.04060, 38.40908], [-28.05419, 38.39851], [-28.08487, 38.39818],
  [-28.16271, 38.40717], [-28.18521, 38.40595], [-28.20531, 38.40034],
  [-28.24185, 38.37759], [-28.25365, 38.38255], [-28.26293, 38.39484],
  [-28.27457, 38.40567], [-28.29678, 38.41132], [-28.43944, 38.41352],
  [-28.45954, 38.40567], [-28.52538, 38.45392], [-28.54890, 38.48444],
  [-28.54890, 38.52855], [-28.51867, 38.55012], [-28.48526, 38.55781],
  [-28.41454, 38.55646], [-28.37450, 38.55048], [-28.27457, 38.50186],
  [-28.23913, 38.48965], [-28.23668, 38.48754], [-28.22623, 38.48444],
  [-28.20629, 38.47085], [-28.19579, 38.46772], [-28.17447, 38.46479],
];

const FAIAL_COORDS: [number, number][] = [
  [-28.60973, 38.59740], [-28.59606, 38.55272], [-28.60302, 38.55150],
  [-28.63500, 38.54060], [-28.64395, 38.53535], [-28.63781, 38.52945],
  [-28.63537, 38.52578], [-28.63207, 38.52363], [-28.62340, 38.52237],
  [-28.63622, 38.51553], [-28.64782, 38.51582], [-28.67178, 38.52237],
  [-28.68395, 38.52143], [-28.71435, 38.51533], [-28.72704, 38.51488],
  [-28.74958, 38.52351], [-28.77538, 38.55439], [-28.79532, 38.56952],
  [-28.84114, 38.59113], [-28.84240, 38.59943], [-28.80895, 38.60423],
  [-28.77990, 38.60489], [-28.76635, 38.60676], [-28.75377, 38.61172],
  [-28.74511, 38.61921], [-28.72859, 38.63898], [-28.71959, 38.64521],
  [-28.63264, 38.61400],
];

const FLORES_COORDS: [number, number][] = [
  [-31.20792, 39.50861], [-31.19856, 39.50218], [-31.18627, 39.49665],
  [-31.17272, 39.49535], [-31.15954, 39.50178], [-31.14074, 39.48273],
  [-31.13268, 39.46552], [-31.13158, 39.42300], [-31.13903, 39.40029],
  [-31.15665, 39.37263], [-31.17723, 39.35562], [-31.19367, 39.36465],
  [-31.21251, 39.35773], [-31.23445, 39.35570], [-31.25475, 39.35810],
  [-31.26879, 39.36465], [-31.27815, 39.37840], [-31.28466, 39.39789],
  [-31.28490, 39.41616], [-31.27562, 39.42609], [-31.28091, 39.44310],
  [-31.27562, 39.45710], [-31.26708, 39.47207], [-31.26256, 39.49189],
  [-31.25577, 39.50747], [-31.23933, 39.51756], [-31.21898, 39.52241],
  [-31.20051, 39.52220],
];

const CORVO_COORDS: [number, number][] = [
  [-31.11730, 39.72834], [-31.08267, 39.72272], [-31.08023, 39.69331],
  [-31.09997, 39.66401], [-31.13158, 39.65884], [-31.13305, 39.66535],
  [-31.14891, 39.69636], [-31.15270, 39.70108], [-31.14965, 39.71149],
  [-31.14110, 39.72089], [-31.12938, 39.72712],
];

interface IslandData {
  name: string;
  coords: [number, number][];
}

const AZORES_ISLANDS: IslandData[] = [
  { name: 'Açores', coords: SAO_MIGUEL_COORDS },
  { name: 'Açores', coords: SANTA_MARIA_COORDS },
  { name: 'Açores', coords: TERCEIRA_COORDS },
  { name: 'Açores', coords: GRACIOSA_COORDS },
  { name: 'Açores', coords: SAO_JORGE_COORDS },
  { name: 'Açores', coords: PICO_COORDS },
  { name: 'Açores', coords: FAIAL_COORDS },
  { name: 'Açores', coords: FLORES_COORDS },
  { name: 'Açores', coords: CORVO_COORDS },
];

const MADEIRA_ISLANDS: IslandData[] = [
  { name: 'Madeira', coords: MADEIRA_COORDS },
  { name: 'Madeira', coords: PORTO_SANTO_COORDS },
  { name: 'Madeira', coords: DESERTAS_COORDS },
];

interface PortugalMapProps {
  /** Map of district name → festival names */
  districtCounts: Record<string, number>;
  districtFestivals: Record<string, string[]>;
}

/** Build a GeoJSON Feature from a real island coastline. */
function makeIslandFeature(
  id: string,
  name: string,
  coords: [number, number][],
): GeoJSON.Feature {
  return {
    type: 'Feature',
    id,
    properties: { name },
    geometry: {
      type: 'Polygon',
      coordinates: [coords],
    },
  };
}

function makeIslandFeatureCollection(
  islands: IslandData[],
  prefix: string,
): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: islands.map((isl, i) =>
      makeIslandFeature(`${prefix}-${i}`, isl.name, isl.coords),
    ),
  };
}

export function PortugalMap({ districtCounts, districtFestivals }: PortugalMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipVisibleRef = useRef(false);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const [geoData, setGeoData] = useState<GeoJSON.FeatureCollection | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Fetch GeoJSON
  useEffect(() => {
    let cancelled = false;
    fetch(GEOJSON_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: GeoJSON.FeatureCollection) => {
        if (!cancelled) {
          console.log('GeoJSON features loaded:', data.features.length);
          setGeoData(data);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) setLoadError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Render map when GeoJSON loads or districtCounts change
  useEffect(() => {
    if (!svgRef.current || !geoData) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`);

    // Color scale
    const allCounts = Object.values(districtCounts);
    const maxCount = allCounts.length > 0 ? Math.max(...allCounts) : 0;
    const minCount = allCounts.length > 0 ? Math.min(...allCounts) : 0;

    const colorScale = d3
      .scaleQuantize<string>()
      .domain([minCount, Math.max(maxCount, 1)])
      .range(
        maxCount <= 1
          ? ['#b0b0b0', '#2f7fb8']
          : ['#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#2f7fb8'],
      );

    function getFill(districtName: string): string {
      const count = districtCounts[districtName] ?? 0;
      if (count === 0) return '#b0b0b0';
      return colorScale(count);
    }

    // --- Mainland projection ---
    const mainlandFC: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: geoData.features,
    };

    const mainlandProjection = d3
      .geoMercator()
      .fitExtent([[30, 30], [WIDTH - 40, HEIGHT - 160]], mainlandFC);

    const mainlandPath = d3.geoPath().projection(mainlandProjection);

    // --- Azores inset — use identity projection to preserve real island shapes ---
    const azoresFC = makeIslandFeatureCollection(AZORES_ISLANDS, 'azores');
    const azoresProj = d3
      .geoIdentity()
      .reflectY(false)
      .fitExtent(
        [
          [30, 460],
          [220, 600],
        ],
        azoresFC,
      );
    const azoresPath = d3.geoPath().projection(azoresProj);

    // --- Madeira inset ---
    const madeiraFC = makeIslandFeatureCollection(MADEIRA_ISLANDS, 'madeira');
    const madeiraProj = d3
      .geoIdentity()
      .reflectY(false)
      .fitExtent(
        [
          [30, 640],
          [140, 730],
        ],
        madeiraFC,
      );
    const madeiraPath = d3.geoPath().projection(madeiraProj);

    // Helper to get fill for islands based on parent region
    function getIslandFill(islandName: string): string {
      return getFill(islandName);
    }

    // Helper: render GeoJSON features
    function renderFeatures(
      group: d3.Selection<SVGGElement, unknown, null, undefined>,
      features: GeoJSON.Feature[],
      pathGen: d3.GeoPath,
      fillFn: (name: string) => string,
      labelKey: string,
    ) {
      const paths = group
        .selectAll('path')
        .data(features)
        .enter()
        .append('path')
        .attr('d', (d) => {
          const dStr = pathGen(d) ?? '';
          if (!dStr) console.warn(`Empty path for ${d.properties?.name ?? 'unknown'}`);
          return dStr;
        })
        .attr('fill', (d) => {
          const name = d.properties?.[labelKey] ?? '';
          return fillFn(name);
        })
        .attr('data-base-fill', (d) => {
          const name = d.properties?.[labelKey] ?? '';
          return fillFn(name);
        })
        .attr('data-hover-fill', () => '#0d3b66')
        .attr('data-name', (d) => d.properties?.[labelKey] ?? '')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1)
        .attr('stroke-linejoin', 'round')
        .style('cursor', 'pointer');

      // Hover: fill after 50ms, tooltip after 1s
      paths
        .on('mouseenter', function () {
          const el = d3.select(this);
          const name = el.attr('data-name');
          const festivalList = districtFestivals[name] ?? [];

          if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
          if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);

          hoverTimerRef.current = setTimeout(() => {
            el.attr('fill', el.attr('data-hover-fill'));
          }, 50);

          tooltipTimerRef.current = setTimeout(() => {
            tooltipVisibleRef.current = true;
            if (tooltipRef.current) {
              tooltipRef.current.style.display = 'block';
              tooltipRef.current.style.left = `${mousePosRef.current.x + 12}px`;
              tooltipRef.current.style.top = `${mousePosRef.current.y - 28}px`;
              const lines = festivalList.length > 0
                ? festivalList.join('\n')
                : 'sem festivais';
              tooltipRef.current.textContent = `${name}:\n${lines}`;
            }
          }, 1000);
        })
        .on('mouseleave', function () {
          if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current);
            hoverTimerRef.current = null;
          }
          if (tooltipTimerRef.current) {
            clearTimeout(tooltipTimerRef.current);
            tooltipTimerRef.current = null;
          }
          tooltipVisibleRef.current = false;
          const el = d3.select(this);
          el.attr('fill', el.attr('data-base-fill'));
          if (tooltipRef.current) {
            tooltipRef.current.style.display = 'none';
          }
        });

    // Single mousemove handler — tracks mouse position
    svg.on('mousemove', (event: MouseEvent) => {
      mousePosRef.current.x = event.clientX;
      mousePosRef.current.y = event.clientY;
      if (tooltipVisibleRef.current && tooltipRef.current) {
        tooltipRef.current.style.left = `${event.clientX + 12}px`;
        tooltipRef.current.style.top = `${event.clientY - 28}px`;
      }
    });
    }

    // Render mainland
    const mainlandGroup = svg.append('g').attr('class', 'mainland');
    renderFeatures(
      mainlandGroup,
      geoData.features,
      mainlandPath,
      (name) => getFill(name),
      'name',
    );

    // Render Azores inset
    const azoresGroup = svg.append('g').attr('class', 'azores');
    renderFeatures(azoresGroup, azoresFC.features, azoresPath, getIslandFill, 'name');

    // Render Madeira inset
    const madeiraGroup = svg.append('g').attr('class', 'madeira');
    renderFeatures(madeiraGroup, madeiraFC.features, madeiraPath, getIslandFill, 'name');

    // Labels for insets
    svg
      .append('text')
      .attr('x', 125)
      .attr('y', 453)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('fill', '#666')
      .text('Açores');

    svg
      .append('text')
      .attr('x', 85)
      .attr('y', 634)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('fill', '#666')
      .text('Madeira');
  }, [geoData, districtCounts]);

  if (loadError) {
    return <p className="text-sm text-red-600">Erro ao carregar mapa: {loadError}</p>;
  }

  if (!geoData) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <p className="text-sm text-zinc-400">A carregar mapa...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <svg
        ref={svgRef}
        className="h-auto w-full"
        style={{ maxWidth: '100%', background: 'transparent' }}
        preserveAspectRatio="xMidYMid meet"
      />
      <div
        ref={tooltipRef}
        className="pointer-events-none fixed z-50 hidden whitespace-pre-line rounded-md bg-black/80 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg"
      />
    </div>
  );
}
