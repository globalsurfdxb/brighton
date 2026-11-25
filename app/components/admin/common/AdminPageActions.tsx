"use client";

import { ReactNode, useRef } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { UnsavedChange } from "./useUnsavedChanges";
import UnsavedLeaveGuard from "./UnsavedLeaveGuard";

interface AdminPageActionsProps {
  children: ReactNode;
  isDirty?: boolean;
  changes?: UnsavedChange[];
  className?: string;
}

const AdminPageActions = ({
  children,
  isDirty = false,
  changes = [],
  className,
}: AdminPageActionsProps) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={cn(
        "fixed top-0 right-8 z-40 flex h-[88px] items-center gap-5",
        className,
      )}
    >
      {isDirty && (
        <div className="group/unsaved relative">
          <span
            role="status"
            tabIndex={0}
            className="flex cursor-default items-center gap-1.5 whitespace-nowrap rounded-full border border-amber-200 bg-amber-50 py-1.5 pl-2.5 pr-3 text-[12px] font-medium leading-none text-amber-700 outline-none transition-colors group-hover/unsaved:border-amber-300 group-hover/unsaved:bg-amber-100/70 focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
            </span>
            <span className="text-trim">
              Unsaved changes{changes.length > 0 ? ` · ${changes.length}` : ""}
            </span>
          </span>

          {changes.length > 0 && (
            <div className="pointer-events-none absolute right-0 top-full z-50 pt-3 opacity-0 transition-opacity duration-150 group-focus-within/unsaved:pointer-events-auto group-focus-within/unsaved:opacity-100 group-hover/unsaved:pointer-events-auto group-hover/unsaved:opacity-100">
              <div className="relative w-[300px] origin-top-right -translate-y-1 scale-95 rounded-2xl border border-secondary/60 bg-white shadow-[0_20px_44px_-18px_rgba(10,10,10,0.35)] transition-transform duration-150 ease-out group-focus-within/unsaved:translate-y-0 group-focus-within/unsaved:scale-100 group-hover/unsaved:translate-y-0 group-hover/unsaved:scale-100 group-hover/unsaved:duration-500 group-hover/unsaved:ease-[cubic-bezier(0.34,1.6,0.5,1)]">
                <span className="absolute -top-[6px] right-8 h-3 w-3 rotate-45 rounded-[2px] border-l border-t border-secondary/60 bg-white" />
                <div className="flex items-center justify-between border-b border-secondary/50 px-4 py-3">
                  <span className="text-trim text-[11px] font-semibold uppercase tracking-[0.14em] text-description-color/80">
                    Edited sections
                  </span>
                  <span className="text-trim rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700">
                    {changes.length}
                  </span>
                </div>
                <ul className="flex max-h-[320px] flex-col gap-1 overflow-y-auto p-2">
                  {changes.map(({ section, fields }) => (
                    <li key={section} className="rounded-xl px-2.5 py-2.5 transition-colors hover:bg-cream-background">
                      <div className="flex items-center gap-2.5">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                        <span className="text-trim text-[13px] font-medium text-primary">
                          {section}
                        </span>
                      </div>
                      {fields.length > 0 && (
                        <ul className="ml-[3px] mt-2 flex flex-col gap-1.5 border-l border-secondary/60 pl-[15px]">
                          {fields.slice(0, 5).map((field) => (
                            <li
                              key={field}
                              className="truncate text-[12px] leading-[1.35] text-description-color"
                            >
                              {field}
                            </li>
                          ))}
                          {fields.length > 5 && (
                            <li className="text-trim py-0.5 text-[12px] text-description-color/70">
                              +{fields.length - 5} more
                            </li>
                          )}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 border-t border-secondary/50 px-4 py-3 text-[11.5px] text-description-color">
                  <Check className="h-3.5 w-3.5 shrink-0" />
                  <span className="text-trim">Press Submit to save these changes</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {children}
      <UnsavedLeaveGuard
        active={isDirty}
        sections={changes.map((change) => change.section)}
        actionsRef={ref}
      />
    </div>
  );
};

export default AdminPageActions;
