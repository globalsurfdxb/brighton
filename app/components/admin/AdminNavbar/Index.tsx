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

const AdminNavbar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/4dm1n-br1ght0n/home", icon: Home },
    { name: "About", href: "/4dm1n-br1ght0n/about", icon: Info },
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
    { name: "Blogs", href: "/4dm1n-br1ght0n/blogs", icon: BookOpen },
    { name: "News", href: "/4dm1n-br1ght0n/news", icon: Newspaper },
    { name: "Services", href: "/4dm1n-br1ght0n/services", icon: Briefcase },
    { name: "Projects", href: "/4dm1n-br1ght0n/projects", icon: FolderKanban },
    {
      name: "Digital Catalogue",
      href: "/4dm1n-br1ght0n/digital-catalogue",
      icon: LayoutGrid,
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
    return ownMatch || childMatch;
  };

  const [openLink, setOpenLink] = useState<string | null>(() => {
    const activeParent = navItems.find(
      (item) => item.hasChild && isItemActive(item),
    );
    return activeParent?.href ?? null;
  });

  useEffect(() => {
    const activeParent = navItems.find(
      (item) => item.hasChild && isItemActive(item),
    );
    setOpenLink(activeParent?.href ?? null);
  }, [pathname]);

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