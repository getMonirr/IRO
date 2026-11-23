export function Arabesque({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="100%" height="100%" aria-hidden="true">
      <defs>
        <pattern id="arabesque" width="80" height="80" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="20" y="20" width="40" height="40" />
            <rect x="20" y="20" width="40" height="40" transform="rotate(45 40 40)" />
            <circle cx="40" cy="40" r="9" />
            <path d="M0 0L20 20M80 0L60 20M0 80L20 60M80 80L60 60" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#arabesque)" />
    </svg>
  );
}

export function StarMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <g fill="none" stroke="#c9a24b" strokeWidth="2">
        <rect x="8" y="8" width="24" height="24" />
        <rect x="8" y="8" width="24" height="24" transform="rotate(45 20 20)" />
      </g>
      <circle cx="20" cy="20" r="4" fill="#c9a24b" />
    </svg>
  );
}
