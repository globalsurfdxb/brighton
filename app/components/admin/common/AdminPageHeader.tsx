"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminVisitLink } from "@/app/components/admin/common/AdminVisitLink";
import {
  BookOpen,
  Briefcase,
  ArrowUpRight,
  ChevronRight,
  Compass,
  Cpu,
  FolderKanban,
  Home,
  Info,
  LayoutDashboard,
  LayoutGrid,
  Leaf,
  Mail,
  Newspaper,
  Package,
  Settings,
  type LucideIcon,
} from "lucide-react";

const BASE = "/4dm1n-br1ght0n";

const SECTIONS: Record<
  string,
  { label: string; icon: LucideIcon; singular?: string; listLabel?: string }
> = {
  home: { label: "Home", icon: Home },
  about: { label: "About", icon: Info },
  products: { label: "Products", icon: Package, singular: "Product" },
  sustainability: { label: "Sustainability", icon: Leaf },
  technology: { label: "Technology", icon: Cpu },
  "design-philosophy": { label: "Design Philosophy", icon: Compass },
  blogs: {
    label: "Blogs",
    icon: BookOpen,
    singular: "Blog",
    listLabel: "Blog List",
  },
  news: {
    label: "News",
    icon: Newspaper,
    singular: "Article",
    listLabel: "News List",
  },
  services: { label: "Services", icon: Briefcase, singular: "Service" },
  projects: {
    label: "Projects",
    icon: FolderKanban,
    singular: "Project",
    listLabel: "Project List",
  },
  "digital-catalogue": { label: "Digital Catalogue", icon: LayoutGrid },
  contact: { label: "Contact", icon: Mail },
  settings: { label: "Settings", icon: Settings },
};

const ID_PATTERN = /^[0-9a-fA-F]{24}$|^\d+$/;

const humanize = (segment: string) =>
  segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const getCrumbs = (pathname: string): string[] => {
  const segments = pathname.replace(BASE, "").split("/").filter(Boolean);

  if (segments.length === 0) return [];

  const [first, ...rest] = segments;
  const section = SECTIONS[first];
  const crumbs = [section?.label ?? humanize(first)];

  const second = rest[0];
  if (!second) return crumbs;

  if (second === "main") {
    crumbs.push("Main Page");
  } else if (second === "list" && section?.listLabel) {
    crumbs.push(section.listLabel);
  } else if (second === "enquiries") {
    crumbs.push("Enquiries");
  } else if (ID_PATTERN.test(second)) {
    crumbs.push(`Edit ${section?.singular ?? "Item"}`);
  } else {
    crumbs.push(humanize(second));
    if (rest[1] && ID_PATTERN.test(rest[1])) {
      crumbs.push(`Edit ${section?.singular ?? "Item"}`);
    }
  }

  return crumbs;
};

const AdminPageHeader = () => {
  const pathname = usePathname() ?? "";
  const visitHref = useAdminVisitLink();
  const isDashboard = pathname === BASE || pathname === `${BASE}/`;
  const crumbs = getCrumbs(pathname);
  const sectionKey = pathname.replace(BASE, "").split("/").filter(Boolean)[0];
  const Icon = isDashboard
    ? LayoutDashboard
    : (SECTIONS[sectionKey ?? ""]?.icon ?? LayoutDashboard);
  const title = isDashboard ? "Dashboard" : crumbs[crumbs.length - 1];

  return (
    <header className="relative flex h-[88px] shrink-0 items-center border-b border-secondary/50 bg-white/85 px-8 shadow-[0_6px_20px_-16px_rgba(10,10,10,0.25)] backdrop-blur-xl backdrop-saturate-150">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
      />

      <div className="flex min-w-0 items-center gap-4">
        <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2b2b2b] to-primary text-white shadow-[0_10px_22px_-10px_rgba(10,10,10,0.7),inset_0_1px_0_rgba(255,255,255,0.14)] ring-1 ring-black/5">
          <Icon className="h-[22px] w-[22px]" strokeWidth={1.75} />
        </span>

        <span aria-hidden className="h-9 w-px shrink-0 bg-secondary/60" />

        <div className="flex min-w-0 flex-col gap-1.5">
          {isDashboard ? (
            <p
              className="truncate text-[11px] font-medium uppercase tracking-[0.14em] text-description-color/80"
              suppressHydrationWarning
            >
              {new Date().toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          ) : (
            <nav
              aria-label="Breadcrumb"
              className="flex min-w-0 items-center gap-1.5 text-[11px] font-medium uppercase leading-none tracking-[0.14em]"
            >
              <Link
                href={BASE}
                className="flex shrink-0 items-center gap-1 text-description-color/70 transition-colors hover:text-primary"
              >
                <Home className="h-3 w-3" />
                <span className="text-trim">Admin</span>
              </Link>
              {crumbs.map((crumb, index) => {
                const last = index === crumbs.length - 1;
                return (
                  <span
                    key={`${crumb}-${index}`}
                    className="flex min-w-0 items-center gap-1.5"
                  >
                    <ChevronRight className="h-3 w-3 shrink-0 text-secondary" />
                    <span
                      className={
                        last
                          ? "text-trim truncate text-primary"
                          : "text-trim truncate text-description-color/70"
                      }
                      aria-current={last ? "page" : undefined}
                    >
                      {crumb}
                    </span>
                  </span>
                );
              })}
            </nav>
          )}

          <div className="flex min-w-0 items-center gap-3">
            <h1 className="truncate text-[22px] font-semibold leading-none tracking-tight text-primary">
              {title}
            </h1>
            {visitHref && (
              <a
                href={visitHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open this page on the website"
                className="group/visit relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-secondary/70 bg-white text-description-color transition-colors hover:border-primary hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
              >
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/visit:-translate-y-px group-hover/visit:translate-x-px" />
                <span
                  role="tooltip"
                  className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 flex origin-left -translate-x-1.5 -translate-y-1/2 scale-90 items-center whitespace-nowrap rounded-xl border border-secondary/60 bg-white px-3.5 py-2.5 opacity-0 shadow-[0_12px_32px_-12px_rgba(10,10,10,0.28)] transition-[opacity,transform] duration-150 ease-out group-hover/visit:translate-x-0 group-hover/visit:scale-100 group-hover/visit:opacity-100 group-hover/visit:duration-500 group-hover/visit:ease-[cubic-bezier(0.34,1.7,0.5,1)] group-focus-visible/visit:translate-x-0 group-focus-visible/visit:scale-100 group-focus-visible/visit:opacity-100"
                >
                  <span className="absolute -left-[5px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 rounded-[2px] border-b border-l border-secondary/60 bg-white" />
                  <span className="text-trim relative text-[12.5px] font-medium text-primary">
                    View on website
                  </span>
                </span>
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminPageHeader;
