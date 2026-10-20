"use client";

import ClientSideLink from "@/app/(admin)/4dm1n-br1ght0n/client-side-link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
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
  Settings,
  Phone,
} from "lucide-react";

type Category = { _id: string; title: string; slug: string };

const AdminNavbar = () => {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/admin/products/category")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => {});
  }, []);

  const navItems: {
    name: string;
    href: string;
    icon: typeof Home;
    hasChild?: boolean;
    activePrefix?: string;
    children?: { name: string; href: string }[];
  }[] = [
    { name: "Home", href: "/4dm1n-br1ght0n/home", icon: Home },
    { name: "About", href: "/4dm1n-br1ght0n/about", icon: Info },
    {
      name: "Products",
      href: "/4dm1n-br1ght0n/products/main",
      icon: Info,
      hasChild: true,
      children: [
        { name: "Main Page", href: "/4dm1n-br1ght0n/products/main" },
        ...categories.map((cat) => ({
          name: cat.title,
          href: `/4dm1n-br1ght0n/products/${cat.slug}`,
        })),
      ],
    },
    {
      name: "Sustainability",
      href: "/4dm1n-br1ght0n/sustainability",
      icon: Leaf,
    },
    { name: "Technology", href: "/4dm1n-br1ght0n/technology", icon: Cpu },
    {
      name: "Design Philosophy",
      href: "/4dm1n-br1ght0n/design-philosophy",
      icon: Compass,
    },
    {
      name: "Blogs",
      href: "/4dm1n-br1ght0n/blogs/main",
      icon: BookOpen,
      hasChild: true,
      activePrefix: "/4dm1n-br1ght0n/blogs",
      children: [
        { name: "Main Page", href: "/4dm1n-br1ght0n/blogs/main" },
        { name: "Blog List", href: "/4dm1n-br1ght0n/blogs/list" },
      ],
    },
    {
      name: "News",
      href: "/4dm1n-br1ght0n/news/main",
      icon: Newspaper,
      hasChild: true,
      activePrefix: "/4dm1n-br1ght0n/news",
      children: [
        { name: "Main Page", href: "/4dm1n-br1ght0n/news/main" },
        { name: "News List", href: "/4dm1n-br1ght0n/news/list" },
      ],
    },
    { name: "Services", href: "/4dm1n-br1ght0n/services", icon: Briefcase },
    {
      name: "Projects",
      href: "/4dm1n-br1ght0n/projects/main",
      icon: FolderKanban,
      hasChild: true,
      // keeps the parent highlighted on /projects/[id] detail pages too
      activePrefix: "/4dm1n-br1ght0n/projects",
      children: [
        { name: "Main Page", href: "/4dm1n-br1ght0n/projects/main" },
        { name: "Project List", href: "/4dm1n-br1ght0n/projects/list" },
      ],
    },
    {
      name: "Digital Catalogue",
      href: "/4dm1n-br1ght0n/digital-catalogue",
      icon: LayoutGrid,
      hasChild: true,
      children: [
        { name: "Page", href: "/4dm1n-br1ght0n/digital-catalogue" },
        {
          name: "Requests",
          href: "/4dm1n-br1ght0n/digital-catalogue/requests",
        },
      ],
    },
    {
      name: "Contact",
      href: "/4dm1n-br1ght0n/contact",
      icon: Phone,
      hasChild: true,
      children: [
        { name: "Main Page", href: "/4dm1n-br1ght0n/contact" },
        { name: "Enquiries", href: "/4dm1n-br1ght0n/contact/enquiries" },
      ],
    },
    { name: "Settings", href: "/4dm1n-br1ght0n/settings", icon: Settings },
  ];

  const isItemActive = (item: (typeof navItems)[number]) => {
    const ownMatch =
      pathname === item.href || pathname?.startsWith(`${item.href}/`);
    const childMatch = item.children?.some(
      (child) =>
        pathname === child.href || pathname?.startsWith(`${child.href}/`),
    );
    const prefixMatch =
      !!item.activePrefix && !!pathname?.startsWith(`${item.activePrefix}/`);
    return ownMatch || childMatch || prefixMatch;
  };

  const [openLink, setOpenLink] = useState<string | null>(null);

  useEffect(() => {
    const activeParent = navItems.find(
      (item) => item.hasChild && isItemActive(item),
    );
    setOpenLink(activeParent?.href ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, categories]);

  return navItems.map((item, index) => {
    const Icon = item.icon;
    return (
      <ClientSideLink
        key={index}
        href={item.href}
        name={item.name}
        icon={<Icon className="h-5 w-5" />}
        isOpen={openLink === item.href}
        setOpenLink={setOpenLink}
        hasChild={item.hasChild}
        isActiveOverride={isItemActive(item)}
      >
        {item.children}
      </ClientSideLink>
    );
  });
};

export default AdminNavbar;
