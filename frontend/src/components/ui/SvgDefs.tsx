/**
 * Shared SVG definitions mounted once at the app root.
 * Filters and clip paths are referenced by CSS via url(#id).
 */
export function SvgDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    >
      <defs>
        <filter id="ink-rough" x="-8%" y="-12%" width="116%" height="124%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.032"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="1.5"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        <filter id="ink-wobble" x="-8%" y="-12%" width="116%" height="124%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05"
            numOctaves="2"
            seed="19"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2.6"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        <clipPath id="arch-clip" clipPathUnits="objectBoundingBox">
          <path d="M0.5,0.01 C0.57,0.06 0.7,0.15 0.9,0.25 C0.97,0.28 1,0.31 1,0.37 L1,0.95 C1,0.98 0.98,1 0.95,1 L0.05,1 C0.02,1 0,0.98 0,0.95 L0,0.37 C0,0.31 0.03,0.28 0.1,0.25 C0.3,0.15 0.43,0.06 0.5,0.01 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}
