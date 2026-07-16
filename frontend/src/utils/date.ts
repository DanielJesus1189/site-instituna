export function formatDatePT(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function yearOf(iso: string): number {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return 0;
  return date.getFullYear();
}
