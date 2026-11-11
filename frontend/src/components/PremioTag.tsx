interface PremioTagProps {
  label: string;
  variant?: 'awarded' | 'empty';
}

export function PremioTag({ label, variant = 'awarded' }: PremioTagProps) {
  if (variant === 'empty') {
    return <li className="text-xs italic text-ink-soft">{label}</li>;
  }

  return (
    <li className="flex items-baseline gap-2 text-[13px] leading-snug text-ink">
      <span className="mt-1.5 h-px w-3 shrink-0 bg-gold" aria-hidden />
      <span>{label}</span>
    </li>
  );
}
