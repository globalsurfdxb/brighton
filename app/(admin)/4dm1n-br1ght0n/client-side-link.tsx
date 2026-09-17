"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { memo } from "react";
import { MdExpandCircleDown } from "react-icons/md";

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
  const pathname = usePathname();

  const isActive =
    isActiveOverride ?? (pathname === href || pathname?.startsWith(`${href}/`));

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

  return (
    <>
      <Link
        href={href == "/admin/logout" ? "#" : href}
        onClick={() => {
          setOpenLink?.(isOpen ? null : href);
          if (href === "/admin/logout") {
            handleLogout();
            return;
          }
        }}
        className={cn(
          "flex items-center px-4 py-2.5 rounded-[8px] transition-colors font-itc-medium justify-between text-[14px]",
          "hover:text-white btn-fill-center",
          isActive
            ? "bg-primary text-white shadow-sm"
            : "text-description-color bg-white",
          className,
        )}
        style={{ "--fill-color": "#0A0A0A" } as React.CSSProperties}
      >
        <div className="flex items-center">
          <span className="mr-3">{icon}</span>
          {name}
        </div>
        {hasChild && (
          <MdExpandCircleDown
            className={cn(
              "ml-1 mt-1 transition-transform duration-300 ease-in-out",
              isOpen && "rotate-180",
            )}
          />
        )}
      </Link>
      {children && (
        <div
          className="grid transition-[grid-template-rows] duration-400 ease-in-out"
          style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            <div className="flex pl-8 pr-1 py-1 my-1 flex-col items-start gap-0.5 border-l border-secondary/60 ml-6">
              {(() => {
                const bestMatch = children.reduce<string | null>(
                  (best, child) => {
                    const matches =
                      pathname === child.href ||
                      pathname?.startsWith(`${child.href}/`);
                    if (!matches) return best;
                    if (!best || child.href.length > best.length) {
                      return child.href;
                    }
                    return best;
                  },
                  null,
                );
                return children.map((item, index) => {
                  const isChildActive = item.href === bestMatch;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 w-full"
                    >
                      <div
                        className={cn(
                          "w-1.5 h-1.5 rounded-full shrink-0",
                          isChildActive
                            ? "bg-primary"
                            : "bg-description-color/40",
                        )}
                      />
                      <Link
                        href={item.href}
                        className={cn(
                          "w-full rounded-[6px] font-itc-medium flex items-center cursor-pointer text-[13.5px] px-2 py-2 transition-colors hover:text-primary",
                          isChildActive
                            ? "text-primary font-semibold"
                            : "text-description-color/80",
                        )}
                      >
                        <span className="text-trim">{item.name}</span>
                      </Link>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default memo(ClientSideLink);
