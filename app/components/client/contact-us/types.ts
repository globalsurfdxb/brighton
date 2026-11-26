export type ContactSectionData = {
  title: string;
  address: string;
  addressLink: string;
  phone: string;
  email: string;
  description: string;
  mapLink: string;
};

export type SocialsData = {
  image: string;
  imageAlt: string;
  socials: { title: string; icon: string; iconAlt: string; href: string }[];
};
