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
          onClick={(e) => {
            e.preventDefault();
            onToggleHidden();
          }}
          className="cursor-pointer p-1 rounded-full hover:bg-cream-background hover:scale-110 transition-all duration-300 ease-in-out"
        >
          {isHidden ? (
            <RiEyeOffLine className="text-gray-500" size={20} />
          ) : (
            <RiEyeLine className="text-green-600" size={20} />
          )}
        </span>
      )}
    </LabelPrimitive.Root>
  ),
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
