interface PremioTagProps {
  label: string;
  variant?: 'awarded' | 'empty';
}

export function PremioTag({ label, variant = 'awarded' }: PremioTagProps) {
  if (variant === 'empty') {
    return <li className="premio-empty text-xs">{label}</li>;
  }

  return (
    <li className="premio-tag">
      <span className="premio-dash" aria-hidden="true" />
      <span>{label}</span>
    </li>
  );
}
