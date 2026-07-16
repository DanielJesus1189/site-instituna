interface PremioTagProps {
  label: string;
  variant?: 'awarded' | 'empty';
}

export function PremioTag({ label, variant = 'awarded' }: PremioTagProps) {
  if (variant === 'empty') {
    return (
      <span className="inline-flex w-full items-center justify-center rounded-md bg-amber-100 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-amber-700">
        {label}
      </span>
    );
  }

  return (
    <span className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm shadow-blue-900/10 transition-colors hover:bg-blue-700">
      {label}
    </span>
  );
}
