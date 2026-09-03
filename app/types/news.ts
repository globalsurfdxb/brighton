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

export interface Topic {
  _id?: string;
  title: string;
}

export interface NewsItemCtaSection {
  isHidden: boolean;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface NewsItem {
  _id: string;
  isHidden: boolean;
  title: string;
  slug: string;
  date: string;
  thumbImage: string;
  thumbImageAlt: string;
  bannerImage: string;
  bannerImageAlt: string;
  content: string;
  ctaSection: NewsItemCtaSection;
  topic: string;
}

export interface NewsDoc {
  _id: string;
  seo?: Seo;
  bannerSection: BannerSection;
  ctaSection: CtaSection;
  topics: Topic[];
  news: NewsItem[];
}

export interface GetNewsResult {
  news: NewsDoc;
}
