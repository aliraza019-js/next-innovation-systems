/** Lockup: mark + wordmark for dark backgrounds (no icon tile). */
export function NisLogoDark({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 288 44"
      fill="none"
      className={className}
      aria-hidden
    >
      <g
        transform="translate(16,22) scale(0.107) translate(-150,-140)"
        fill="#0A5F44"
      >
        <circle cx="70" cy="70" r="45" />
        <rect
          x="150"
          y="40"
          width="70"
          height="190"
          rx="35"
          ry="35"
          transform="rotate(25 185 135)"
        />
      </g>
      <text
        x="48"
        y="17"
        fill="#f8fafc"
        style={{
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          fontSize: 15,
          fontWeight: 600,
        }}
      >
        Next Innovation
      </text>
      <text
        x="48"
        y="33"
        fill="#94a3b8"
        style={{
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          fontSize: 9,
          letterSpacing: "0.18em",
        }}
      >
        SYSTEMS
      </text>
    </svg>
  );
}
