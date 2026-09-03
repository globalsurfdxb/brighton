export interface Seo {
  metaTitle?: string;
  metaDescription?: string;
  script?: string;
}

export interface BannerSection {
  title: string;
}

export interface CtaSection {
  isHidden: boolean;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface Region {
  _id?: string;
  title: string;
}

export interface Sector {
  _id?: string;
  title: string;
}

export interface ProjectImage {
  _id?: string;
  url: string;
  alt: string;
}

export interface ProjectItemCtaSection {
  isHidden: boolean;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface ProjectItem {
  _id: string;
  isHidden: boolean;
  title: string;
  slug: string;
  featured: boolean;
  region: string;
  sector: string[];
  thumbImage: string;
  thumbImageAlt: string;
  bannerImage: string;
  bannerImageAlt: string;
  images: ProjectImage[];
  contentTitle: string;
  content: string;
  ctaSection: ProjectItemCtaSection;
}

export interface ProjectDoc {
  _id: string;
  seo?: Seo;
  bannerSection: BannerSection;
  ctaSection: CtaSection;
  regions: Region[];
  sectors: Sector[];
  projects: ProjectItem[];
}

export interface GetProjectResult {
  project: ProjectDoc;
}