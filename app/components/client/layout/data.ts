export type NavDropdownItem = { label: string; href: string };

export type NavItem = {
  label: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: NavDropdownItem[];
};

export const navItems: NavItem[] = [
  { label: "Interior", href: "#", hasDropdown: true, dropdownItems: [
    { label: "Ceiling Recessed Downlights", href: "#" },
    { label: "Surface Mounted Downlight", href: "#" },
    { label: "Ceiling Recessed / Surface / Suspended Profiles", href: "#" },
    { label: "Ceiling Recessed / Surface / Suspended Panel Light", href: "#" },
    { label: "Track Lighting", href: "#" },
  ] },
  { label: "Exterior", href: "#", hasDropdown: true, dropdownItems: [
    { label: "Inground Uplights", href: "#" },
    { label: "Inground Linear Uplights", href: "#" },
    { label: "Bollard Lighting", href: "#" },
    { label: "Projector Spike Light", href: "#" },
    { label: "Wall Recessed Surface", href: "#" },
    { label: "Weatherproof Lighting", href: "#" },
    { label: "Bulkhead Lighting", href: "#" },
    { label: "LED Neon Flex Lighting", href: "#" },
    { label: "LED Strip Lighting", href: "#" },
    { label: "LED Street Lighting", href: "#" },
  ] },
  { label: "Projects", href: "#", hasDropdown: false,
  //    dropdownItems: [
  //   { label: "Filter: Sector", href: "#" },
  //   { label: "Filter: Region", href: "#" },
  //   { label: "Project Detail Pages", href: "#" },
  // ] 
},
  { label: "Services", href: "#", hasDropdown: true, dropdownItems: [
    { label: "Technical Consulting", href: "#" },
    { label: "Bespoke / Custom Solutions", href: "#" },
  ] },
  { label: "Resources", href: "#", hasDropdown: true, dropdownItems: [
    { label: "Digital Catalogue", href: "#" },
    { label: "Downloads Hub", href: "#" },
  ] },
  { label: "Media", href: "#", hasDropdown: true, dropdownItems: [
    { label: "News & Stories", href: "#" },
    { label: "Blogs", href: "#" },
  ] },
  { label: "About", href: "#", hasDropdown: true, dropdownItems: [
    { label: "About Brighton", href: "#" },
    { label: "Design Philosophy", href: "#" },
    { label: "Technology", href: "#" },
    { label: "Sustainability", href: "#" },
    { label: "Certifications", href: "#" },
  ] },
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