import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: ReactNode;
  /** Wrap the accent phrase in <em> — it renders upright in the accent colour (red on light, gold on dark). */
  title: ReactNode;
  description?: ReactNode;
  tone?: "light" | "dark";
  id?: string;
  className?: string;
}

// Reference layout: mono kicker + big two-tone heading on the left, short intro aligned to the
// bottom on the right (stacks on mobile).
export function SectionHeading({
  eyebrow,
  title,
  description,
  tone = "light",
  id,
  className,
}: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <div
      className={cn(
        "grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-end md:gap-10",
        className,
      )}
      style={{ "--accent-phrase": dark ? "var(--gold)" : "var(--red)" } as CSSProperties}
    >
      <div>
        <p className={cn("kicker", dark ? "text-sky-light" : "text-ink")}>{eyebrow}</p>
        <h2
          id={id}
          className={cn("hf-heading mt-[13px] max-w-[22ch]", dark ? "text-paper" : "text-ink")}
        >
          {title}
        </h2>
      </div>
      {description ? (
        <p
          className={cn(
            "max-w-[48ch] text-[1.05rem] leading-[1.55]",
            dark ? "text-paper/90" : "text-body",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
