import { motion } from "framer-motion";
import { Medal, Sparkles, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PrizeCardProps {
  place: string;
  title: string;
  description: string;
  icon?: "trophy" | "medal" | "sparkles";
}

const icons = { trophy: Trophy, medal: Medal, sparkles: Sparkles };

export function PrizeCard({ place, title, description, icon = "trophy" }: PrizeCardProps) {
  const Icon = icons[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45 }}
      className="h-full"
    >
      <Card className="prize-card relative h-full overflow-hidden border-border/80 bg-card/70 backdrop-blur-xl">
        <CardContent className="relative flex h-full flex-col items-center p-8 text-center">
          <span className="mb-6 font-mono text-xs font-bold uppercase text-accent">{place}</span>
          <div className="trophy-stage mb-7 flex size-24 items-center justify-center rounded-full">
            <Icon className="size-12 text-highlight drop-shadow-glow" strokeWidth={1.5} />
          </div>
          <h3 className="font-display text-2xl font-bold text-foreground">{title}</h3>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}