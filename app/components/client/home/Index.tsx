import FeaturedProjects from "./sections/FeaturedProjects";
import FeaturedProducts from "./sections/FeaturedProducts";
import Hero from "./sections/Hero";
import Overview from "./sections/Overview";
import ClientsCorousal from "./sections/ClientsCorousal";
import { featuredProjectsData } from "./data";
import Services from "./sections/Services";
import LatestNews from "./sections/LatestNews";
import Cta from "../common/Cta";
import type { HomeDoc, HomeServiceCard } from "@/app/types/home";

const toLogos = (logos?: { image?: string; imageAlt?: string }[]) =>
  (logos ?? [])
    .filter((logo) => logo.image)
    .map((logo) => ({ image: logo.image ?? "", imageAlt: logo.imageAlt ?? "" }));

const Index = ({
  data,
  services,
}: {
  data: HomeDoc;
  services: HomeServiceCard[];
}) => {
  const {
    heroSection: hero,
    overviewSection: overview,
    trustedBySection: trusted,
    servicesSection: servicesSection,
    certifiedBySection: certified,
    ctaSection: cta,
  } = data;

  return (
    <>
      <Hero
        data={{
          title: hero?.title ?? "",
          description: hero?.description ?? "",
          video: hero?.video ?? "",
          poster: hero?.poster ?? "",
          buttons: (hero?.buttons ?? []).map((button) => ({
            text: button.text ?? "",
            link: button.link ?? "",
          })),
        }}
      />
      <div className="h-[85svh] lg:h-svh" />
      <div className="relative z-10 bg-white">
        {overview && !overview.isHidden && (
          <Overview
            data={{
              stats: (overview.stats ?? []).map((stat) => ({
                label: stat.label ?? "",
                value: stat.value ?? "",
                icon: stat.icon ?? "",
                iconAlt: stat.iconAlt ?? "",
              })),
              cards: (overview.cards ?? []).map((card) => ({
                title: card.title ?? "",
                description: card.description ?? "",
                button: card.buttonText ?? "",
                link: card.buttonLink || "#",
                video: card.video ?? "",
                poster: card.poster ?? "",
                posterAlt: card.posterAlt ?? "",
              })),
            }}
          />
        )}
        <FeaturedProducts />
        <FeaturedProjects data={featuredProjectsData} animate />
        {trusted && !trusted.isHidden && (
          <ClientsCorousal
            data={{ label: trusted.title ?? "", logos: toLogos(trusted.logos) }}
            className="pt-15 pb-15 lg:pt-0 lg:pb-100"
          />
        )}
        {servicesSection && !servicesSection.isHidden && services.length > 0 && (
          <Services
            data={{ sectionTitle: servicesSection.title ?? "", services }}
          />
        )}
        {certified && !certified.isHidden && (
          <ClientsCorousal
            data={{ label: certified.title ?? "", logos: toLogos(certified.logos) }}
            className="pt-15 pb-15 lg:py-100"
          />
        )}
        <LatestNews />
        {cta && !cta.isHidden && (
          <Cta
            data={{
              title: cta.title ?? "",
              description: cta.description ?? "",
              button: {
                text: cta.buttonText ?? "",
                href: cta.buttonLink || "#",
              },
            }}
          />
        )}
      </div>
    </>
  );
};

export default Index;
