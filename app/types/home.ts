export interface HomeLogo {
  image: string;
  imageAlt: string;
}

export interface HomeDoc {
  _id?: string;
  seo?: { metaTitle?: string; metaDescription?: string; script?: string };
  heroSection: {
    title: string;
    description: string;
    video: string;
    poster: string;
    buttons: { text: string; link: string }[];
  };
  overviewSection: {
    isHidden: boolean;
    stats: { label: string; value: string; icon: string; iconAlt: string }[];
    cards: {
      title: string;
      description: string;
      buttonText: string;
      buttonLink: string;
      video: string;
      poster: string;
      posterAlt: string;
    }[];
  };
  trustedBySection: { isHidden: boolean; title: string; logos: HomeLogo[] };
  servicesSection: { isHidden: boolean; title: string };
  certifiedBySection: { isHidden: boolean; title: string; logos: HomeLogo[] };
  ctaSection: {
    isHidden: boolean;
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
}

export interface HomeServiceCard {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  link: string;
}
