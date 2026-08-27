export type NavDropdownItem = { label: string; href: string };

export type NavItem = {
  label: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: NavDropdownItem[];
};

export const navItems: NavItem[] = [
  { label: "Interior", href: "#", hasDropdown: true, dropdownItems: [
    { label: "Ceiling Recessed Downlights", href: "/lighting?category=interior&subcategory=ceiling-recessed-downlight" },
    { label: "Surface Mounted Downlight", href: "/lighting?category=interior&subcategory=surface-mounted-downlight" },
    { label: "Ceiling Recessed / Surface / Suspended Profiles", href: "/lighting?category=interior&subcategory=ceiling-recessed-surface-suspended-profiles" },
    { label: "Ceiling Recessed / Surface / Suspended Panel Light", href: "/lighting?category=interior&subcategory=ceiling-recessed-surface-suspended-panel-light" },
    { label: "Track Lighting", href: "/lighting?category=interior&subcategory=track-lighting" },
  ] },
  { label: "Exterior", href: "#", hasDropdown: true, dropdownItems: [
    { label: "Inground Uplights", href: "/lighting?category=exterior&subcategory=inground-uplights" },
    { label: "Inground Linear Uplights", href: "/lighting?category=exterior&subcategory=inground-linear-uplights" },
    { label: "Bollard Lighting", href: "/lighting?category=exterior&subcategory=bollard-lighting" },
    { label: "Projector Spike Light", href: "/lighting?category=exterior&subcategory=projector-spike-light" },
    { label: "Wall Recessed Surface", href: "/lighting?category=exterior&subcategory=wall-recessed-surface" },
    { label: "Weatherproof Lighting", href: "/lighting?category=exterior&subcategory=weatherproof-lighting" },
    { label: "Bulkhead Lighting", href: "/lighting?category=exterior&subcategory=bulkhead-lighting" },
    { label: "LED Neon Flex Lighting", href: "/lighting?category=exterior&subcategory=led-neon-flex-lighting" },
    { label: "LED Strip Lighting", href: "/lighting?category=exterior&subcategory=led-strip-lighting" },
    { label: "LED Street Lighting", href: "/lighting?category=exterior&subcategory=led-street-lighting" },
  ] },
  { label: "Projects", href: "/projects", hasDropdown: false,
},
  { label: "Services", href: "#", hasDropdown: true, dropdownItems: [
    { label: "Technical Consulting", href: "/services/technical-consulting" },
    { label: "Bespoke / Custom Solutions", href: "/services/bespoke-and-custom-solutions" },
  ] },
  { label: "Resources", href: "#", hasDropdown: true, dropdownItems: [
    { label: "Digital Catalogue", href: "/resources/digital-catalogue" },
    { label: "Downloads Hub", href: "#" },
  ] },
  { label: "Media", href: "#", hasDropdown: true, dropdownItems: [
    { label: "News & Stories", href: "/news" },
    { label: "Blogs", href: "/blog" },
  ] },
  { label: "About", href: "#", hasDropdown: true, dropdownItems: [
    { label: "About Brighton", href: "/about" },
    { label: "Design Philosophy", href: "/about/design-philosophy" },
    { label: "Technology", href: "/about/technology" },
    { label: "Sustainability", href: "/about/sustainability" },
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
      { label: "Interior Lighting", href: "/lighting?category=interior" },
      { label: "Exterior Lighting", href: "/lighting?category=exterior" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Digital Catalogue", href: "/resources/digital-catalogue" },
      { label: "Downloads Hub", href: "#" },
      { label: "Projects", href: "/projects" },
    ],
  },
  {
    title: "About Brighton",
    links: [
      { label: "Overview", href: "/about" },
      { label: "Design Philosophy", href: "/about/design-philosophy" },
      { label: "Technology", href: "/about/technology" },
      { label: "Sustainability", href: "/about/sustainability" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Technical Consulting", href: "/services/technical-consulting" },
      { label: "Bespoke/Custom Solutions", href: "/services/bespoke-and-custom-solutions" },
    ],
  },
  {
    title: "Media Center",
    links: [
      { label: "News & Stories", href: "/news" },
      { label: "Blogs", href: "/blog" },
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
