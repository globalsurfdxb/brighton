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
      { label: "Interior Lighting", href: "/products/interior-lighting" },
      { label: "Exterior Lighting", href: "/products/exterior-lighting" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Digital Catalogue", href: "/resources/digital-catalogue" },
      { label: "Downloads Hub", href: "/resources/downloads-hub" },
      { label: "Projects", href: "/resources/projects" },
    ],
  },
  {
    title: "About Brighton",
    links: [
      { label: "Overview", href: "/about/overview" },
      { label: "Design Philosophy", href: "/about/design-philosophy" },
      { label: "Technology", href: "/about/technology" },
      { label: "Sustainability", href: "/about/sustainability" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Technical Consulting", href: "/services/technical-consulting" },
      { label: "Bespoke/Custom Solutions", href: "/services/bespoke-custom-solutions" },
    ],
  },
  {
    title: "Media Center",
    links: [
      { label: "News & Stories", href: "/media/news-and-stories" },
      { label: "Blogs", href: "/media/blogs" },
    ],
  },
  {
    title: "Helpful",
    links: [
      { label: "Warranty", href: "/helpful/warranty" },
      { label: "Newsletter", href: "/helpful/newsletter" },
      { label: "Certificates", href: "/helpful/certificates" },
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