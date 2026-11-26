import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";

export default function AdminSectionCard({
  title,
  count,
  description,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title: React.ReactNode;
  count?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-secondary/60 bg-white p-5 shadow-[0_1px_2px_rgba(10,10,10,0.04)]",
        className,
      )}
    >
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-secondary/60 pb-3">
        <div className="flex min-w-0 flex-col gap-1.5">
          <Label className="!text-xl !font-semibold">
            {title}
            {count !== undefined && <> ({count})</>}
          </Label>
          {description && (
            <p className="max-w-[80ch] text-[13px] text-description-color">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="ml-auto flex items-center gap-3">{actions}</div>
        )}
      </div>
      <div className={cn("flex flex-col gap-4", bodyClassName)}>{children}</div>
    </section>
  );
}
