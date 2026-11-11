import type { ReactNode } from 'react';

interface ArchFrameProps {
  children: ReactNode;
  className?: string;
}

/** Pointed Moorish arch mask with a rough ink outline. */
export function ArchFrame({ children, className = '' }: ArchFrameProps) {
  return (
    <div className={`arch-frame ${className}`.trim()}>
      <div className="arch-frame__content">{children}</div>
      <svg
        className="arch-frame__outline"
        viewBox="0 0 100 140"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M50 1 C57 8 70 20 90 34 C97 39 100 43 100 52 L100 133 C100 137 97 140 93 140 L7 140 C3 140 0 137 0 133 L0 52 C0 43 3 39 10 34 C30 20 43 8 50 1 Z" />
      </svg>
    </div>
  );
}
