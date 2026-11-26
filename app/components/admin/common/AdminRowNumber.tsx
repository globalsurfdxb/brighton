import { cn } from "@/lib/utils/cn";

export default function AdminRowNumber({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full border border-secondary/60 bg-cream-background px-1.5 text-[12px] font-medium tabular-nums text-description-color",
        className,
      )}
    >
      <span className="text-trim">{value}</span>
    </span>
  );
}
