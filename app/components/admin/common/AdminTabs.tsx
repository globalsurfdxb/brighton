"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type AdminTab<K extends string> = {
  key: K;
  label: string;
  icon?: LucideIcon;
  count?: number;
  edited?: boolean;
};

export default function AdminTabs<K extends string>({
  tabs,
  active,
  onChange,
  label,
  size = "md",
  className,
}: {
  tabs: readonly AdminTab<K>[];
  active: K;
  onChange: (key: K) => void;
  label: string;
  size?: "md" | "sm";
  className?: string;
}) {
  const index = Math.max(
    0,
    tabs.findIndex((t) => t.key === active),
  );

  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn(
        "relative grid w-fit shrink-0 rounded-full border border-secondary/60 bg-white p-1 shadow-[0_1px_2px_rgba(10,10,10,0.04)]",
        className,
      )}
      style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
    >
      <span
        aria-hidden
        className="absolute inset-y-1 left-1 rounded-full bg-primary shadow-[0_6px_14px_-8px_rgba(10,10,10,0.7)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.4,0.5,1)]"
        style={{
          width: `calc((100% - 8px) / ${tabs.length})`,
          transform: `translateX(${index * 100}%)`,
        }}
      />
      {tabs.map(({ key, label: tabLabel, icon: Icon, count, edited }) => {
        const isActive = key === active;
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(key)}
            className={cn(
              "relative z-[1] flex cursor-pointer items-center justify-center rounded-full font-medium outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary/25",
              size === "sm"
                ? "min-w-[100px] gap-1.5 px-3.5 py-1.5 text-[12.5px]"
                : "min-w-[130px] gap-2 px-5 py-2.5 text-[13.5px]",
              isActive
                ? "text-white"
                : "text-description-color hover:text-primary",
            )}
          >
            {Icon && (
              <Icon className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
            )}
            <span className="text-trim">{tabLabel}</span>
            {count !== undefined && (
              <span
                className={cn(
                  "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] transition-colors duration-200",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-cream-background text-description-color",
                )}
              >
                <span className="text-trim">{count}</span>
              </span>
            )}
            {edited && (
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            )}
          </button>
        );
      })}
    </div>
  );
}
