import { useId, type CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Our own hexagon "sticker" in the hacktoberfest.com style: paper rim, coloured face, white glyph
// with an ink outline, optional dark ledge with dots. Not a copy of any official sticker artwork.
// TODO(brand-kit): swap for official Hacktoberfest 2026 stickers once the Fest is confirmed and
// the brand kit permits it.

export type StickerTone =
  "coral" | "sky" | "gold" | "red" | "maroon" | "forest" | "navy" | "sunset";

const faces: Record<Exclude<StickerTone, "sunset">, string> = {
  coral: "var(--coral)",
  sky: "var(--sky)",
  gold: "var(--gold)",
  red: "var(--red)",
  maroon: "var(--maroon)",
  forest: "var(--forest)",
  navy: "var(--navy)",
};

const OUTER = "50,2 93,26.5 93,73.5 50,98 7,73.5 7,26.5";
const INNER = "50,8.5 87.5,30 87.5,70 50,91.5 12.5,70 12.5,30";
// Slanted ledge, rising to the right like the reference stickers
const LEDGE = "12.5,67 87.5,57 87.5,70 50,91.5 12.5,70";

interface HexStickerProps {
  icon: LucideIcon;
  tone?: StickerTone | undefined;
  /** Number of dots on a dark ledge (0 = no ledge). */
  dots?: 0 | 1 | 2 | 3 | undefined;
  size?: number | string | undefined;
  tilt?: number | undefined;
  className?: string | undefined;
  style?: CSSProperties | undefined;
}

export function HexSticker({
  icon: Icon,
  tone = "coral",
  dots = 0,
  size = 96,
  tilt = 0,
  className,
  style,
}: HexStickerProps) {
  const id = `hex${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const face = tone === "sunset" ? `url(#${id}-g)` : faces[tone];

  return (
    <span
      aria-hidden="true"
      className={cn("hex-sticker", className)}
      style={{ width: size, "--tilt": `${tilt}deg`, ...style } as CSSProperties}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible">
        {tone === "sunset" ? (
          <defs>
            <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="var(--gold)" />
              <stop offset="1" stopColor="var(--red)" />
            </linearGradient>
          </defs>
        ) : null}
        <polygon
          points={OUTER}
          fill="var(--paper)"
          stroke="var(--ink)"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <polygon
          points={INNER}
          fill={face}
          stroke="var(--ink)"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        {dots ? (
          <>
            <polygon points={LEDGE} fill="var(--ink)" />
            {Array.from({ length: dots }, (_, i) => (
              <circle
                key={i}
                cx={52 + (i - (dots - 1) / 2) * 6.5}
                cy="73"
                r="2.2"
                fill="var(--paper)"
              />
            ))}
          </>
        ) : null}
      </svg>
      <Icon
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ top: dots ? "41%" : "50%", width: "46%", height: "46%" }}
        fill="var(--paper)"
        stroke="var(--ink)"
        strokeWidth={2.75}
      />
    </span>
  );
}
