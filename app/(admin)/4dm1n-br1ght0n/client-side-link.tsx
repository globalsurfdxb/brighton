"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { memo } from "react";
import { ChevronDown } from "lucide-react";
import { useAdminSidebar } from "@/app/components/admin/AdminNavbar/AdminShell";

interface ClientSideLinkProps {
  href: string;
  name: string;
  icon: React.ReactNode;
  className?: string;
  children?: { href: string; name: string }[];
  isOpen?: boolean;
  setOpenLink?: (href: string | null) => void;
  hasChild?: boolean;
  isActiveOverride?: boolean;
}

const matches = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

function ClientSideLink({
  href,
  name,
  icon,
  className,
  children,
  isOpen = false,
  setOpenLink,
  hasChild = false,
  isActiveOverride,
}: ClientSideLinkProps) {
  const pathname = usePathname() ?? "";
  const { collapsed, setCollapsed } = useAdminSidebar();
  const isLogout = href === "/admin/logout";

  const isActive = !isLogout && (isActiveOverride ?? matches(pathname, href));

  const activeChildHref = children
    ?.filter((child) => matches(pathname, child.href))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        window.location.href = "/4dm1n-br1ght0n/login";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const rowClass = cn(
    "group relative flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-2 py-1 font-itc-medium text-[14px] transition-all duration-200",
    collapsed && "justify-center px-0 py-1.5",
    isActive
      ? "bg-white text-primary shadow-[0_8px_20px_-8px_rgba(0,0,0,0.6)]"
      : "text-white/70 hover:bg-white/[0.07] hover:text-white",
    className,
  );

  const content = (
    <>
      <span className="flex min-w-0 items-center gap-3">
        <span
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
            isActive
              ? "bg-primary text-white shadow-[0_3px_8px_-2px_rgba(0,0,0,0.45)]"
              : isLogout
                ? "text-inherit"
                : "text-white/55 group-hover:bg-white/10 group-hover:text-white",
          )}
        >
          {icon}
        </span>
        <span className={cn("text-trim whitespace-nowrap", collapsed && "sr-only")}>
          {name}
        </span>
      </span>
      {hasChild && !collapsed && (
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-200",
            isActive ? "text-primary/50" : "text-white/40",
            isOpen && "rotate-180",
          )}
        />
      )}
    </>
  );

  return (
    <div>
      {hasChild ? (
        <button
          type="button"
          className={rowClass}
          title={collapsed ? name : undefined}
          aria-expanded={isOpen && !collapsed}
          onClick={() => {
            if (collapsed) {
              setCollapsed(false);
              setOpenLink?.(href);
              return;
            }
            setOpenLink?.(isOpen ? null : href);
          }}
        >
          {content}
        </button>
      ) : isLogout ? (
        <button
          type="button"
          className={rowClass}
          onClick={handleLogout}
          data-unsaved-guard
          title={collapsed ? name : undefined}
        >
          {content}
        </button>
      ) : (
        <Link
          href={href}
          className={rowClass}
          title={collapsed ? name : undefined}
        >
          {content}
        </Link>
      )}

      {hasChild && children && !collapsed && (
        <div
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="overflow-hidden">
            <div className="mb-1 ml-[21px] mt-1 flex flex-col gap-0.5 border-l border-white/15 pl-3">
              {children.map((item) => {
                const isChildActive = item.href === activeChildHref;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    tabIndex={isOpen ? 0 : -1}
                    className={cn(
                      "relative rounded-md px-3 py-1 font-itc-medium text-[13px] transition-colors",
                      isChildActive
                        ? "bg-white/[0.12] text-white"
                        : "text-white/60 hover:bg-white/[0.06] hover:text-white",
                    )}
                  >
                    {isChildActive && (
                      <span className="absolute -left-[16.5px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_3px_rgba(255,255,255,0.18)]" />
                    )}
                    <span className="text-trim block truncate py-1">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(ClientSideLink);
