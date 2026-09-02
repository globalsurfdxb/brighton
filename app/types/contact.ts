export interface Seo {
  metaTitle?: string;
  metaDescription?: string;
  script?: string;
}

export interface FirstSection {
  isHidden: boolean;
  title: string;
  address: string;
  phone: string;
  email: string;
  subTitle: string;
  mapLink: string;
}

export interface SecondSectionItem {
  title: string;
  link: string;
  icon: string;
  iconAlt: string;
}

export interface SecondSection {
  isHidden: boolean;
  image: string;
  imageAlt: string;
  items: SecondSectionItem[];
}

export interface CtaSection {
  isHidden: boolean;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface ContactDoc {
  _id: string;
  seo?: Seo;
  firstSection: FirstSection;
  secondSection: SecondSection;
  ctaSection: CtaSection;
}

export interface GetContactResult {
  contact: ContactDoc;
}