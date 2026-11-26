"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "outline";

export default function AdminButton({
  children,
  icon: Icon,
  variant = "primary",
  className,
  type = "button",
  ...props
}: React.ComponentProps<"button"> & { icon?: LucideIcon; variant?: Variant }) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full px-4.5 text-[13.5px] font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 disabled:pointer-events-none disabled:opacity-45",
        variant === "primary"
          ? "bg-primary text-white shadow-[0_8px_20px_-12px_rgba(10,10,10,0.7)] hover:bg-[#262626]"
          : "border border-secondary/70 bg-white text-primary shadow-sm hover:border-primary/40 hover:bg-cream-background/60",
        className,
      )}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span className="text-trim">{children}</span>
    </button>
  );
}
