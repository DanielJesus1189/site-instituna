import type { ReactNode } from 'react';

interface FieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Presentational field shell. The actual input keeps all of its original
 * attributes, state and handlers; this only supplies label/layout styling.
 */
export function Field({ label, htmlFor, hint, children, className = '' }: FieldProps) {
  const labelClass = 'field-label';

  return (
    <div className={`field ${className}`.trim()}>
      {htmlFor ? (
        <label className={labelClass} htmlFor={htmlFor}>
          {label}
        </label>
      ) : (
        <span className={labelClass}>{label}</span>
      )}
      {children}
      {hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  );
}
