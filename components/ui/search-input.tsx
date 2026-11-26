import * as React from "react";
import { RiSearchLine } from "react-icons/ri";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

const SearchInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & { wrapperClassName?: string }
>(({ className, wrapperClassName, children, ...props }, ref) => (
  <div className={cn("relative", wrapperClassName)}>
    <RiSearchLine
      size={16}
      aria-hidden
      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-description-color/70"
    />
    <Input
      ref={ref}
      className={cn("pl-9 pt-[10px] pb-[6px]", className)}
      {...props}
    />
    {children}
  </div>
));
SearchInput.displayName = "SearchInput";

export { SearchInput };
