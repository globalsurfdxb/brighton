export interface Seo {
  metaTitle?: string;
  metaDescription?: string;
  script?: string;
}

export interface BannerSection {
  isHidden: boolean;
  image: string;
  imageAlt: string;
  title: string;
}

export interface FirstSectionItem {
  value: string;
  label: string;
}

export interface FirstSection {
  isHidden: boolean;
  title: string;
  description: string;
  items: FirstSectionItem[];
}

export interface SecondSectionItem {
  title: string;
  description: string;
}

export interface SecondSection {
  isHidden: boolean;
  Image: string;
  ImageAlt: string;
  items: SecondSectionItem[];
}

export interface ThirdSection {
  isHidden: boolean;
  title: string;
  subTitle: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface FourthSectionItem {
  image: string;
  imageAlt: string;
  title: string;
}

export interface FourthSection {
  isHidden: boolean;
  title: string;
  items: FourthSectionItem[];
}

export interface FifthSection {
  isHidden: boolean;
  title: string;
  description: string;
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

export interface SeventhSection {
  isHidden: boolean;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface AboutDoc {
  _id: string;
  seo?: Seo;
  bannerSection: BannerSection;
  firstSection: FirstSection;
  secondSection: SecondSection;
  thirdSection: ThirdSection;
  fourthSection: FourthSection;
  fifthSection: FifthSection;
  sixthSection: SixthSection;
  seventhSection: SeventhSection;
}

export interface GetAboutResult {
  about: AboutDoc;
}