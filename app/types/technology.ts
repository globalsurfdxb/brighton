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

export interface FirstSection {
  isHidden: boolean;
  title: string;
}

export interface SecondSection {
  isHidden: boolean;
  title: string;
  description: string;
  Image: string;
  ImageAlt: string;
}

export interface ThirdSectionItem {
  title: string;
  description: string;
}

export interface ThirdSection {
  isHidden: boolean;
  title: string;
  items: ThirdSectionItem[];
}

export interface FourthSection {
  isHidden: boolean;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface FifthSectionItem {
  title: string;
  description: string;
  icon: string;
  iconAlt: string;
}

export interface FifthSection {
  isHidden: boolean;
  title: string;
  items: FifthSectionItem[];
}

export interface SixthSectionItem {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface SixthSection {
  isHidden: boolean;
  title: string;
  items: SixthSectionItem[];
}

export interface CtaSection {
  isHidden: boolean;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface TechnologyDoc {
  _id: string;
  seo?: Seo;
  bannerSection: BannerSection;
  firstSection: FirstSection;
  secondSection: SecondSection;
  thirdSection: ThirdSection;
  fourthSection: FourthSection;
  fifthSection: FifthSection;
  sixthSection: SixthSection;
  ctaSection: CtaSection;
}

export interface GetTechnologyResult {
  technology: TechnologyDoc;
}