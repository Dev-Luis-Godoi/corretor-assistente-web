interface BrandLogoProps {
  compact?: boolean;
  inverse?: boolean;
  className?: string;
}

export function BrandLogo({
  compact = false,
  inverse = false,
  className = "",
}: BrandLogoProps) {
  return (
    <div
      className={`brand-logo ${compact ? "brand-logo-compact" : ""} ${inverse ? "brand-logo-inverse" : ""} ${className}`.trim()}
      aria-label="Chavora Flow"
    >
      <svg className="brand-logo-symbol" viewBox="0 0 64 64" aria-hidden="true">
        <path
          className="brand-logo-navy"
          d="M45.7 13.8A22.5 22.5 0 1 0 45.7 50.2"
          fill="none"
          strokeWidth="8"
          strokeLinecap="square"
        />
        <circle
          className="brand-logo-navy"
          cx="27"
          cy="31.5"
          r="5.6"
          fill="none"
          strokeWidth="5"
        />
        <path
          className="brand-logo-navy"
          d="M32.6 31.5H49M42.3 31.5v5M48 31.5v5"
          fill="none"
          strokeWidth="5"
          strokeLinecap="square"
        />
        <path
          className="brand-logo-blue"
          d="M10.5 43.5c7.8 5.5 13.6 5 19.6-1.5 3.1-3.4 6.7-5 11.6-5H52"
          fill="none"
          strokeWidth="6"
          strokeLinecap="square"
        />
      </svg>
      {!compact && (
        <span className="brand-logo-wordmark">
          <strong>Chavora</strong>
          <em>Flow</em>
        </span>
      )}
    </div>
  );
}
