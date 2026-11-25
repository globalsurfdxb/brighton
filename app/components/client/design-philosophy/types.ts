export type GuidingPrinciplesData = {
  title: string;
  description: string;
  items: { image: string; imageAlt: string; title: string; description: string }[];
};

export type QualityAssuranceData = {
  image: string;
  imageAlt: string;
  title: string;
  subtitle: string;
  description: string;
  items: { icon: string; iconAlt: string; title: string }[];
};
