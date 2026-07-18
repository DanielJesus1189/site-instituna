/**
 * Portuguese district names (18 mainland + 2 autonomous regions).
 */
export const DISTRICTS = [
  'Aveiro',
  'Beja',
  'Braga',
  'Bragança',
  'Castelo Branco',
  'Coimbra',
  'Évora',
  'Faro',
  'Guarda',
  'Leiria',
  'Lisboa',
  'Portalegre',
  'Porto',
  'Santarém',
  'Setúbal',
  'Viana do Castelo',
  'Vila Real',
  'Viseu',
  'Açores',
  'Madeira',
] as const;

export type District = (typeof DISTRICTS)[number];

/**
 * Map of Portuguese cities/towns → districts.
 * Add more as needed.
 */
const CITY_TO_DISTRICT: Record<string, District> = {
  // Aveiro
  aveiro: 'Aveiro',
  'ílhavo': 'Aveiro',
  'são joão da madeira': 'Aveiro',
  ovar: 'Aveiro',
  'espinho': 'Aveiro',
  'santa maria da feira': 'Aveiro',
  'águeda': 'Aveiro',
  'anadia': 'Aveiro',
  'estarreja': 'Aveiro',
  'albergaria-a-velha': 'Aveiro',
  'oliveira de azeméis': 'Aveiro',
  'castelo de paiva': 'Aveiro',
  'vale de cambra': 'Aveiro',
  sever: 'Aveiro',

  // Beja
  beja: 'Beja',
  'aljustrel': 'Beja',
  'almodôvar': 'Beja',
  'alcácer do sal': 'Setúbal', // Actually Setúbal but keeping for completeness
  'cuba': 'Beja',
  'ferreira do alentejo': 'Beja',
  'mértola': 'Beja',
  'odmira': 'Beja',
  'ourique': 'Beja',
  'serpa': 'Beja',
  'castro verde': 'Beja',

  // Braga
  braga: 'Braga',
  'barcelos': 'Braga',
  'famalicão': 'Braga',
  'vila nova de famalicão': 'Braga',
  'guimarães': 'Braga',
  'fafe': 'Braga',
  'vizela': 'Braga',
  'vila verde': 'Braga',
  'póvoa de lanhoso': 'Braga',
  'terras de bouro': 'Braga',
  'cabeceiras de basto': 'Braga',
  'celorico de basto': 'Braga',
  'esposende': 'Braga',
  'vieira do minho': 'Braga',
  'amares': 'Braga',

  // Bragança
  bragança: 'Bragança',
  'miranda do douro': 'Bragança',
  'mogadouro': 'Bragança',
  'macedo de cavaleiros': 'Bragança',
  'alfândega da fé': 'Bragança',
  'vila flor': 'Bragança',
  'viminioso': 'Bragança',
  'torre de moncorvo': 'Bragança',
  'freixo de espada à cinta': 'Bragança',
  'carrazeda de ansiães': 'Bragança',

  // Castelo Branco
  'castelo branco': 'Castelo Branco',
  'covinglhã': 'Castelo Branco',
  'fundão': 'Castelo Branco',
  'idanha-a-nova': 'Castelo Branco',
  'oliveira do hospital': 'Coimbra', // actually Coimbra
  'proença-a-nova': 'Castelo Branco',
  'sertã': 'Castelo Branco',
  'vila de rei': 'Castelo Branco',
  'penamacor': 'Castelo Branco',

  // Coimbra
  coimbra: 'Coimbra',
  'figueira da foz': 'Coimbra',
  'cantanhede': 'Coimbra',
  'montemor-o-velho': 'Coimbra',
  'soure': 'Coimbra',
  'condeixa-a-nova': 'Coimbra',
  'mira': 'Coimbra',
  'argonilha': 'Coimbra',
  'tábua': 'Coimbra',
  'arganil': 'Coimbra',
  'góis': 'Coimbra',
  'lousã': 'Coimbra',
  'penacova': 'Coimbra',
  'poiares': 'Coimbra',
  'vila nova de poiares': 'Coimbra',
  'penela': 'Coimbra',

  // Évora
  évora: 'Évora',
  'estremoz': 'Évora',
  'montemor-o-novo': 'Évora',
  'reguengos de monsaraz': 'Évora',
  'vendas novas': 'Évora',
  'vianas do alentejo': 'Évora',
  'portel': 'Évora',
  'redondo': 'Évora',
  'alandroal': 'Évora',
  'araiolos': 'Évora',
  'borba': 'Évora',
  'mora': 'Évora',
  'mourão': 'Évora',

  // Faro
  faro: 'Faro',
  'albufeira': 'Faro',
  'loulé': 'Faro',
  'portimão': 'Faro',
  'lagos': 'Faro',
  'silves': 'Faro',
  'olhão': 'Faro',
  'lagoa': 'Faro',
  'vila real de santo antónio': 'Faro',
  'tavira': 'Faro',
  'são brás de alportel': 'Faro',
  'monchique': 'Faro',
  'castro marim': 'Faro',
  'aljezur': 'Faro',
  'vila do bispo': 'Faro',

  // Guarda
  guarda: 'Guarda',
  'seia': 'Guarda',
  'gouveia': 'Guarda',
  'manteigas': 'Guarda',
  'pinhel': 'Guarda',
  'trancoso': 'Guarda',
  'figueira de castelo rodrigo': 'Guarda',
  'sabugal': 'Guarda',
  'meda': 'Guarda',
  'fornos de algodres': 'Guarda',
  'celorico da beira': 'Guarda',

  // Leiria
  leiria: 'Leiria',
  'caldas da rainha': 'Leiria',
  'peniche': 'Leiria',
  'alcobaça': 'Leiria',
  'nazaré': 'Leiria',
  'óbidos': 'Leiria',
  'porto de mós': 'Leiria',
  'batalha': 'Leiria',
  'marinha grande': 'Leiria',
  'pombal': 'Leiria',
  'ansão': 'Leiria',
  'alvaiázere': 'Leiria',
  'pedrogão grande': 'Leiria',

  // Lisboa
  lisboa: 'Lisboa',
  'lisbon': 'Lisboa',
  'sintra': 'Lisboa',
  'cascais': 'Lisboa',
  'oeiras': 'Lisboa',
  'amadora': 'Lisboa',
  'loures': 'Lisboa',
  'vila franca de xira': 'Lisboa',
  'torres vedras': 'Lisboa',
  'mafra': 'Lisboa',
  'lourinhã': 'Lisboa',
  'alcanena': 'Santarém',
  'arruda dos vinhos': 'Lisboa',
  'azambuja': 'Lisboa',
  'cadaval': 'Lisboa',
  'sobral de monte agraço': 'Lisboa',

  // Portalegre
  portalegre: 'Portalegre',
  'elvas': 'Portalegre',
  'campo maior': 'Portalegre',
  'ponte de sor': 'Portalegre',
  'crato': 'Portalegre',
  'nisa': 'Portalegre',
  'castelo de vide': 'Portalegre',
  'marvão': 'Portalegre',
  'alter do chão': 'Portalegre',
  'arronches': 'Portalegre',
  'gavião': 'Portalegre',

  // Porto
  porto: 'Porto',
  'vila nova de gaia': 'Porto',
  'gaia': 'Porto',
  'avintes': 'Porto',
  'gondomar': 'Porto',
  'maia': 'Porto',
  'matosinhos': 'Porto',
  'valongo': 'Porto',
  'póvoa de varzim': 'Porto',
  'vila do conde': 'Porto',
  'santo tirso': 'Porto',
  'penafiel': 'Porto',
  'pacos de ferreira': 'Porto',
  'trofa': 'Porto',
  'amarante': 'Porto',
  'baião': 'Porto',
  'felgueiras': 'Porto',
  'lousada': 'Porto',
  'marco de canaveses': 'Porto',
  'paredes': 'Porto',

  // Santarém
  santarém: 'Santarém',
  'tomar': 'Santarém',
  'abrantes': 'Santarém',
  'entroncamento': 'Santarém',
  'torres novas': 'Santarém',
  'ourém': 'Santarém',
  'fátima': 'Santarém',
  'alpiarça': 'Santarém',
  'benavente': 'Santarém',
  'cartaxo': 'Santarém',
  'chamusca': 'Santarém',
  'constância': 'Santarém',
  'coruche': 'Santarém',
  'ferreira do zêzere': 'Santarém',
  'golegã': 'Santarém',
  'macão': 'Santarém',
  'rio maior': 'Santarém',
  'salvaterra de magos': 'Santarém',

  // Setúbal
  setúbal: 'Setúbal',
  'barreiro': 'Setúbal',
  'almada': 'Setúbal',
  'seixal': 'Setúbal',
  'sesimbra': 'Setúbal',
  'palmela': 'Setúbal',
  'moita': 'Setúbal',
  'montijo': 'Setúbal',
  'alcochete': 'Setúbal',
  'grândola': 'Setúbal',
  'santiago do cacém': 'Setúbal',
  'sines': 'Setúbal',

  // Viana do Castelo
  'viana do castelo': 'Viana do Castelo',
  'ponte de lima': 'Viana do Castelo',
  'arcos de valdevez': 'Viana do Castelo',
  'ponte da barca': 'Viana do Castelo',
  'caminha': 'Viana do Castelo',
  'valença': 'Viana do Castelo',
  'paredes de coura': 'Viana do Castelo',
  'monção': 'Viana do Castelo',
  'melo': 'Viana do Castelo',

  // Vila Real
  'vila real': 'Vila Real',
  'chaves': 'Vila Real',
  'vila pouca de aguiar': 'Vila Real',
  'santa Marta de penaguião': 'Vila Real',
  'alijó': 'Vila Real',
  'sabrosa': 'Vila Real',
  'murça': 'Vila Real',
  'valpaços': 'Vila Real',
  'mesão frio': 'Vila Real',
  'montalegre': 'Vila Real',
  'boticas': 'Vila Real',
  'ribeira de pena': 'Vila Real',

  // Viseu
  viseu: 'Viseu',
  'lamego': 'Viseu',
  'tondela': 'Viseu',
  'mangualde': 'Viseu',
  'penalva do castelo': 'Viseu',
  'santa comba dão': 'Viseu',
  'são pedro do sul': 'Viseu',
  'castro daire': 'Viseu',
  'cinfães': 'Viseu',
  'moimenta da beira': 'Viseu',
  'sernancelhe': 'Viseu',
  'tarouca': 'Viseu',
  'armamar': 'Viseu',
  'tabuaço': 'Viseu',
  'resende': 'Viseu',
  'neias': 'Viseu',
  'carregal do sal': 'Viseu',
  'oliveira de frades': 'Viseu',
  'vouzeia': 'Viseu',

  // Açores (islands - cities)
  'ponta delgada': 'Açores',
  'angra do heroísmo': 'Açores',
  'horta': 'Açores',
  'ribeira grande': 'Açores',
  'lagoa (açores)': 'Açores',
  'vila franca do campo': 'Açores',
  'povoação': 'Açores',
  'nordeste': 'Açores',
  'praia da vitória': 'Açores',
  'calheta (açores)': 'Açores',
  'velas': 'Açores',
  'lajes do pico': 'Açores',
  'madalena': 'Açores',
  'são roque do pico': 'Açores',
  'lajes das flores': 'Açores',
  'santa cruz das flores': 'Açores',
  'vila do corvo': 'Açores',
  'vila do porto': 'Açores',
  'santa maria': 'Açores',

  // Madeira (islands - cities)
  'funchal': 'Madeira',
  'câmara de lobos': 'Madeira',
  'santa cruz': 'Madeira',
  'machico': 'Madeira',
  'ribeira brava': 'Madeira',
  'calheta (madeira)': 'Madeira',
  'são vicente': 'Madeira',
  'porto santo': 'Madeira',
  'porto moniz': 'Madeira',
  'santana': 'Madeira',
  'pontas de rocha': 'Madeira',
};

/**
 * Normalize a string by removing diacritics (accents, cedilha, etc.)
 * so "Braganca" matches "Bragança", "Heroismo" matches "Heroísmo", etc.
 */
function normalize(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Resolve a location string to a district.
 * Attempts to match city name against known mappings (with and without diacritics),
 * and falls back to checking if the location itself IS a district name.
 */
export function getDistrict(location: string): District | null {
  const key = location.toLowerCase().trim();
  const direct = CITY_TO_DISTRICT[key];
  if (direct) return direct;

  // Try matching after stripping diacritics
  const plain = normalize(key);
  for (const [mappedKey, district] of Object.entries(CITY_TO_DISTRICT)) {
    if (normalize(mappedKey) === plain) return district;
  }

  // Check if the location IS a district name
  const asDistrict = DISTRICTS.find(
    (d) => d.toLowerCase() === key || normalize(d.toLowerCase()) === plain
  );
  if (asDistrict) return asDistrict;

  return null;
}

/**
 * List of known award categories and their display names / icon keys.
 */
export const AWARD_CATEGORIES = [
  { key: 'Melhor Tuna', icon: 'trophy' },
  { key: 'Melhor Pandeireta', icon: 'tambourine' },
  { key: 'Melhor Estandarte', icon: 'flag' },
  { key: 'Melhor Instrumental', icon: 'guitar' },
  { key: 'Melhor Original', icon: 'vinyl' },
  { key: 'Melhor Solista', icon: 'microphone' },
  { key: 'Melhor Serenata', icon: 'moon' },
  { key: 'Tuna Mais Tuna', icon: 'beer' },
  { key: 'Outros Prémios', icon: 'grid' },
] as const;

export type AwardKey = (typeof AWARD_CATEGORIES)[number]['key'];

/**
 * Categorize a premio name into one of the known award categories.
 * Falls back to "Outros Prémios" if no match.
 */
export function categorizePremio(name: string): AwardKey {
  const lower = name.toLowerCase();

  if (lower.includes('2ª melhor tuna') || lower.includes('2a melhor tuna') || lower.includes('segunda melhor tuna')) return 'Outros Prémios';
  if (lower.includes('melhor tuna')) return 'Melhor Tuna';
  if (lower.includes('pandeireta') || lower.includes('pandeiret')) return 'Melhor Pandeireta';
  if (lower.includes('estandarte')) return 'Melhor Estandarte';
  if (lower.includes('instrumental')) return 'Melhor Instrumental';
  if (lower.includes('original') || lower.includes('melhor original')) return 'Melhor Original';
  if (lower.includes('solista')) return 'Melhor Solista';
  if (lower.includes('serenata')) return 'Melhor Serenata';
  if (lower.includes('tuna mais tuna') || lower.includes('tuna+') || lower.includes('+tuna')) return 'Tuna Mais Tuna';

  return 'Outros Prémios';
}
