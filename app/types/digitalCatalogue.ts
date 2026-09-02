export interface Seo {
  metaTitle?: string;
  metaDescription?: string;
  script?: string;
}

export interface FirstSection {
  isHidden: boolean;
  title: string;
  subTitle: string;
  catalogueText: string;
  catalogueLink: string;
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

export interface DigitalCatalogueDoc {
  _id: string;
  seo?: Seo;
  firstSection: FirstSection;
  ctaSection: CtaSection;
}

export interface GetDigitalCatalogueResult {
  digitalCatalogue: DigitalCatalogueDoc;
}
