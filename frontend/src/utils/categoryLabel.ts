import type { AwardKey } from './districts';

/** Short label used on the palmarés stamps and filter chip. */
export function categoryLabel(key: AwardKey): string {
  if (key === 'Outros Prémios') return 'Outros';
  return key.replace('Melhor ', '');
}
