export type HeroData = {
  title: string;
  description: string;
  video: string;
  poster: string;
  buttons: { text: string; link: string }[];
};

export type OverviewData = {
  stats: { label: string; value: string; icon: string; iconAlt: string }[];
  cards: {
    title: string;
    description: string;
    button: string;
    link: string;
    video: string;
    poster: string;
    posterAlt: string;
  }[];
};

export type LogoCarouselData = {
  label: string;
  logos: { image: string; imageAlt: string }[];
};

export type ServicesData = {
  sectionTitle: string;
  services: {
    title: string;
    description: string;
    image: string;
    imageAlt: string;
    link: string;
  }[];
};
