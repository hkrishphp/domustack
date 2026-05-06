type Props = {
  className?: string;
  showTagline?: boolean;
  primary?: string;
  accent?: string;
  surface?: string;
};

export default function LogoV1({
  className,
  showTagline = true,
  primary = "#0f2940",
  accent = "#6b8e6b",
  surface = "#ffffff",
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={showTagline ? "0 0 420 96" : "0 0 420 86"}
      fill="none"
      role="img"
      aria-label="Domustack — Home Renovation"
      className={className}
    >
      <g transform="translate(8 12)">
        <rect width="72" height="72" rx="16" fill={primary} />

        <path
          d="M14 30 L36 16 L58 30"
          stroke={accent}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <rect
          x="18"
          y="30"
          width="36"
          height="28"
          rx="2"
          stroke={surface}
          strokeWidth="2"
        />

        <rect
          x="22"
          y="34"
          width="8"
          height="8"
          rx="0.5"
          stroke={surface}
          strokeWidth="1.4"
        />

        <rect
          x="32"
          y="46"
          width="9"
          height="12"
          rx="0.6"
          fill={surface}
        />
        <circle cx="39.5" cy="52.5" r="0.9" fill={primary} />

        <rect
          x="44"
          y="34"
          width="8"
          height="8"
          rx="0.5"
          stroke={surface}
          strokeWidth="1.4"
        />

        <line
          x1="14"
          y1="62"
          x2="58"
          y2="62"
          stroke={accent}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      <text
        x="100"
        y="52"
        fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif"
        fontSize="40"
        fontWeight="800"
        fill={primary}
        letterSpacing="-1.6"
      >
        Domustack
      </text>

      {showTagline && (
        <text
          x="102"
          y="76"
          fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif"
          fontSize="11"
          fontWeight="600"
          fill={accent}
          letterSpacing="3"
        >
          HOME RENOVATION, DONE RIGHT
        </text>
      )}
    </svg>
  );
}
