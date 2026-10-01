import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight, CalendarDays, Check, Code2, Github, Gift, Linkedin, Mail,
  MapPin, Menu, MessageCircle, Mic2, Network, Sparkles, Trophy, X, Zap,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NeuralGitBackground } from "@/components/event/neural-git-background";
import { PrizeCard } from "@/components/event/prize-card";
import { SectionHeading } from "@/components/event/section-heading";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hacktoberfest Hack Day Hamirpur 2026" },
      { name: "description", content: "Build the future with open source and open-weight AI at NIT Hamirpur on October 10, 2026." },
      { property: "og:title", content: "Hacktoberfest Hack Day Hamirpur 2026" },
      { property: "og:description", content: "A high-energy, one-day open source and AI mini hackathon at NIT Hamirpur." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HackDayPage,
});

const navItems = ["Home", "About", "Benefits", "Prizes", "Sponsors", "Contact"];

const benefits = [
  { icon: Gift, title: "Prizes, Swag & Goodies", text: "Inclusive tracks, exclusive goodies, and awesome swag from MLH.", number: "01" },
  { icon: Mic2, title: "Community & Tech Talks", text: "Interactive workshops and expert-led talks on open source and modern AI tools.", number: "02" },
  { icon: Code2, title: "Hands-on Mentorship", text: "Work with mentors to publish a working GitHub repository in just one day.", number: "03" },
];

const sponsorTiers = [
  { tier: "Community Partner", names: ["MLH", "Major League Hacking"], size: "large" },
  { tier: "Title Sponsor", names: ["Gemma"], size: "large" },
  { tier: "Technical Partners", names: ["xyz domain", "OSEN", "ElevenLabs"], size: "small" },
];

function HackDayPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, 100]);

  return (
    <main className="overflow-hidden bg-background text-foreground">
      <motion.div className="scroll-progress fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-primary" style={{ scaleX: scrollYProgress }} />
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <a href="#home" className="flex items-center gap-3" aria-label="Hack Day home">
            <span className="logo-mark flex size-9 items-center justify-center rounded-md font-mono text-sm font-black">HF</span>
            <span className="hidden font-mono text-sm font-bold uppercase text-foreground sm:block">Hack Day <span className="text-accent">/ Hamirpur</span></span>
          </a>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
            {navItems.map((item) => <a key={item} href={`#${item.toLowerCase()}`} className="nav-link font-mono text-xs font-semibold uppercase text-muted-foreground">{item}</a>)}
          </nav>
          <Button asChild variant="glow" size="sm" className="hidden md:inline-flex"><a href="#contact">Register <ArrowRight /></a></Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</Button>
        </div>
        {menuOpen ? <nav className="border-t border-border bg-background px-5 py-4 md:hidden">{navItems.map((item) => <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="block border-b border-border/50 py-3 font-mono text-sm uppercase text-muted-foreground last:border-0">{item}</a>)}</nav> : null}
      </header>

      <section id="home" className="hero-grid relative flex min-h-screen items-center overflow-hidden border-b border-border pt-20">
        <NeuralGitBackground />
        <motion.div style={{ y: heroY }} className="relative z-10 mx-auto w-full max-w-7xl px-5 py-20 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-5xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 font-mono text-xs font-bold uppercase text-accent">
              <span className="size-2 animate-pulse rounded-full bg-accent" /> NIT Hamirpur · Open Source AI
            </div>
            <h1 className="font-display text-[clamp(3.2rem,8vw,7.8rem)] font-black leading-[0.88] text-foreground">
              Hacktoberfest<br /><span className="title-outline">Hack Day</span> <span className="text-primary">Hamirpur</span>
            </h1>
            <p className="mt-8 max-w-2xl text-xl leading-8 text-muted-foreground sm:text-2xl">Build the future with <strong className="font-medium text-foreground">open source</strong> &amp; <strong className="font-medium text-foreground">open-weight AI</strong>.</p>
            <div className="mt-8 flex flex-col gap-3 font-mono text-sm text-foreground sm:flex-row sm:items-center sm:gap-6">
              <span className="flex items-center gap-2"><CalendarDays className="text-accent" /> October 10, 2026</span>
              <span className="hidden h-1 w-1 rounded-full bg-muted-foreground sm:block" />
              <span className="flex items-center gap-2"><MapPin className="text-google-red" /> Mini Auditorium, NIT Hamirpur</span>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild variant="glow" size="lg"><a href="#contact">Register Now <ArrowRight /></a></Button>
              <Button asChild variant="terminal" size="lg"><a href="#contact">Join Community <Github /></a></Button>
            </div>
          </motion.div>
        </motion.div>
        <div className="absolute bottom-6 right-8 hidden font-mono text-[10px] uppercase text-muted-foreground lg:block">scroll to explore ↓</div>
      </section>

      <section id="about" className="section-space relative border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8">
          <div>
            <SectionHeading eyebrow="// 01 — The event" title="One day. Open ideas. Real impact." />
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-8 space-y-5 text-base leading-8 text-muted-foreground">
              <p className="text-lg text-foreground">Presented by <strong>NIT Hamirpur Chapter : GDG Ludhiana</strong> in partnership with <strong>Major League Hacking (MLH)</strong>.</p>
              <p>Get ready to innovate, build, and connect! Hacktoberfest Hack Day Hamirpur is a high-energy, one-day in-person mini hackathon hosted at NIT Hamirpur. This year’s theme centers on open source and open-weight AI, including Gemma models.</p>
              <p>Whether you are a complete beginner, first-year student, or seasoned coder, there is a seat at the table for you. No prior open-source experience needed.</p>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, x: 35 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="terminal-window overflow-hidden rounded-lg border border-border bg-terminal shadow-panel">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex gap-2"><i className="size-3 rounded-full bg-google-red" /><i className="size-3 rounded-full bg-google-yellow" /><i className="size-3 rounded-full bg-google-green" /></div>
              <span className="font-mono text-[10px] uppercase text-muted-foreground">hack-day.sh</span><span />
            </div>
            <div className="space-y-5 p-6 font-mono text-sm leading-7 sm:p-8">
              <p><span className="text-google-blue">$</span> git clone future/open-source-ai</p>
              <p className="text-muted-foreground">Cloning into <span className="text-foreground">'hamirpur-2026'</span>...</p>
              <div className="rounded-md border border-border bg-background/50 p-4">
                <p><span className="text-accent">const</span> mission = &#123;</p>
                <p className="pl-5"><span className="text-google-blue">people:</span> "curious builders",</p>
                <p className="pl-5"><span className="text-google-yellow">model:</span> "open-weight",</p>
                <p className="pl-5"><span className="text-google-red">impact:</span> Infinity</p>
                <p>&#125;;</p>
              </div>
              <p><span className="text-google-blue">$</span> git commit -m <span className="text-accent">"build what matters"</span></p>
              <p className="flex items-center gap-2 text-accent"><Check className="size-4" /> Ready to hack.</p>
              <span className="inline-block h-5 w-2 animate-pulse bg-primary" />
            </div>
          </motion.div>
        </div>
      </section>

      <section id="benefits" className="section-space bg-surface">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading eyebrow="// 02 — Why join" title="What’s in it for you?" description="Come with an idea or simply your curiosity. Leave with new skills, new collaborators, and something you shipped." align="center" />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <motion.div key={benefit.title} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -7 }}>
                <Card className="benefit-card h-full border-border bg-card">
                  <CardContent className="p-7">
                    <div className="mb-10 flex items-start justify-between"><span className="flex size-12 items-center justify-center rounded-lg bg-primary/15 text-primary"><benefit.icon /></span><span className="font-mono text-xs text-muted-foreground">{benefit.number}</span></div>
                    <h3 className="font-display text-2xl font-bold">{benefit.title}</h3><p className="mt-4 leading-7 text-muted-foreground">{benefit.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="prizes" className="section-space relative border-y border-border">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading eyebrow="// 03 — Rewards" title="Prize Pool" description="Recognition for bold ideas, thoughtful execution, and first-time builders." align="center" />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            <PrizeCard place="Grand prize" title="First Overall" description="Top honors and an exciting reward package. Full prize details coming soon." icon="trophy" />
            <PrizeCard place="AI track" title="Best AI Hack using Gemma" description="For the most useful, imaginative open-weight AI project. Reward details coming soon." icon="sparkles" />
            <PrizeCard place="Rising builder" title="Best Beginner Hack" description="Celebrating a brilliant first open-source build. Reward details coming soon." icon="medal" />
          </div>
        </div>
      </section>

      <section id="sponsors" className="section-space dot-grid bg-surface">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <SectionHeading eyebrow="// 04 — Backed by" title="Our Sponsors" description="Powered by organizations that believe open collaboration changes what is possible." align="center" />
          <div className="mt-14 space-y-12">
            {sponsorTiers.map((group) => <div key={group.tier} className="text-center"><p className="mb-5 font-mono text-xs font-bold uppercase text-muted-foreground">{group.tier}</p><div className="flex flex-wrap justify-center gap-4">{group.names.map((name) => <div key={name} className={`sponsor-logo flex items-center justify-center rounded-lg border border-border bg-card/70 font-display font-bold backdrop-blur ${group.size === "large" ? "h-28 min-w-56 px-10 text-3xl" : "h-24 min-w-44 px-8 text-xl"}`}>{name === "MLH" ? <><Trophy className="mr-3 text-google-red" /> MLH</> : name === "Gemma" ? <><Sparkles className="mr-3 text-google-blue" /> Gemma</> : name}</div>)}</div></div>)}
          </div>
        </div>
      </section>

      <section id="contact" className="section-space border-y border-border">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="support-banner relative overflow-hidden rounded-lg border border-accent/40 p-7 sm:p-12 lg:flex lg:items-center lg:justify-between">
            <Network className="absolute -right-12 -top-12 size-64 text-accent/10" strokeWidth={0.6} aria-hidden="true" />
            <div className="relative max-w-2xl"><p className="font-mono text-xs font-bold uppercase text-accent">// Partner with us</p><h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">Want to empower the next generation of developers?</h2><p className="mt-4 text-lg text-muted-foreground">Support builders, open ideas, and the future of collaborative technology.</p></div>
            <div className="relative mt-8 flex flex-wrap gap-3 lg:mt-0 lg:pl-8"><Button asChild variant="glow" size="lg"><a href="https://wa.me/qr/3SSYXRFDEDARK1" target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp</a></Button><Button asChild variant="terminal" size="lg"><a href="mailto:harshbhushan001@gmail.com"><Mail /> Email us</a></Button></div>
          </div>
        </div>
      </section>

      <footer className="bg-surface px-5 py-10 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8">
          <div className="flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-center sm:justify-between"><div><div className="font-display text-lg font-bold">Hacktoberfest Hack Day Hamirpur</div><p className="mt-1 text-sm text-muted-foreground">Organised by NIT Hamirpur Chapter - GDG Ludhiana</p></div><div className="flex gap-2"><Button variant="ghost" size="icon" asChild><a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub"><Github /></a></Button><Button variant="ghost" size="icon" asChild><a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin /></a></Button><Button variant="ghost" size="icon" asChild><a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X"><X /></a></Button></div></div>
          <div className="flex flex-col gap-2 font-mono text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>© 2026 Hack Day Hamirpur</span><span>Made with <span className="text-google-red">♥</span> for the open-source community.</span></div>
        </div>
      </footer>
    </main>
  );
}
