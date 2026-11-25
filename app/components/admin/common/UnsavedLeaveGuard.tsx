"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type Pending = { href: string } | { element: HTMLElement };

export default function UnsavedLeaveGuard({
  active,
  sections,
  actionsRef,
}: {
  active: boolean;
  sections: string[];
  actionsRef: RefObject<HTMLElement | null>;
}) {
  const router = useRouter();
  const [pending, setPending] = useState<Pending | null>(null);
  const bypass = useRef(false);

  useEffect(() => {
    if (!active) return;

    const onClick = (e: MouseEvent) => {
      if (bypass.current || e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (!target || target.closest("[role=dialog]")) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (anchor) {
        if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
        const url = new URL(anchor.href, window.location.href);
        if (url.origin !== window.location.origin) return;
        if (url.pathname === window.location.pathname && url.search === window.location.search) return;
        e.preventDefault();
        e.stopPropagation();
        setPending({ href: url.pathname + url.search + url.hash });
        return;
      }

      const guarded =
        target.closest<HTMLElement>("[data-unsaved-guard]") ??
        (actionsRef.current?.contains(target)
          ? target.closest<HTMLElement>('button[type="button"]')
          : null);
      if (guarded) {
        e.preventDefault();
        e.stopPropagation();
        setPending({ element: guarded });
      }
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [active, actionsRef]);

  const leave = () => {
    const next = pending;
    setPending(null);
    if (!next) return;
    if ("href" in next) {
      router.push(next.href);
    } else {
      bypass.current = true;
      next.element.click();
      bypass.current = false;
    }
  };

  const shown = sections.slice(0, 4);

  return (
    <Dialog open={!!pending} onOpenChange={(open) => !open && setPending(null)}>
      <DialogContent className="max-w-[420px] gap-0 overflow-hidden rounded-2xl p-0">
        <div className="flex flex-col items-center px-7 pb-6 pt-8 text-center">
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600 ring-8 ring-amber-50/50">
            <AlertTriangle className="h-6 w-6" strokeWidth={1.75} />
          </span>
          <DialogTitle className="mt-5 text-[19px]">Leave without saving?</DialogTitle>
          <DialogDescription className="mt-2.5 max-w-[32ch] leading-relaxed">
            You have unsaved changes on this page. If you leave now, they will be lost.
          </DialogDescription>

          {shown.length > 0 && (
            <div className="mt-5 flex w-full flex-wrap justify-center gap-1.5 rounded-xl bg-cream-background/70 p-3">
              {shown.map((section) => (
                <span
                  key={section}
                  className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-white px-2.5 py-1.5 text-[12px] text-primary"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span className="text-trim">{section}</span>
                </span>
              ))}
              {sections.length > shown.length && (
                <span className="flex items-center rounded-full px-2 py-1.5 text-[12px] text-description-color">
                  <span className="text-trim">+{sections.length - shown.length} more</span>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-secondary/50 bg-cream-background/50 px-6 py-4">
          <button
            type="button"
            autoFocus
            onClick={() => setPending(null)}
            className="h-11 cursor-pointer rounded-full border border-secondary/70 bg-white text-sm font-medium text-primary transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10"
          >
            Stay on page
          </button>
          <button
            type="button"
            onClick={leave}
            className="h-11 cursor-pointer rounded-full bg-red-600 text-sm font-medium text-white shadow-[0_8px_18px_-10px_rgba(220,38,38,0.8)] transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200"
          >
            Leave anyway
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
