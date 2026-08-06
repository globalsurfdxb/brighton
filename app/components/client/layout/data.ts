export interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

export const navItems: NavItem[] = [
  { label: "Interior", href: "#", hasDropdown: true },
  { label: "Exterior", href: "#", hasDropdown: true },
  { label: "Projects", href: "#", hasDropdown: true },
  { label: "Services", href: "#", hasDropdown: true },
  { label: "Resources", href: "#", hasDropdown: true },
  { label: "Media", href: "#", hasDropdown: true },
  { label: "About", href: "#", hasDropdown: true },
];


export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export const footerColumns: FooterColumn[] = [
  {
    title: "Products",
    links: [
      { label: "Interior Lighting", href: "#" },
      { label: "Exterior Lighting", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Digital Catalogue", href: "#" },
      { label: "Downloads Hub", href: "#" },
      { label: "Projects", href: "#" },
    ],
  },
  {
    title: "About Brighton",
    links: [
      { label: "Overview", href: "#" },
      { label: "Design Philosophy", href: "#" },
      { label: "Technology", href: "#" },
      { label: "Sustainability", href: "#" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Technical Consulting", href: "#" },
      { label: "Bespoke/Custom Solutions", href: "#" },
    ],
  },
  {
    title: "Media Center",
    links: [
      { label: "News & Stories", href: "#" },
      { label: "Blogs", href: "#" },
    ],
  },
  {
    title: "Helpful",
    links: [
      { label: "Warranty", href: "#" },
      { label: "Newsletter", href: "#" },
      { label: "Certificates", href: "#" },
    ],
  },
];

export const footerAddress = {
  line: "63 St. James's Street, London, SW1A1LY, United Kingdom",
};

export const footerContact = {
  phone: "+44 20 7139 5164",
  email: "info@brightonlighting.co.uk",
};

export const footerSocials: FooterLink[] = [
  { label: "LinkedIn", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "Youtube", href: "#" },
];

export const footerLegal = {
  links: [
    { label: "©2026 Brighton Lighting. All rights reserved", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ] as FooterLink[],
};