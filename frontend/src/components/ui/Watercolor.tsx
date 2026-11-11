import { memo } from 'react';

type WatercolorTone = 'green' | 'ochre' | 'blue';

interface WatercolorProps {
  tone: WatercolorTone;
  className?: string;
}

/** Soft watercolour wash. Decorative only. */
export const Watercolor = memo(function Watercolor({ tone, className = '' }: WatercolorProps) {
  return (
    <span
      aria-hidden="true"
      className={`watercolor watercolor--${tone} ${className}`.trim()}
    />
  );
});
