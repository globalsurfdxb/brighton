export interface LinkItem {
  label: string;
  link: string;
}

export interface HeaderNavItem {
  label: string;
  link: string;
  items: LinkItem[];
}

export interface HeaderData {
  logo: string;
  logoAlt: string;
  navItems: HeaderNavItem[];
  buttonText: string;
  buttonLink: string;
}

export interface FooterColumnData {
  title: string;
  links: LinkItem[];
}

export interface FooterData {
  columns: FooterColumnData[];
  address: string;
  addressLink: string;
  phone: string;
  email: string;
  socials: LinkItem[];
  catalogueButtonText: string;
  copyright: string;
  legalLinks: LinkItem[];
}

export interface HeaderFooterDoc {
  _id?: string;
  header: HeaderData;
  footer: FooterData;
}
