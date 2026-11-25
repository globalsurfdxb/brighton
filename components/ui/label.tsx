"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { cn } from "@/lib/utils/cn";

const labelVariants = cva(
  "font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-semibold",
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants> & {
      main?: boolean;
      oneInput?: boolean;
      isHidden?: boolean;
      onToggleHidden?: () => void;
    }
>(
  (
    { className, main, oneInput, isHidden, onToggleHidden, children, ...props },
    ref,
  ) => (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        labelVariants(),
        main
          ? "pl-5 pr-4 py-4 text-[16px] font-semibold text-primary flex items-center justify-between gap-3"
          : "text-[13px] font-medium text-description-color tracking-wide",
        oneInput ? "font-semibold text-[15px] text-primary" : "",
        className,
      )}
      {...props}
    >
      {children}
      {main && onToggleHidden !== undefined && (
        <span
          role="switch"
          tabIndex={0}
          aria-checked={!isHidden}
          aria-label={isHidden ? "Hidden on the website" : "Visible on the website"}
          title={isHidden ? "Hidden on the website - click to show" : "Visible on the website - click to hide"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleHidden();
          }}
          onKeyDown={(e) => {
            if (e.key !== "Enter" && e.key !== " ") return;
            e.preventDefault();
            e.stopPropagation();
            onToggleHidden();
          }}
          className={cn(
            "inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
            isHidden
              ? "border-secondary/70 bg-cream-background text-description-color hover:border-description-color/50"
              : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300",
          )}
        >
          {isHidden ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
        </span>
      )}
    </LabelPrimitive.Root>
  ),
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
