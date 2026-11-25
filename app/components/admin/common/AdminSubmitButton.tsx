"use client";

import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function AdminSubmitButton({ saving = false }: { saving?: boolean }) {
  return (
    <button
      type="submit"
      disabled={saving}
      className={cn(
        "group/submit flex h-11 cursor-pointer items-center gap-2.5 rounded-full bg-primary pl-2 pr-5 text-[14px] font-itc-medium uppercase tracking-[0.06em] text-white shadow-[0_8px_20px_-10px_rgba(10,10,10,0.7)] transition-[background-color,box-shadow,transform] duration-200 hover:bg-[#262626] hover:shadow-[0_12px_24px_-10px_rgba(10,10,10,0.75)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-80",
      )}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-colors duration-200 group-hover/submit:bg-white group-hover/submit:text-primary">
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Check className="h-4 w-4" strokeWidth={2.5} />
        )}
      </span>
      <span className="text-trim">{saving ? "Saving" : "Submit"}</span>
    </button>
  );
}
