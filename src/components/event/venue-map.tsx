import { useReducedMotion } from "framer-motion";
import { useEffect, useId, useMemo, useRef, useState, type PointerEvent } from "react";
import { cellAt, INDIA_ROWS } from "@/components/event/india-grid";

// Pixel map in the style of the hacktoberfest.com hero "FestMap": land as 8px squares on a 10px
// pitch and a cursor spotlight, with a single glowing cell for NIT Hamirpur. The gold ping replays
// on the reference's 2.65s label rhythm; label and ring animations are measured from the reference.

const PITCH = 10;
const COLS = INDIA_ROWS[0]?.length ?? 0;
const ROWS = INDIA_ROWS.length;
const VB_W = COLS * PITCH;
const VB_H = ROWS * PITCH;
const PING_EVERY_MS = 2650;

const VENUE = cellAt(31.7084, 76.5273);
const VENUE_CX = VENUE.x * PITCH + 4;
const VENUE_CY = VENUE.y * PITCH + 4;

const landPath = () => {
  let d = "";
  INDIA_ROWS.forEach((row, y) => {
    for (let x = 0; x < row.length; x++)
      if (row[x] !== ".") d += `M${x * PITCH} ${y * PITCH}h8v8h-8z`;
  });
  return d;
};

export function VenueMap() {
  const id = `pmap${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const reducedMotion = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [inView, setInView] = useState(false);
  const [seen, setSeen] = useState(false);
  const [ping, setPing] = useState(0);
  const [spot, setSpot] = useState<{ x: number; y: number } | null>(null);
  const [onVenue, setOnVenue] = useState(false);

  const land = useMemo(landPath, []);

  // The venue "arrives" when the map first scrolls into view.
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        setInView(visible);
        if (visible) setSeen(true);
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion || !inView) return;
    const timer = window.setInterval(() => setPing((n) => n + 1), PING_EVERY_MS);
    return () => window.clearInterval(timer);
  }, [reducedMotion, inView]);

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((event.clientX - rect.left) / rect.width) * VB_W;
    const y = ((event.clientY - rect.top) / rect.height) * VB_H;
    setSpot({ x, y });
    setOnVenue(Math.floor(x / PITCH) === VENUE.x && Math.floor(y / PITCH) === VENUE.y);
  };

  const onPointerLeave = () => {
    setSpot(null);
    setOnVenue(false);
  };

  return (
    <figure className="m-0">
      <div
        ref={frameRef}
        className="relative [container-type:inline-size]"
        role="img"
        aria-label="Pixel map of India with a glowing gold square marking NIT Hamirpur, Himachal Pradesh, the venue."
      >
        <svg
          ref={svgRef}
          viewBox={`-2 -2 ${VB_W + 4} ${VB_H + 4}`}
          className="block h-auto w-full overflow-visible"
          aria-hidden="true"
          focusable="false"
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          style={{ cursor: onVenue ? "pointer" : undefined }}
        >
          <defs>
            <radialGradient id={`${id}-glow`}>
              <stop offset="0" stopColor="#fff" stopOpacity="1" />
              <stop offset="0.55" stopColor="#fff" stopOpacity="0.45" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`${id}-halo`}>
              <stop offset="0" stopColor="var(--gold)" stopOpacity="0.95" />
              <stop offset="0.4" stopColor="var(--gold)" stopOpacity="0.4" />
              <stop offset="1" stopColor="var(--gold)" stopOpacity="0" />
            </radialGradient>
            {/* Spotlight follows the cursor; at rest it sits on campus so NIT Hamirpur glows */}
            <mask id={`${id}-spot`}>
              <circle
                cx={spot?.x ?? VENUE_CX}
                cy={spot?.y ?? VENUE_CY}
                r={spot ? 110 : 60}
                fill={`url(#${id}-glow)`}
              />
            </mask>
          </defs>
          <path className="pmap-land" d={land} />
          <path
            className="pmap-lit"
            data-on={spot || seen ? "true" : "false"}
            d={land}
            mask={`url(#${id}-spot)`}
          />
          {seen ? (
            <>
              <circle
                className="pmap-halo"
                cx={VENUE_CX}
                cy={VENUE_CY}
                r="40"
                fill={`url(#${id}-halo)`}
              />
              <rect
                className="pmap-cell"
                data-tone="many"
                x={VENUE.x * PITCH - 1}
                y={VENUE.y * PITCH - 1}
                width="10"
                height="10"
              />
              {onVenue ? (
                <rect
                  className="pmap-ring"
                  x={VENUE.x * PITCH - 3}
                  y={VENUE.y * PITCH - 3}
                  width="14"
                  height="14"
                />
              ) : null}
              {!reducedMotion ? (
                <rect
                  key={`ping-${ping}`}
                  className="pmap-ping"
                  x={VENUE.x * PITCH - 1}
                  y={VENUE.y * PITCH - 1}
                  width="10"
                  height="10"
                />
              ) : null}
            </>
          ) : null}
        </svg>
        {seen ? (
          <div
            className="pmap-label"
            data-side="right"
            data-phase={reducedMotion ? "still" : "in"}
            style={{
              left: `${((VENUE.x * PITCH + PITCH + 5) / VB_W) * 100}%`,
              top: `${((VENUE.y * PITCH + 4) / VB_H) * 100}%`,
            }}
            aria-hidden="true"
          >
            NIT Hamirpur
            <span className="pmap-label-count">10 Oct</span>
          </div>
        ) : null}
      </div>
    </figure>
  );
}
