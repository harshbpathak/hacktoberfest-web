import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

// Split-flap countdown to the official MLH event hours (10:00 AM – 7:30 PM IST). Each digit is a
// flap: the old top half folds down (0.3s ease-in), then the new bottom half falls into place
// (0.3s ease-out). Cards follow the site's hard-shadow style; reduced motion swaps digits instantly.
const START = Date.UTC(2026, 9, 10, 4, 30); // Sat 10 Oct 2026, 10:00 IST
const END = Date.UTC(2026, 9, 10, 14, 0); // Sat 10 Oct 2026, 19:30 IST

function units(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return [
    { label: "Days", value: Math.floor(total / 86400) },
    { label: "Hours", value: Math.floor((total % 86400) / 3600) },
    { label: "Minutes", value: Math.floor((total % 3600) / 60) },
    { label: "Seconds", value: total % 60 },
  ];
}

function stateAt(now: number | null) {
  return now === null || now < START ? "soon" : now < END ? "live" : "done";
}

function FlipDigit({ digit, animate }: { digit: string; animate: boolean }) {
  // Derived state: remember the digit we're flipping away from.
  const [flip, setFlip] = useState({ prev: digit, cur: digit, n: 0 });
  if (flip.cur !== digit) setFlip({ prev: flip.cur, cur: digit, n: flip.n + 1 });
  const flipping = animate && flip.n > 0;

  return (
    <span className="flip" aria-hidden="true">
      <span className="flip-half flip-top">
        <span>{digit}</span>
      </span>
      <span className="flip-half flip-bottom">
        <span>{flipping ? flip.prev : digit}</span>
      </span>
      {flipping ? (
        <>
          <span key={`t${flip.n}`} className="flip-half flip-top flip-leaf-top">
            <span>{flip.prev}</span>
          </span>
          <span key={`b${flip.n}`} className="flip-half flip-bottom flip-leaf-bottom">
            <span>{digit}</span>
          </span>
        </>
      ) : null}
    </span>
  );
}

function Colon() {
  return (
    <span aria-hidden="true" className="flex flex-col gap-[0.22em] self-center pb-[1.1rem]">
      <span className="size-[0.13em] bg-ink" />
      <span className="size-[0.13em] bg-ink" />
    </span>
  );
}

function Clock({ now, reducedMotion }: { now: number | null; reducedMotion: boolean }) {
  const state = stateAt(now);
  const all = now === null ? null : units((state === "live" ? END : START) - now);
  const shown = all && state === "live" ? all.slice(1) : all;
  const spoken = shown
    ? shown
        .slice(0, -1)
        .map((u) => `${u.value} ${u.label.toLowerCase()}`)
        .join(", ")
    : "";

  return (
    <div>
      <p className="sr-only" role="timer">
        {state === "live" ? `Hack Day is live. Ends in ${spoken}.` : `Doors open in ${spoken}.`}
      </p>
      <div className="flex items-start gap-[0.14em] text-[clamp(2.4rem,6.2vw,4.75rem)] sm:gap-[0.2em]">
        {(shown ?? units(0).map((u) => ({ ...u, value: -1 }))).map((u, i) => {
          const text = u.value < 0 ? "––" : String(u.value).padStart(2, "0");
          return (
            <div key={u.label} className="contents">
              {i > 0 ? <Colon /> : null}
              <div className="flex flex-col items-center">
                <div className="flex gap-[0.06em] border-2 border-ink bg-paper p-[0.08em] shadow-[5px_5px_0_var(--maroon)]">
                  {[...text].map((d, j) => (
                    <FlipDigit key={j} digit={d} animate={!reducedMotion} />
                  ))}
                </div>
                <span className="kicker mt-3 text-[0.62rem] sm:text-[0.72rem]">{u.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const headings = {
  soon: { kicker: "Countdown · Sat 10 Oct, 10:00 AM IST", plain: "Doors open", accent: "soon." },
  live: { kicker: "Live now · until 7:30 PM IST", plain: "We’re live.", accent: "Go build." },
  done: { kicker: "Sat 10 Oct · NIT Hamirpur", plain: "That’s a", accent: "wrap." },
};

export function CountdownSection() {
  const reducedMotion = Boolean(useReducedMotion());
  // Time is only read on the client so the server render and hydration match.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const state = stateAt(now);
  const heading = headings[state];

  return (
    <section aria-labelledby="countdown-title" className="border-b border-ink bg-cream">
      <div className="shell grid items-center gap-10 py-[clamp(3.5rem,6vw,5.5rem)] lg:grid-cols-[minmax(0,0.8fr)_auto] lg:gap-16">
        <div>
          <p className="kicker text-ink">{heading.kicker}</p>
          <h2 id="countdown-title" className="hf-heading mt-[13px] max-w-[12ch]">
            {heading.plain} <em>{heading.accent}</em>
          </h2>
        </div>
        {state === "done" ? (
          <p className="max-w-[32ch] text-[1.15rem] text-body">
            Thanks for hacking with us. See you at the next one!
          </p>
        ) : (
          <Clock now={now} reducedMotion={reducedMotion} />
        )}
      </div>
    </section>
  );
}
