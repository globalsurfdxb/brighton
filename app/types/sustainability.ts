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
  description: string;
}

export interface SecondSectionItem {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface SecondSection {
  isHidden: boolean;
  title: string;
  description: string;
  items: SecondSectionItem[];
}

export interface ThirdSection {
  isHidden: boolean;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface FourthSection {
  isHidden: boolean;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface FifthSection {
  isHidden: boolean;
  title: string;
  subTitle: string;
  image: string;
  imageAlt: string;
}

export interface SixthSection {
  isHidden: boolean;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface CtaSection {
  isHidden: boolean;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface SustainabilityDoc {
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

export interface GetSustainabilityResult {
  sustainability: SustainabilityDoc;
}
