import { cn } from "@/lib/utils";

// Blocky decorations in the hacktoberfest.com 2026 visual language (stepped squares, two-tone
// bars, a four-colour strip). Drawn from scratch — not the official key art.
// TODO(brand-kit): replace with official Hacktoberfest 2026 pattern assets if the brand kit allows.

export function PixelStair({ className }: { className?: string }) {
  const bars = [0, 24, 48, 72];
  const steps = [
    [132, 0],
    [108, 24],
    [84, 48],
    [60, 72],
    [36, 96],
    [12, 120],
  ];
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 160 148"
      shapeRendering="crispEdges"
      className={cn("pointer-events-none", className)}
    >
      {bars.map((x) => (
        <rect key={x} x={x} y="0" width="12" height="48" fill="var(--red)" />
      ))}
      {[12, 36].map((x) => (
        <rect key={x} x={x} y="48" width="12" height="48" fill="var(--red)" />
      ))}
      {steps.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="24" height="24" fill="var(--paper)" />
      ))}
    </svg>
  );
}

export function PixelBars({ className }: { className?: string }) {
  // Pairs of red + coral bars; top row is shorter and stepped in.
  const top = [36, 78, 122];
  const bottom = [12, 148, 190, 232];
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 260 104"
      shapeRendering="crispEdges"
      className={cn("pointer-events-none", className)}
    >
      {top.map((x) => (
        <g key={x}>
          <rect x={x} y="0" width="12" height="48" fill="var(--red)" />
          <rect x={x + 12} y="0" width="12" height="48" fill="var(--coral)" />
        </g>
      ))}
      {bottom.map((x) => (
        <g key={x}>
          <rect x={x} y="48" width="12" height="56" fill="var(--red)" />
          <rect x={x + 12} y="48" width="12" height="56" fill="var(--coral)" />
        </g>
      ))}
    </svg>
  );
}

export function ColorStrip({ className }: { className?: string }) {
  const colors = ["var(--red)", "var(--sky)", "var(--gold)", "var(--coral)"];
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 56 14"
      shapeRendering="crispEdges"
      className={cn("h-3.5 w-14", className)}
    >
      {colors.map((c, i) => (
        <rect key={c} x={i * 14} y="0" width="14" height="14" fill={c} />
      ))}
    </svg>
  );
}
