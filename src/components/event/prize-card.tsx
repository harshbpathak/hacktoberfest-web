import type { CSSProperties } from "react";
import { Medal, Sparkles, Trophy } from "lucide-react";
import { HexSticker, type StickerTone } from "@/components/event/hex-sticker";
import { cn } from "@/lib/utils";

interface PrizeCardProps {
  place: string;
  title: string;
  description: string;
  icon?: "trophy" | "medal" | "sparkles";
  /** gold = featured (filled) card; navy / red follow the reference category accents. */
  accent?: "gold" | "navy" | "red";
}

const icons = { trophy: Trophy, medal: Medal, sparkles: Sparkles };

const accents: Record<
  NonNullable<PrizeCardProps["accent"]>,
  { shadow: string; pill: string; sticker: StickerTone; card: string }
> = {
  gold: {
    shadow: "var(--gold-deep)",
    pill: "bg-paper text-ink",
    sticker: "red",
    card: "[--card-bg:var(--gold)]",
  },
  navy: { shadow: "var(--navy)", pill: "bg-sky-chip text-navy", sticker: "sky", card: "" },
  red: { shadow: "var(--red-deep)", pill: "bg-pink-chip text-maroon", sticker: "coral", card: "" },
};

// Reference: activity cards (sticker + category pill + condensed title; the sticker wiggles when the
// card is hovered) and the featured gold card from the mission timeline.
export function PrizeCard({
  place,
  title,
  description,
  icon = "trophy",
  accent = "red",
}: PrizeCardProps) {
  const a = accents[accent];
  return (
    <article
      className={cn("hf-card sticker-host flex h-full flex-col p-6 sm:p-7", a.card)}
      style={{ "--card-shadow": a.shadow } as CSSProperties}
    >
      <div className="flex items-start justify-between gap-4">
        <HexSticker icon={icons[icon]} tone={a.sticker} size={76} tilt={-3} />
        <span className={cn("hf-pill", a.pill)}>{place}</span>
      </div>
      <h3 className="mt-6 font-display text-[1.75rem] font-bold leading-[1.02] tracking-[-0.02em]">
        {title}
      </h3>
      <p
        className={cn(
          "mt-3 text-[0.95rem] leading-[1.55]",
          accent === "gold" ? "text-ink" : "text-body",
        )}
      >
        {description}
      </p>
    </article>
  );
}
