"use client";

import ClientSideLink from "@/app/(admin)/4dm1n-br1ght0n/client-side-link";
import { useAdminSidebar } from "@/app/components/admin/AdminNavbar/AdminShell";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Home,
  Info,
  Leaf,
  Cpu,
  Compass,
  BookOpen,
  Newspaper,
  Briefcase,
  FolderKanban,
  LayoutGrid,
  Package,
  Settings,
  Mail,
  PanelsTopLeft,
} from "lucide-react";

type Category = { _id: string; title: string; slug: string };

type NavItem = {
  name: string;
  href: string;
  icon: typeof Home;
  exact?: boolean;
  hasChild?: boolean;
  activePrefix?: string;
  children?: { name: string; href: string }[];
};
type NavGroup = { label: string; items: NavItem[] };

const BASE = "/4dm1n-br1ght0n";

const AdminNavbar = () => {
  const pathname = usePathname() ?? "";
  const { collapsed } = useAdminSidebar();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/admin/products/category")
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const navGroups: NavGroup[] = [
    {
      label: "Overview",
      items: [
        { name: "Dashboard", href: BASE, icon: LayoutDashboard, exact: true },
      ],
    },
    {
      label: "Pages",
      items: [
        { name: "Home", href: `${BASE}/home`, icon: Home },
        { name: "About", href: `${BASE}/about`, icon: Info },
        { name: "Sustainability", href: `${BASE}/sustainability`, icon: Leaf },
        { name: "Technology", href: `${BASE}/technology`, icon: Cpu },
        {
          name: "Design Philosophy",
          href: `${BASE}/design-philosophy`,
          icon: Compass,
        },
        { name: "Services", href: `${BASE}/services`, icon: Briefcase },
      ],
    },
    {
      label: "Content",
      items: [
        {
          name: "Products",
          href: `${BASE}/products/main`,
          icon: Package,
          hasChild: true,
          activePrefix: `${BASE}/products`,
          children: [
            { name: "Main Page", href: `${BASE}/products/main` },
            ...categories.map((cat) => ({
              name: cat.title,
              href: `${BASE}/products/${cat.slug}`,
            })),
          ],
        },
        {
          name: "Projects",
          href: `${BASE}/projects/main`,
          icon: FolderKanban,
          hasChild: true,
          activePrefix: `${BASE}/projects`,
          children: [
            { name: "Main Page", href: `${BASE}/projects/main` },
            { name: "Project List", href: `${BASE}/projects/list` },
          ],
        },
        {
          name: "Blogs",
          href: `${BASE}/blogs/main`,
          icon: BookOpen,
          hasChild: true,
          activePrefix: `${BASE}/blogs`,
          children: [
            { name: "Main Page", href: `${BASE}/blogs/main` },
            { name: "Blog List", href: `${BASE}/blogs/list` },
          ],
        },
        {
          name: "News",
          href: `${BASE}/news/main`,
          icon: Newspaper,
          hasChild: true,
          activePrefix: `${BASE}/news`,
          children: [
            { name: "Main Page", href: `${BASE}/news/main` },
            { name: "News List", href: `${BASE}/news/list` },
          ],
        },
      ],
    },
    {
      label: "Engagement",
      items: [
        {
          name: "Digital Catalogue",
          href: `${BASE}/digital-catalogue`,
          icon: LayoutGrid,
          hasChild: true,
          children: [
            { name: "Page", href: `${BASE}/digital-catalogue` },
            { name: "Requests", href: `${BASE}/digital-catalogue/requests` },
          ],
        },
        {
          name: "Contact",
          href: `${BASE}/contact`,
          icon: Mail,
          hasChild: true,
          children: [
            { name: "Main Page", href: `${BASE}/contact` },
            { name: "Enquiries", href: `${BASE}/contact/enquiries` },
          ],
        },
      ],
    },
    {
      label: "Site",
      items: [
        {
          name: "Header & Footer",
          href: `${BASE}/header-footer`,
          icon: PanelsTopLeft,
        },
        { name: "Settings", href: `${BASE}/settings`, icon: Settings },
      ],
    },
  ];

  const matches = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const isItemActive = (item: NavItem) => {
    if (item.exact) return pathname === item.href;
    return (
      matches(item.href) ||
      !!item.children?.some((child) => matches(child.href)) ||
      (!!item.activePrefix && pathname.startsWith(`${item.activePrefix}/`))
    );
  };

  const activeParentHref =
    navGroups
      .flatMap((group) => group.items)
      .find((item) => item.hasChild && isItemActive(item))?.href ?? null;
  const navKey = `${pathname}|${categories.length}`;
  const [openLink, setOpenLink] = useState<string | null>(activeParentHref);
  const [prevNavKey, setPrevNavKey] = useState(navKey);
  if (prevNavKey !== navKey) {
    setPrevNavKey(navKey);
    setOpenLink(activeParentHref);
  }

  return (
    <div className="flex flex-col gap-5">
      {navGroups.map((group) => (
        <div key={group.label}>
          {collapsed ? (
            <div className="mx-auto mb-2 h-px w-6 bg-white/25" aria-hidden />
          ) : (
            <p className="mb-1.5 whitespace-nowrap px-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/60">
              <span className="text-trim block">{group.label}</span>
            </p>
          )}
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <ClientSideLink
                  key={item.href}
                  href={item.href}
                  name={item.name}
                  icon={<Icon className="h-[18px] w-[18px]" />}
                  isOpen={openLink === item.href}
                  setOpenLink={setOpenLink}
                  hasChild={item.hasChild}
                  isActiveOverride={isItemActive(item)}
                >
                  {item.children}
                </ClientSideLink>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminNavbar;
