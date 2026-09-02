export interface Seo {
  metaTitle?: string;
  metaDescription?: string;
  script?: string;
}

export interface HomePageSection {
  description: string;
  image: string;
  imageAlt: string;
}

export interface BannerSection {
  isHidden: boolean;
  image: string;
  imageAlt: string;
  title: string;
}

export interface FirstSection {
  isHidden: boolean;
  title: string;
  btnText: string;
  btnLink: string;
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
  items: SecondSectionItem[];
}

export interface ThirdSectionItem {
  title: string;
  icon: string;
  iconAlt: string;
}

export interface ThirdSection {
  isHidden: boolean;
  title: string;
  items: ThirdSectionItem[];
}

export interface FourthSectionItem {
  title: string;
  description: string;
}

export interface FourthSection {
  isHidden: boolean;
  title: string;
  items: FourthSectionItem[];
}

export interface CtaSection {
  isHidden: boolean;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface ServiceDoc {
  _id: string;
  name: string;
  slug: string;
  isHidden: boolean;
  seo?: Seo;
  homePageSection: HomePageSection;
  bannerSection: BannerSection;
  firstSection: FirstSection;
  secondSection: SecondSection;
  thirdSection: ThirdSection;
  fourthSection: FourthSection;
  ctaSection: CtaSection;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetServiceResult {
  service: ServiceDoc;
}