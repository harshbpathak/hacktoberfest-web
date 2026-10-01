import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

import { cn } from "@/lib/utils";

// Styled after the hacktoberfest.com FAQ: stacked paper rows, condensed questions, a mono "+" that
// rotates 45° (150ms) and a 250ms height transition (see .hf-acc-content in styles.css).

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b-2 border-ink last:border-b-0", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "group flex flex-1 cursor-pointer items-center justify-between gap-5 px-6 py-[22px] text-left font-display text-[clamp(1.1rem,2vw,1.35rem)] font-bold leading-[1.2] tracking-[-0.01em] focus-visible:relative focus-visible:z-10",
        className,
      )}
      {...props}
    >
      {children}
      <span
        aria-hidden="true"
        className="shrink-0 font-mono text-[1.3rem] font-normal leading-none transition-transform duration-150 group-data-[state=open]:rotate-45"
      >
        +
      </span>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content ref={ref} className="hf-acc-content overflow-hidden" {...props}>
    <div className={cn("px-6 pb-[26px] text-[0.95rem] leading-[1.6] text-body", className)}>
      {children}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
