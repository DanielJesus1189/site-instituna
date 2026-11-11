import type { CSSProperties, ReactNode } from 'react';
import { useInView } from '../../hooks/useInView';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  tilt?: number;
}

/** Fade + translate + slight rotation when the element scrolls into view. */
export function Reveal({ children, className = '', delay = 0, tilt = 0 }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const style = {
    '--reveal-delay': `${delay}ms`,
    '--reveal-tilt': `${tilt}deg`,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      className={`reveal ${inView ? 'is-visible' : ''} ${className}`.trim()}
      style={style}
    >
      {children}
    </div>
  );
}
