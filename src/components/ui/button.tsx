import type { ComponentProps } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium touch-manipulation transition-[opacity,transform,background-color] duration-75 ease-out active:enabled:scale-[0.96] disabled:opacity-40 disabled:pointer-events-none select-none",
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-fg hover:opacity-90 active:enabled:opacity-80",
        outline:
          "bg-transparent text-fg shadow-[var(--shadow-border)] hover:bg-raised active:enabled:bg-raised",
        ghost: "bg-transparent text-muted hover:text-fg hover:bg-raised active:enabled:bg-raised",
      },
      size: {
        sm: "h-9 px-3 text-sm rounded-sm",
        md: "h-11 px-4 text-sm rounded-md min-h-11",
        lg: "h-12 px-5 rounded-md min-h-12",
        icon: "size-11 rounded-md",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild,
  ...props
}: ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
