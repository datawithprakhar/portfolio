/**
 * Small inline flags. Flags are national emblems, not proprietary marks, so
 * they're hand-drawn here rather than sourced as image assets — no network
 * fetch needed, and nothing to license.
 */

function IndiaFlag({ size, className }) {
  const h = size;
  const w = size * 1.5;
  return (
    <svg
      className={className}
      width={w}
      height={h}
      viewBox="0 0 30 20"
      role="img"
      aria-label="Flag of India"
    >
      <rect width="30" height="20" fill="#0d0f14" opacity="0" />
      <rect width="30" height="6.67" y="0" fill="#FF9933" />
      <rect width="30" height="6.67" y="6.67" fill="#FFFFFF" />
      <rect width="30" height="6.67" y="13.33" fill="#138808" />
      <circle cx="15" cy="10" r="2.3" fill="none" stroke="#000088" strokeWidth="0.3" />
      <circle cx="15" cy="10" r="0.4" fill="#000088" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / 12;
        const x2 = 15 + 2.3 * Math.cos(angle);
        const y2 = 10 + 2.3 * Math.sin(angle);
        return (
          <line key={i} x1="15" y1="10" x2={x2} y2={y2} stroke="#000088" strokeWidth="0.22" />
        );
      })}
    </svg>
  );
}

function SouthAfricaFlag({ size, className }) {
  const h = size;
  const w = size * 1.5;
  return (
    <svg
      className={className}
      width={w}
      height={h}
      viewBox="0 0 900 600"
      role="img"
      aria-label="Flag of South Africa"
    >
      <rect width="900" height="300" fill="#DE3831" />
      <rect y="300" width="900" height="300" fill="#002395" />
      {/* Pall (the Y-band): white border then green fill, drawn as one
          two-armed stroke so the whole shape reads correctly at tiny sizes. */}
      <path
        d="M0,0 L300,300 L900,300 M0,600 L300,300"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="180"
        strokeLinejoin="round"
      />
      <path
        d="M0,0 L300,300 L900,300 M0,600 L300,300"
        fill="none"
        stroke="#007A4D"
        strokeWidth="108"
        strokeLinejoin="round"
      />
      {/* Hoist triangle: gold edge, black fill on top. */}
      <polygon points="0,0 0,600 340,300" fill="#FFB612" />
      <polygon points="0,0 0,600 300,300" fill="#000000" />
    </svg>
  );
}

const FLAGS = {
  IN: IndiaFlag,
  ZA: SouthAfricaFlag,
};

export default function Flag({ code, size = 13, className = "" }) {
  const Component = FLAGS[code];
  if (!Component) return null;
  return <Component size={size} className={className} />;
}
