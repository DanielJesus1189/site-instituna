interface BrandProps {
  className?: string;
  compact?: boolean;
}

/** Crest + wordmark used in the header, login page and footer. */
export function Brand({ className = '', compact = false }: BrandProps) {
  return (
    <div className={`brand ${className}`.trim()}>
      <img
        src="/logo-instituna.png"
        alt="Brasão da Instituna"
        width={56}
        height={56}
        className="brand-crest"
        decoding="async"
      />
      <div>
        <p className="brand-name">INSTITUNA</p>
        {!compact ? <p className="brand-subtitle">Arquivo de festivais de tunas</p> : null}
      </div>
    </div>
  );
}
