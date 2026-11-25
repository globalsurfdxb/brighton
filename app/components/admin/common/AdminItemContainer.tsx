"use client";

import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface AdminItemContainerProps {
  children: React.ReactNode;
  expansion?: boolean;
}

const AdminItemContainer = ({
  children,
  expansion = true,
}: AdminItemContainerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const childArray = React.Children.toArray(children);
  const [header, ...content] = childArray;

  if (!expansion) {
    return (
      <div className="flex flex-col overflow-hidden rounded-xl border border-secondary/60 bg-white shadow-[0_1px_2px_rgba(10,10,10,0.04)]">
        {header}
        <div className="flex flex-col gap-2">{content}</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border bg-white transition-[border-color,box-shadow] duration-300",
        isExpanded
          ? "border-secondary shadow-[0_10px_30px_-16px_rgba(10,10,10,0.25)]"
          : "border-secondary/60 shadow-[0_1px_2px_rgba(10,10,10,0.04)] hover:border-secondary hover:shadow-[0_6px_18px_-12px_rgba(10,10,10,0.2)]",
      )}
    >
      <div
        onClick={() => setIsExpanded((prev) => !prev)}
        className={cn(
          "relative flex cursor-pointer select-none items-center justify-between transition-colors duration-200",
          isExpanded ? "bg-cream-background/60" : "hover:bg-cream-background/40",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "absolute inset-y-3 left-0 w-[3px] rounded-r-full bg-primary transition-opacity duration-200",
            isExpanded ? "opacity-100" : "opacity-0",
          )}
        />
        <div className="min-w-0 flex-1">{header}</div>

        <button
          type="button"
          aria-label={isExpanded ? "Collapse section" : "Expand section"}
          title={isExpanded ? "Collapse section" : "Expand section"}
          aria-expanded={isExpanded}
          className={cn(
            "mr-4 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
            isExpanded
              ? "border-primary bg-primary text-white"
              : "border-secondary/70 bg-white text-description-color hover:border-primary/40 hover:text-primary",
          )}
        >
          {isExpanded ? (
            <Minus className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </button>
      </div>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-500 ease-in-out",
          isExpanded ? "border-t border-secondary/60" : "border-t-0",
        )}
        style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-2">{content}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminItemContainer;
