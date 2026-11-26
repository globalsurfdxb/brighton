import { cn } from "@/lib/utils/cn";

type Variant = "form" | "list";

function Bar({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={cn("admin-skeleton block rounded-md", className)}
      style={style}
    />
  );
}

function FormSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="overflow-hidden rounded-xl border border-secondary/60 bg-white shadow-[0_1px_2px_rgba(10,10,10,0.04)]">
        <div className="flex items-center justify-between border-b border-secondary/60 px-5 py-4">
          <Bar className="h-4 w-36" />
        </div>
        <div className="grid grid-cols-2 gap-4 p-5">
          <div className="flex flex-col gap-3">
            <Bar className="h-3 w-16" />
            <Bar className="h-[140px] w-full rounded-xl" />
            <Bar className="h-3 w-14" />
            <Bar className="h-10 w-full" />
          </div>
          <div className="flex flex-col gap-3">
            <Bar className="h-3 w-12" />
            <Bar className="h-10 w-full" />
          </div>
        </div>
      </div>
      {[44, 36, 52, 40, 30].map((w, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-xl border border-secondary/60 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(10,10,10,0.04)]"
        >
          <Bar className="h-4" style={{ width: `${w * 3}px` }} />
          <Bar className="h-8 w-8 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Bar className="h-10 w-[280px] rounded-lg" />
        <Bar className="h-10 w-32 rounded-lg" />
      </div>
      <div className="overflow-hidden rounded-xl border border-secondary/60 bg-white shadow-[0_1px_2px_rgba(10,10,10,0.04)]">
        <div className="flex items-center gap-6 border-b border-secondary/60 bg-cream-background/50 px-5 py-3.5">
          <Bar className="h-3 w-24" />
          <Bar className="h-3 w-16" />
          <Bar className="ml-auto h-3 w-14" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-secondary/40 px-5 py-4 last:border-b-0"
          >
            <Bar className="h-10 w-10 shrink-0 rounded-lg" />
            <div className="flex flex-1 flex-col gap-2">
              <Bar className="h-3.5" style={{ width: `${40 + ((i * 17) % 35)}%` }} />
              <Bar className="h-3 w-24" />
            </div>
            <Bar className="h-8 w-8 rounded-full" />
            <Bar className="h-8 w-8 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminSkeleton({ variant = "form" }: { variant?: Variant }) {
  return (
    <div role="status" aria-live="polite" aria-label="Loading content">
      {variant === "list" ? <ListSkeleton /> : <FormSkeleton />}
    </div>
  );
}

export default function AdminLoadable({
  loading,
  variant = "form",
  fill = false,
  children,
}: {
  loading: boolean;
  variant?: Variant;
  fill?: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      {loading && <AdminSkeleton variant={variant} />}
      <div
        inert={loading}
        aria-hidden={loading}
        className={cn(
          loading
            ? "pointer-events-none h-0 overflow-hidden opacity-0"
            : "animate-[adminFadeIn_0.35s_ease-out]",
          fill && !loading && "flex h-full min-h-0 flex-col",
        )}
      >
        {children}
      </div>
    </>
  );
}
