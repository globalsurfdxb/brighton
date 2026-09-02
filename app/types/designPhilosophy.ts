export interface Seo {
  metaTitle?: string;
  metaDescription?: string;
  script?: string;
}

export interface BannerSection {
  image: string;
  imageAlt: string;
  title: string;
}

export interface FirstSectionItem {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface FirstSection {
  isHidden: boolean;
  subTitle: string;
  items: FirstSectionItem[];
}

export interface SecondSectionItem {
  title: string;
  icon: string;
  iconAlt: string;
}

export interface SecondSection {
  isHidden: boolean;
  title: string;
  subTitle: string;
  description: string;
  items: SecondSectionItem[];
}

export interface CtaSection {
  isHidden: boolean;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface DesignPhilosophyDoc {
  _id: string;
  seo?: Seo;
  bannerSection: BannerSection;
  firstSection: FirstSection;
  secondSection: SecondSection;
  ctaSection: CtaSection;
}

export interface GetDesignPhilosophyResult {
  designPhilosophy: DesignPhilosophyDoc;
}