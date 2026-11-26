import type { HeaderData } from "@/app/types/headerFooter";

export type NavDropdownItem = { label: string; href: string };

export type NavItem = {
  label: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: NavDropdownItem[];
};

export type HeaderButton = { text: string; href: string };

export const toNavItems = (header?: HeaderData): NavItem[] =>
  (header?.navItems ?? []).map((item) => {
    const dropdownItems = (item.items ?? []).map((sub) => ({
      label: sub.label ?? "",
      href: sub.link || "#",
    }));
    return {
      label: item.label ?? "",
      href: item.link || "#",
      hasDropdown: dropdownItems.length > 0,
      dropdownItems,
    };
  });
