"use client";

import { usePathname } from "next/navigation";

const BASE = "/4dm1n-br1ght0n";

const SECTIONS: Record<string, { label: string; singular?: string }> = {
  home: { label: "Home" },
  about: { label: "About" },
  products: { label: "Products", singular: "Product" },
  sustainability: { label: "Sustainability" },
  technology: { label: "Technology" },
  "design-philosophy": { label: "Design Philosophy" },
  blogs: { label: "Blogs", singular: "Blog" },
  news: { label: "News", singular: "Article" },
  services: { label: "Services", singular: "Service" },
  projects: { label: "Projects", singular: "Project" },
  "digital-catalogue": { label: "Digital Catalogue" },
  contact: { label: "Contact" },
  settings: { label: "Settings" },
};

const ID_PATTERN = /^[0-9a-fA-F]{24}$|^\d+$/;

const humanize = (segment: string) =>
  segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const getCrumbs = (pathname: string): string[] => {
  const segments = pathname.replace(BASE, "").split("/").filter(Boolean);

  if (segments.length === 0) return ["Home"];

  const [first, ...rest] = segments;
  const section = SECTIONS[first] ?? { label: humanize(first) };
  const crumbs = [section.label];

  const second = rest[0];
  if (!second) return crumbs;

  if (second === "main") {
    crumbs.push("Main Page");
  } else if (second === "enquiries") {
    crumbs.push("Enquiries");
  } else if (ID_PATTERN.test(second)) {
    crumbs.push(`Edit ${section.singular ?? "Item"}`);
  } else {
    crumbs.push(humanize(second));
    if (rest[1] && ID_PATTERN.test(rest[1])) {
      crumbs.push(`Edit ${section.singular ?? "Item"}`);
    }
  }

  return crumbs;
};

const AdminPageHeader = () => {
  const pathname = usePathname() ?? "";
  const crumbs = getCrumbs(pathname);
  const title = crumbs[crumbs.length - 1];

  return (
    <header className="shrink-0 bg-white border-b border-secondary/60 px-8 py-5">
      {crumbs.length > 1 && (
        <div className="flex items-center gap-1.5 text-[12.5px] text-description-color mb-1">
          {crumbs.map((crumb, index) => (
            <span key={index} className="flex items-center gap-1.5">
              {index > 0 && <span className="text-secondary">/</span>}
              <span
                className={
                  index === crumbs.length - 1 ? "text-primary font-medium" : ""
                }
              >
                {crumb}
              </span>
            </span>
          ))}
        </div>
      )}
      <h1 className="text-xl font-semibold text-primary tracking-tight">
        {title}
      </h1>
    </header>
  );
};

export default AdminPageHeader;
