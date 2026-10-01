import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Variants mirror the hacktoberfest.com buttons: square, 2px ink border, hard offset shadow that
// presses 2px on hover (150ms). Colours are passed to the `.hf-btn` rule in styles.css via vars.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-mono font-[650] tracking-[0.02em] leading-[1.1] text-center no-underline cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Coral fill, maroon shadow — the primary reference button
        default:
          "hf-btn [--btn-bg:var(--coral)] [--btn-fg:var(--ink)] [--btn-shadow:var(--maroon)]",
        // Paper fill, stone on hover (reference "outline")
        outline:
          "hf-btn [--btn-bg:var(--paper)] [--btn-fg:var(--ink)] [--btn-shadow:var(--maroon)] [--btn-hover-bg:var(--stone)]",
        // Ghost-on-dark for forest bands (reference "on dark"): fills paper on hover
        onDark:
          "hf-btn [--btn-bg:transparent] [--btn-fg:var(--paper)] [--btn-border:color-mix(in_oklab,white_72%,transparent)] [--btn-shadow:var(--forest-deep)] [--btn-hover-bg:var(--paper)] [--btn-hover-fg:var(--ink)]",
        secondary: "hf-btn [--btn-bg:var(--stone)] [--btn-fg:var(--ink)] [--btn-shadow:var(--ink)]",
        destructive:
          "hf-btn [--btn-bg:var(--red-deep)] [--btn-fg:var(--paper)] [--btn-shadow:var(--maroon)]",
        ghost: "transition-colors hover:bg-stone",
        link: "font-mono underline underline-offset-4 decoration-2 hover:decoration-[3px]",
      },
      size: {
        default: "min-h-[50px] px-[22px] py-3 text-[0.85rem]",
        sm: "px-[17px] py-[10px] text-[0.78rem] [--btn-offset:4px] [--btn-offset-hover:2px]",
        // MLH-sized hero CTA (64px tall) in Hacktoberfest styling
        lg: "min-h-[64px] px-7 py-4 text-base",
        icon: "size-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
