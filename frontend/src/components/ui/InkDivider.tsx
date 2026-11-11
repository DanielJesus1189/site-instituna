interface InkDividerProps {
  className?: string;
}

/** Irregular ink line used instead of straight hairlines. */
export function InkDivider({ className = '' }: InkDividerProps) {
  return (
    <svg
      className={`ink-divider ${className}`.trim()}
      viewBox="0 0 600 12"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M2 7 C 58 2 112 11 176 6 S 292 2 356 8 S 482 11 598 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
