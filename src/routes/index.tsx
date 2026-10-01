import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Code2,
  Flag,
  Gift,
  GitBranch,
  Github,
  Instagram,
  Heart,
  HeartHandshake,
  Linkedin,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  MessageCircle,
  MessagesSquare,
  Mic,
  Presentation,
  Rocket,
  Sparkle,
  Sparkles,
  Terminal,
  Ticket,
  Trophy,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HexSticker, type StickerTone } from "@/components/event/hex-sticker";
import { CountdownSection } from "@/components/event/flip-countdown";
import { ColorStrip, PixelBars, PixelStair } from "@/components/event/pixel-art";
import { PrizeCard } from "@/components/event/prize-card";
import { SectionHeading } from "@/components/event/section-heading";
import { VenueMap } from "@/components/event/venue-map";
import { cn } from "@/lib/utils";

// Public MLH event page with "Log In & Register" (the organize.mlh.com link is the organiser
// dashboard and asks students to sign in as an organiser).
const REGISTER_URL =
  "https://events.mlh.com/events/15111-hacktoberfest-hack-day-hamirpur-x-gdg-ludhiana";
// TODO: replace with the community invite link (WhatsApp group / Discord).
const COMMUNITY_URL = "#contact";
const SOCIALS = {
  github: "https://github.com/GDSC-NITH",
  linkedin: "https://www.linkedin.com/company/dsc-nit-hamirpur/",
  instagram: "https://www.instagram.com/nith_gdgl/",
};
const WHATSAPP_URL = "https://wa.me/qr/3SSYXRFDEDARK1";
const EMAIL = "gdg@nith.ac.in";
const CODE_OF_CONDUCT_URL = "https://www.mlh.com/code-of-conduct";
const DIRECTIONS_URL =
  "https://www.google.com/maps/search/?api=1&query=NIT+Hamirpur+Himachal+Pradesh";
// TODO(mlh-badge): flip to true when the official MLH Member Event badge embed is pasted into
// #mlh-badge-slot below — the header then leaves room for it on the top right.
const MLH_BADGE_ENABLED = false;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hacktoberfest Hack Day Hamirpur 2026" },
      {
        name: "description",
        content:
          "Build the future with open source and open-weight AI. A one-day hack day on Saturday, October 10, 2026 at the Mini Auditorium, New Lecture Hall, NIT Hamirpur.",
      },
      { property: "og:title", content: "Hacktoberfest Hack Day Hamirpur 2026" },
      {
        property: "og:description",
        content: "A high-energy, one-day open source and AI mini hackathon at NIT Hamirpur.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HackDayPage,
});

const navItems = [
  { id: "about", label: "About" },
  { id: "perks", label: "Perks" },
  { id: "prizes", label: "Prizes" },
  { id: "schedule", label: "Schedule" },
  { id: "sponsors", label: "Sponsors" },
  { id: "faq", label: "FAQ" },
];

const external = (href: string) =>
  href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {};

const heroStickers: Array<{
  icon: LucideIcon;
  tone: StickerTone;
  x: number;
  y: number;
  s: number;
  tilt: number;
  dots?: 0 | 1 | 2 | 3;
}> = [
  { icon: Code2, tone: "gold", x: 3, y: 22, s: 25, tilt: -8, dots: 1 },
  { icon: Zap, tone: "red", x: 22, y: 5, s: 30, tilt: 6, dots: 2 },
  { icon: Terminal, tone: "red", x: 50, y: 0, s: 24, tilt: 9 },
  { icon: Sparkles, tone: "sky", x: 70, y: 9, s: 29, tilt: -6, dots: 3 },
  { icon: Heart, tone: "maroon", x: 35, y: 29, s: 34, tilt: 0 },
  { icon: Rocket, tone: "sky", x: 66, y: 40, s: 32, tilt: 7 },
  { icon: GitBranch, tone: "sunset", x: 14, y: 45, s: 30, tilt: -4 },
  { icon: Flag, tone: "red", x: 0, y: 63, s: 20, tilt: -10 },
  { icon: Trophy, tone: "gold", x: 44, y: 64, s: 24, tilt: 10, dots: 1 },
  { icon: Mic, tone: "maroon", x: 66, y: 75, s: 18, tilt: -6 },
];

const steps: Array<{
  title: string;
  text: string;
  stickers: Array<{ icon: LucideIcon; tone: StickerTone; dots?: 0 | 1 | 2 | 3 }>;
}> = [
  {
    title: "Register and show up",
    text: "Grab your spot, then check in at the Mini Auditorium on October 10. Come with an idea or simply your curiosity.",
    stickers: [
      { icon: Ticket, tone: "forest" },
      { icon: MapPin, tone: "coral" },
    ],
  },
  {
    title: "Build with mentors",
    text: "Team up and build with open source and open-weight AI like Gemma, with mentors on hand all day.",
    stickers: [
      { icon: Code2, tone: "gold", dots: 1 },
      { icon: Sparkles, tone: "sky" },
      { icon: MessagesSquare, tone: "red" },
      { icon: GitBranch, tone: "coral", dots: 2 },
    ],
  },
  {
    title: "Ship, demo, win",
    text: "Push your project to a public GitHub repository, give a 5-minute live demo, and compete for the prize pool.",
    stickers: [
      { icon: Presentation, tone: "sunset" },
      { icon: Trophy, tone: "gold", dots: 3 },
    ],
  },
];

const perks = [
  {
    icon: Gift,
    pill: "Swag",
    title: "Prizes, swag & goodies",
    text: "Inclusive tracks, exclusive goodies, and awesome swag from MLH.",
  },
  {
    icon: Mic,
    pill: "Talks",
    title: "Community & tech talks",
    text: "Interactive workshops and expert-led talks on open source and modern AI tools.",
  },
  {
    icon: MessagesSquare,
    pill: "Mentors",
    title: "Hands-on mentorship",
    text: "Work with mentors to publish a working GitHub repository in just one day.",
  },
];

type SessionType =
  "Check-in" | "Stage" | "Workshop" | "Hacking" | "Break" | "Deadline" | "Demos" | "Awards";

const sessionStyle: Record<SessionType, { pill: string; shadow: string }> = {
  "Check-in": { pill: "bg-stone text-ink", shadow: "var(--ink)" },
  Break: { pill: "bg-stone text-ink", shadow: "var(--ink)" },
  Stage: { pill: "bg-sky-chip text-navy", shadow: "var(--navy)" },
  Workshop: { pill: "bg-sky-chip text-navy", shadow: "var(--navy)" },
  Hacking: { pill: "bg-pink-chip text-maroon", shadow: "var(--maroon)" },
  Deadline: { pill: "bg-pink-chip text-maroon", shadow: "var(--maroon)" },
  Demos: { pill: "bg-gold-chip text-gold-deep", shadow: "var(--gold-deep)" },
  Awards: { pill: "bg-gold-chip text-gold-deep", shadow: "var(--gold-deep)" },
};

const schedule: Array<{ start: string; end: string; title: string; type: SessionType }> = [
  { start: "10:00", end: "10:45", title: "Check-in & team formation", type: "Check-in" },
  { start: "10:45", end: "11:15", title: "Opening ceremony", type: "Stage" },
  {
    start: "11:15",
    end: "12:00",
    title: "Workshop: building with Gemma & open-weight models",
    type: "Workshop",
  },
  { start: "12:00", end: "13:30", title: "Hacking begins: all code starts today", type: "Hacking" },
  { start: "13:30", end: "14:15", title: "Lunch break", type: "Break" },
  { start: "14:15", end: "16:30", title: "Hacking & mentor rounds", type: "Hacking" },
  {
    start: "16:30",
    end: "17:00",
    title: "Submissions close: push your public repo",
    type: "Deadline",
  },
  { start: "17:00", end: "18:45", title: "Project demos: 5 minutes per team", type: "Demos" },
  { start: "18:45", end: "19:30", title: "Awards & closing", type: "Awards" },
];

const faqs: Array<{ q: string; a: ReactNode }> = [
  {
    q: "I’ve never contributed to open source. Can I still come?",
    a: "Yes. The event is open to university students, and freshers, first-year students, and complete beginners are very welcome. No prior open-source or AI experience needed.",
  },
  {
    q: "What will I build?",
    a: "Anything you like, built in the open. This year’s theme is open source and open-weight AI, including Gemma models, and mentors will help you publish a working GitHub repository by the end of the day.",
  },
  {
    q: "What are the rules?",
    a: "All development work must start at the event: projects or codebases begun before the day aren’t eligible. Form a team, push your project to a public GitHub repository under an open-source license, and give a quick 5-minute live demo. Bring a laptop and charger if you’re building.",
  },
  {
    q: "What can I win?",
    a: "There are three prizes: First Overall, Best AI Hack using Gemma, and Best Beginner Hack, plus swag and goodies from MLH. Full prize details are coming soon.",
  },
  {
    q: "When and where is it, and how do I sign up?",
    a: (
      <>
        Saturday, October 10, 2026, 10:00 AM to 7:30 PM IST, at the Mini Auditorium, New Lecture
        Hall, NIT Hamirpur.{" "}
        <a
          href={REGISTER_URL}
          {...external(REGISTER_URL)}
          className="font-semibold text-ink underline decoration-2 underline-offset-4"
        >
          Log in and register on the MLH event page
        </a>{" "}
        to save your spot.
      </>
    ),
  },
];

function Wordmark({
  tone = "light",
  compact = false,
}: {
  tone?: "light" | "dark";
  compact?: boolean;
}) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 font-display text-[1.45rem] font-extrabold uppercase leading-none tracking-[0.01em] sm:text-[1.7rem]",
        tone === "light" ? "text-paper" : "text-ink",
      )}
    >
      <span>Hack Day</span>
      {compact ? null : <span className="hidden sm:inline">Hamirpur</span>}
      <span
        className={cn(
          "border-2 px-1 pb-px pt-0.5 font-mono text-[0.72rem] font-extrabold tracking-normal sm:text-[0.8rem]",
          tone === "light" ? "border-paper bg-paper text-forest" : "border-ink bg-ink text-paper",
        )}
      >
        26
      </span>
    </span>
  );
}

function HackDayPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");
  const reducedMotion = useReducedMotion();

  // Underline the nav item for the section in view (reference: current page is underlined).
  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      {/*
        TODO(mlh-badge): once MLH confirms this is a Member Event, paste the official
        "Hackathon Season Member Event Badge" embed from https://www.mlh.com/brand-guidelines into
        this slot. The official embed is an <a id="mlh-trust-badge"> fixed at top:0; right:50px;
        width:10%; min-width:60px; max-width:100px. The header already leaves room for it.
        Don't hotlink or recreate the badge before the event is registered.
      */}
      <div
        id="mlh-badge-slot"
        aria-hidden="true"
        className="pointer-events-none fixed right-[50px] top-0 z-[10000] w-[10%] min-w-[60px] max-w-[100px]"
      />

      <header className="relative z-40 border-b border-ink bg-forest text-paper">
        <div
          className={cn(
            "shell flex items-center justify-between gap-6 py-[17px]",
            MLH_BADGE_ENABLED &&
              "pr-[100px] lg:pr-[max(0px,calc(160px-(100vw-min(100vw-40px,1280px))/2))]",
          )}
        >
          <a href="#main" aria-label="Hack Day Hamirpur, back to top" className="shrink-0">
            <Wordmark />
          </a>
          <nav aria-label="Main" className="hidden items-center gap-5 lg:flex xl:gap-7">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={active === item.id ? "true" : undefined}
                className="hf-nav-link font-mono text-[0.78rem] text-paper [--nav-accent:var(--coral-light)] hover:[--nav-accent:var(--paper)]"
              >
                {item.label}
              </a>
            ))}
            <Button asChild size="sm" className="ml-2">
              <a href={REGISTER_URL} {...external(REGISTER_URL)}>
                Register
              </a>
            </Button>
          </nav>
          <button
            type="button"
            className="flex size-10 items-center justify-center text-paper lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {/* Reference mobile menu: fades + slides 8px over 180ms */}
        <AnimatePresence>
          {menuOpen ? (
            <motion.nav
              id="mobile-menu"
              aria-label="Mobile"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: reducedMotion ? 0 : 0.18 }}
              className="absolute inset-x-0 top-full border-b border-ink bg-forest lg:hidden"
            >
              <div className="shell flex flex-col py-4">
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="py-2.5 font-mono text-[0.85rem] font-bold text-paper hover:underline"
                  >
                    {item.label}
                  </a>
                ))}
                <Button asChild size="sm" className="mt-3 self-start">
                  <a
                    href={REGISTER_URL}
                    {...external(REGISTER_URL)}
                    onClick={() => setMenuOpen(false)}
                  >
                    Register
                  </a>
                </Button>
              </div>
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </header>

      <main
        id="main"
        tabIndex={-1}
        className="overflow-x-clip bg-background text-foreground focus:outline-none"
      >
        {/* Hero */}
        <section
          aria-labelledby="hero-title"
          className="relative overflow-hidden bg-forest text-paper"
        >
          <PixelStair className="absolute left-0 top-0 hidden w-[160px] sm:block" />
          <PixelBars className="absolute bottom-0 right-0 w-[150px] sm:w-[260px]" />
          <div className="shell relative grid items-center gap-12 pb-[5rem] pt-12 sm:pb-[clamp(5rem,8vw,6.5rem)] sm:pt-[clamp(6.5rem,9vw,8.5rem)] lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
            <div className="text-center lg:text-left">
              <ColorStrip className="mx-auto mb-4 lg:mx-0" />
              <p className="kicker font-normal text-pink">
                Hack Day · Sat 10 Oct 2026 · NIT Hamirpur
              </p>
              <h1
                id="hero-title"
                className="mt-4 font-display text-[clamp(2.6rem,4.8vw,4.5rem)] font-extrabold leading-[0.98] tracking-[-0.03em]"
              >
                Hacktoberfest Hack Day <span className="text-coral-light">Hamirpur.</span>
              </h1>
              <p className="mx-auto mt-5 max-w-[36rem] text-[1.05rem] leading-[1.55] lg:mx-0">
                Build the future with <strong className="font-bold">open source</strong> &amp;{" "}
                <strong className="font-bold">open-weight AI</strong>. A high-energy, one-day,
                in-person mini hackathon at NIT Hamirpur.
              </p>
              <ul className="mt-6 flex flex-col gap-2 font-mono text-[0.78rem] leading-[1.6] text-paper/90 xl:flex-row xl:gap-6">
                <li className="xl:whitespace-nowrap">
                  <CalendarDays
                    className="mr-2 inline size-4 align-[-3px] text-gold"
                    aria-hidden="true"
                  />
                  Sat, October 10, 2026 · 10 AM–7:30 PM IST
                </li>
                <li>
                  <a href="#venue" className="underline-offset-4 hover:underline">
                    <MapPin
                      className="mr-2 inline size-4 align-[-3px] text-coral-light"
                      aria-hidden="true"
                    />
                    Mini Auditorium, New Lecture Hall, NIT Hamirpur
                  </a>
                </li>
              </ul>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Button asChild size="lg">
                  <a href={REGISTER_URL} {...external(REGISTER_URL)}>
                    Register now <ArrowRight />
                  </a>
                </Button>
                <Button asChild size="lg" variant="onDark">
                  <a href={COMMUNITY_URL} {...external(COMMUNITY_URL)}>
                    Join community
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative mx-auto aspect-[11/10] w-full max-w-[340px] sm:max-w-[460px] lg:max-w-[540px]">
              {heroStickers.map((sticker, index) => (
                <HexSticker
                  key={index}
                  icon={sticker.icon}
                  tone={sticker.tone}
                  dots={sticker.dots}
                  tilt={sticker.tilt}
                  size={`${sticker.s}%`}
                  className="absolute"
                  style={{ left: `${sticker.x}%`, top: `${sticker.y}%` }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Presenter strip (reference: the cream band under the home hero) */}
        <section aria-label="Presented by" className="border-b border-ink bg-paper">
          <div className="shell flex flex-col items-center gap-x-8 gap-y-3 py-6 text-center lg:flex-row lg:justify-center">
            <p className="font-display text-[1.5rem] font-extrabold leading-tight tracking-[-0.02em]">
              Hacktoberfest 2026: <span className="text-red">Hack Day Hamirpur.</span>
            </p>
            <span className="hidden h-8 w-px bg-ink/25 lg:block" aria-hidden="true" />
            <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <span className="kicker whitespace-nowrap text-[0.66rem] text-body">
                Presented by
              </span>
              <span className="font-semibold">NIT Hamirpur Chapter : GDG Ludhiana</span>
            </p>
            <span className="hidden h-8 w-px bg-ink/25 lg:block" aria-hidden="true" />
            <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <span className="kicker whitespace-nowrap text-[0.66rem] text-body">With</span>
              {/* TODO(brand-kit): official MLH logo from mlh.com/brand-guidelines once confirmed */}
              <span className="whitespace-nowrap font-mono text-[0.85rem] font-bold">
                Major League Hacking
              </span>
            </p>
          </div>
        </section>

        {/* Countdown */}
        <CountdownSection />

        {/* About + MLH-style stats row */}
        <section
          id="about"
          aria-labelledby="about-title"
          className="bg-forest-deep py-[clamp(4.5rem,7.4vw,6.75rem)] text-paper"
        >
          <div className="shell">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div style={{ "--accent-phrase": "var(--gold)" } as CSSProperties}>
                <p className="kicker text-sky-light">The event</p>
                <h2 id="about-title" className="hf-heading mt-[13px] max-w-[14ch]">
                  One day. Open ideas. <em>Real impact.</em>
                </h2>
              </div>
              <div className="space-y-5 text-[1.05rem] leading-[1.7]">
                <p>
                  <strong className="font-bold">
                    Presented by NIT Hamirpur Chapter : GDG Ludhiana
                  </strong>{" "}
                  in partnership with{" "}
                  <strong className="font-bold">Major League Hacking (MLH)</strong>.
                </p>
                <p>
                  Get ready to innovate, build, and connect! Hacktoberfest Hack Day Hamirpur is a
                  high-energy, one-day in-person mini hackathon hosted at NIT Hamirpur. This year’s
                  theme centers on{" "}
                  <strong className="font-bold">
                    open source and open-weight AI, including Gemma models.
                  </strong>
                </p>
                <p>
                  Whether you are a complete beginner, first-year student, or seasoned coder, there
                  is a seat at the table for you.{" "}
                  <strong className="font-bold">No prior open-source experience needed.</strong>
                </p>
                <div className="pt-3">
                  <Button asChild>
                    <a href="#prizes">See the prizes</a>
                  </Button>
                </div>
              </div>
            </div>

            <dl className="mt-16 grid gap-10 border-t border-paper/25 pt-12 text-center sm:grid-cols-3 sm:gap-6">
              {[
                { value: "1", label: "Day of hacking" },
                { value: "3", label: "Prize tracks" },
                { value: "0", label: "Experience needed" },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className={cn(
                    "flex flex-col-reverse",
                    index === 0 && "sm:text-left",
                    index === 2 && "sm:text-right",
                  )}
                >
                  <dt className="mt-2 font-mono text-[0.95rem] text-sky-light">{stat.label}</dt>
                  <dd className="font-mono text-[clamp(3.75rem,7vw,5rem)] font-extrabold leading-none tracking-[-0.04em]">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* How the day works */}
        <section aria-labelledby="how-title" className="band bg-cream">
          <div className="shell">
            <SectionHeading
              id="how-title"
              eyebrow="How the day works"
              title={
                <>
                  Show up, build, <em>ship it.</em>
                </>
              }
            />
            <ol className="mt-12 grid gap-12 md:grid-cols-3 md:gap-10">
              {steps.map((step, index) => (
                <li key={step.title} className="sticker-host">
                  <div className="flex h-[84px] items-end">
                    {step.stickers.map((sticker, i) => (
                      <HexSticker
                        key={i}
                        icon={sticker.icon}
                        tone={sticker.tone}
                        dots={sticker.dots}
                        size={76}
                        tilt={i % 2 ? 6 : -6}
                        className={i ? "-ml-3" : undefined}
                      />
                    ))}
                  </div>
                  <div className="mt-6 flex gap-4">
                    <span className="flex size-[34px] shrink-0 items-center justify-center border-2 border-ink bg-gold font-mono text-[0.72rem] font-bold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-[1.6rem] font-bold leading-[1.05] tracking-[-0.02em]">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 leading-[1.6] text-body">{step.text}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
              <Button asChild>
                <a href={REGISTER_URL} {...external(REGISTER_URL)}>
                  Save your spot
                </a>
              </Button>
              <p className="text-[0.85rem] text-body">Building? Bring a laptop and charger.</p>
            </div>
          </div>
        </section>

        {/* What you get */}
        <section id="perks" aria-labelledby="perks-title" className="band bg-stone">
          <div className="shell">
            <SectionHeading
              id="perks-title"
              eyebrow="Why join"
              title={
                <>
                  What you <em>get.</em>
                </>
              }
              description="Come with an idea or simply your curiosity. Leave with new skills, new collaborators, and something you shipped."
            />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {perks.map((perk) => (
                <article key={perk.title} className="hf-card flex flex-col p-6">
                  <div className="flex items-start justify-between gap-4">
                    <perk.icon
                      aria-hidden="true"
                      className="size-[52px] drop-shadow-[3px_3px_0_var(--maroon)]"
                      fill="var(--coral)"
                      stroke="var(--ink)"
                      strokeWidth={1.75}
                    />
                    <span className="hf-pill border border-coral bg-pink-chip text-maroon">
                      {perk.pill}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-[1.5rem] font-bold leading-[1.05] tracking-[-0.01em]">
                    {perk.title}
                  </h3>
                  <p className="mt-2 text-[0.95rem] leading-[1.55] text-body">{perk.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Prize pool */}
        <section id="prizes" aria-labelledby="prizes-title" className="band bg-forest text-paper">
          <div className="shell">
            <SectionHeading
              id="prizes-title"
              tone="dark"
              eyebrow="Prize pool"
              title={
                <>
                  Three ways <em>to win.</em>
                </>
              }
              description="Recognition for bold ideas, thoughtful execution, and first-time builders."
            />
            <div className="mt-12 grid gap-7 md:grid-cols-3">
              <PrizeCard
                accent="gold"
                place="Grand prize"
                title="First Overall"
                description="Top honors and an exciting reward package. Full prize details coming soon."
                icon="trophy"
              />
              <PrizeCard
                accent="navy"
                place="AI track"
                title="Best AI Hack using Gemma"
                description="For the most useful, imaginative open-weight AI project. Reward details coming soon."
                icon="sparkles"
              />
              <PrizeCard
                accent="red"
                place="Rising builder"
                title="Best Beginner Hack"
                description="Celebrating a brilliant first open-source build. Reward details coming soon."
                icon="medal"
              />
            </div>
          </div>
        </section>

        {/* Schedule (tentative) */}
        <section id="schedule" aria-labelledby="schedule-title" className="band bg-cream">
          <div className="shell">
            <SectionHeading
              id="schedule-title"
              eyebrow={
                <span className="flex items-center gap-3">
                  Schedule{" "}
                  <span className="hf-pill border border-gold-deep bg-gold-chip text-gold-deep">
                    Tentative
                  </span>
                </span>
              }
              title={
                <>
                  How Saturday <em>runs.</em>
                </>
              }
              description="Doors open at 10:00 and we wrap at 19:30 IST. The slots in between are tentative and may change before the day."
            />
            <div className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-2 border-2 border-ink bg-paper px-4 py-3 font-mono text-[0.72rem] uppercase tracking-[0.08em] shadow-[5px_5px_0_var(--ink)]">
              <span className="font-bold">Sat 10 Oct 2026 · {schedule.length} sessions</span>
              <span className="hidden h-5 w-px bg-ink/30 sm:block" />
              <span className="flex flex-wrap gap-2">
                <span className="hf-pill bg-sky-chip text-navy">Talks</span>
                <span className="hf-pill bg-pink-chip text-maroon">Hacking</span>
                <span className="hf-pill bg-gold-chip text-gold-deep">Demos</span>
              </span>
              <span className="text-body sm:ml-auto">Times in IST</span>
            </div>
            <ol className="mt-7 space-y-[18px]">
              {schedule.map((slot) => {
                const style = sessionStyle[slot.type];
                return (
                  <li
                    key={slot.start}
                    className="schedule-row flex items-center gap-4 border-2 border-ink bg-paper p-3 sm:p-4"
                    style={{ boxShadow: `6px 6px 0 ${style.shadow}` }}
                  >
                    <span className="flex w-[64px] shrink-0 flex-col items-center border-2 border-ink py-1.5 sm:w-[74px]">
                      <span className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.1em] text-body">
                        Start
                      </span>
                      <span className="font-display text-[1.3rem] font-extrabold leading-none sm:text-[1.45rem]">
                        {slot.start}
                      </span>
                    </span>
                    <span className="min-w-0 flex-1 font-display text-[1.15rem] font-bold leading-[1.15] tracking-[-0.01em] sm:text-[1.45rem]">
                      {slot.title}
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className={cn("hf-pill", style.pill)}>{slot.type}</span>
                      <span className="font-mono text-[0.72rem] sm:text-[0.8rem]">
                        {slot.start}–{slot.end}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* Venue map (reference: the pixel world map in the hacktoberfest.com home hero) */}
        <section
          id="venue"
          aria-labelledby="venue-title"
          className="band overflow-hidden bg-forest text-paper"
        >
          <div className="shell grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
            <div>
              <p className="kicker font-normal text-pink">
                Where to go · Hamirpur, Himachal Pradesh
              </p>
              <h2
                id="venue-title"
                className="hf-heading mt-[14px] max-w-[14ch] [--accent-phrase:var(--coral-light)]"
              >
                Find us at <em>NIT Hamirpur.</em>
              </h2>
              <div className="hf-card mt-8 p-6 [--card-shadow:var(--forest-deep)] sm:p-7">
                <p className="kicker text-[0.68rem] text-body">Venue</p>
                <p className="mt-2 font-display text-[1.6rem] font-bold leading-[1.05] tracking-[-0.02em]">
                  Mini Auditorium, New Lecture Hall
                </p>
                <p className="mt-1 text-body">
                  National Institute of Technology Hamirpur, Hamirpur, Himachal Pradesh 177005
                </p>
                <p className="mt-4 flex items-center gap-2 font-mono text-[0.78rem]">
                  <CalendarDays className="size-4 shrink-0 text-gold-deep" aria-hidden="true" />
                  Saturday, October 10, 2026 · 10:00 AM–7:30 PM IST
                </p>
                <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                  <Button asChild>
                    <a href={DIRECTIONS_URL} target="_blank" rel="noreferrer">
                      <MapPin /> Get directions
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href="#schedule">See the schedule</a>
                  </Button>
                </div>
              </div>
            </div>
            <div className="mx-auto w-full max-w-[560px]">
              <VenueMap />
            </div>
          </div>
        </section>

        {/* Sponsors */}
        <section id="sponsors" aria-labelledby="sponsors-title" className="band bg-stone">
          <div className="shell">
            <SectionHeading
              id="sponsors-title"
              eyebrow="Sponsors"
              title={
                <>
                  Our <em>sponsors.</em>
                </>
              }
              description="Powered by organizations that believe open collaboration changes what is possible."
            />
            {/* TODO(brand-kit): replace these text wordmarks with official sponsor logo files once provided. */}
            <div className="mt-12 grid gap-4 md:grid-cols-2">
              {[
                {
                  tier: "Title sponsor",
                  dot: "bg-sky",
                  mark: (
                    <span className="flex items-center gap-3 font-sans text-[2.2rem] font-medium tracking-[-0.02em]">
                      <Sparkle className="size-8 text-navy" fill="var(--sky)" aria-hidden="true" />
                      Gemma
                    </span>
                  ),
                },
                {
                  tier: "Community partner",
                  dot: "bg-gold",
                  mark: (
                    <span className="text-center font-mono text-[1.15rem] font-extrabold uppercase tracking-[0.02em]">
                      Major League Hacking
                    </span>
                  ),
                },
              ].map((tile) => (
                <div key={tile.tier} className="border-2 border-ink bg-paper">
                  <p className="kicker flex items-center justify-center gap-2 bg-forest py-2 text-[0.68rem] text-paper">
                    <span className={cn("size-2", tile.dot)} aria-hidden="true" /> {tile.tier}
                  </p>
                  <div className="flex min-h-[112px] items-center justify-center border-t-2 border-ink px-6 py-6">
                    {tile.mark}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="flex min-h-[104px] items-center justify-center border-2 border-ink bg-paper font-display text-[2rem] font-extrabold tracking-[-0.02em]">
                xyz domain
              </div>
              <div className="flex min-h-[104px] items-center justify-center border-2 border-ink bg-paper font-display text-[2rem] font-extrabold tracking-[0.12em]">
                OSEN
              </div>
              <div className="flex min-h-[104px] items-center justify-center border-2 border-ink bg-paper font-sans text-[1.7rem] font-bold tracking-[-0.03em]">
                ElevenLabs
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" aria-labelledby="faq-title" className="band bg-cream">
          <div className="shell">
            <SectionHeading
              id="faq-title"
              eyebrow="Common questions"
              title={
                <>
                  New to hackathons? <em>Start here.</em>
                </>
              }
              description="The practical ones first. Anything else, message the organisers below."
            />
            <Accordion type="single" collapsible className="hf-card mt-12">
              {faqs.map((faq, index) => (
                <AccordionItem key={faq.q} value={`faq-${index}`}>
                  <AccordionTrigger>{faq.q}</AccordionTrigger>
                  <AccordionContent>{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Sponsorship banner */}
        <section id="contact" aria-labelledby="contact-title" className="band bg-sky">
          <div className="shell">
            <div
              className="hf-card grid items-center gap-10 p-7 sm:p-11 lg:grid-cols-[minmax(0,1fr)_auto]"
              style={{ "--card-shadow": "var(--navy)" } as CSSProperties}
            >
              <div>
                <p className="kicker">Partner with us</p>
                <h2
                  id="contact-title"
                  className="mt-3 max-w-[24ch] font-display text-[clamp(2rem,3.6vw,2.75rem)] font-extrabold leading-[0.98] tracking-[-0.03em]"
                >
                  Want to empower the next generation of developers?
                </h2>
                <p className="mt-4 max-w-[44ch] text-[1.05rem] text-body">
                  Support builders, open ideas, and the future of collaborative technology.
                </p>
                <div className="mt-7 flex flex-col gap-4 sm:flex-row">
                  <Button asChild>
                    <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                      <MessageCircle /> WhatsApp
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href={`mailto:${EMAIL}`}>
                      <Mail /> Email us
                    </a>
                  </Button>
                </div>
              </div>
              <div className="sticker-host hidden items-center sm:flex">
                <HexSticker icon={HeartHandshake} tone="sky" size={96} tilt={-8} dots={1} />
                <HexSticker icon={Gift} tone="sunset" size={124} tilt={0} className="-mx-2" />
                <HexSticker icon={Megaphone} tone="red" size={96} tilt={8} />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer — reference reuses the MLH footer layout (mission + socials left, link columns right, legal row) */}
      <footer className="border-t border-ink bg-snow font-sans">
        <div className="shell py-16">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
            <div>
              <Wordmark tone="dark" />
              <p className="mt-5 max-w-[30ch] italic leading-[1.6] text-muted-foreground">
                Organised by NIT Hamirpur Chapter, GDG Ludhiana.
              </p>
              <ul className="mt-5 flex gap-3">
                {[
                  { href: SOCIALS.github, label: "GitHub", icon: <Github className="size-5" /> },
                  {
                    href: SOCIALS.linkedin,
                    label: "LinkedIn",
                    icon: <Linkedin className="size-5" />,
                  },
                  {
                    href: SOCIALS.instagram,
                    label: "Instagram",
                    icon: <Instagram className="size-5" />,
                  },
                ].map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="flex size-10 items-center justify-center text-muted-foreground transition-colors hover:text-ink"
                    >
                      {social.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3">
              {[
                {
                  heading: "Event",
                  links: [
                    { label: "About", href: "#about" },
                    { label: "Perks", href: "#perks" },
                    { label: "Prizes", href: "#prizes" },
                    { label: "Schedule", href: "#schedule" },
                    { label: "Venue", href: "#venue" },
                  ],
                },
                {
                  heading: "Get involved",
                  links: [
                    { label: "Register", href: REGISTER_URL },
                    { label: "Join the community", href: COMMUNITY_URL },
                    { label: "Sponsor us", href: "#contact" },
                    { label: "FAQ", href: "#faq" },
                  ],
                },
                {
                  heading: "Resources",
                  links: [
                    { label: "Code of Conduct", href: CODE_OF_CONDUCT_URL },
                    { label: "Hacktoberfest 2026", href: "https://hacktoberfest.com/" },
                    { label: "Email the team", href: `mailto:${EMAIL}` },
                  ],
                },
              ].map((column) => (
                <div key={column.heading}>
                  <h2 className="text-[0.875rem] font-bold uppercase tracking-[0.02em] text-body">
                    {column.heading}
                  </h2>
                  <ul className="mt-3 space-y-2">
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          {...external(link.href)}
                          className="text-mlh-link hover:underline"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
          <div className="mt-12 flex flex-col gap-2 border-t border-ink/15 pt-6 text-[0.95rem] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 Hack Day Hamirpur</span>
            <span>
              Made with{" "}
              <span className="text-red-deep" aria-label="love">
                ♥
              </span>{" "}
              for the open-source community.
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
