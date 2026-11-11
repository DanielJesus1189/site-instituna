import { useInView } from '../../hooks/useInView';

interface BrushStripesProps {
  className?: string;
  loading?: boolean;
}

/** Three irregular vertical brush strokes (green, ochre, blue). */
export function BrushStripes({ className = '', loading = false }: BrushStripesProps) {
  const { ref, inView } = useInView<SVGSVGElement>();

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 120 40"
      preserveAspectRatio="none"
      className={[
        'brush-stripes',
        inView ? 'is-visible' : '',
        loading ? 'brush-stripes--loading' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <path d="M18 4 C13 12 21 25 15 36" stroke="var(--green)" strokeWidth="7" />
      <path d="M60 3 C65 12 57 26 63 37" stroke="var(--ochre)" strokeWidth="8" />
      <path d="M102 5 C97 14 105 27 99 36" stroke="var(--blue)" strokeWidth="7" />
    </svg>
  );
}
