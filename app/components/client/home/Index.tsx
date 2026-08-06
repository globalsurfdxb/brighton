import FeaturedProjects from "./sections/FeaturedProjects";
import FeaturedProducts from "./sections/FeaturedProducts";
import Hero from "./sections/Hero";
import Overview from "./sections/Overview";
import ClientsCorousal from "./sections/ClientsCorousal";
import {
  trustedByData,
  certifiedByData,
  homeCtaData,
  featuredProjectsData,
} from "./data";
import Services from "./sections/Services";
import LatestNews from "./sections/LatestNews";
import Cta from "../common/Cta";

const Index = () => {
  return (
    <>
      <Hero />
      <div className="h-[85svh] lg:h-svh" />
      <div className="relative z-10 bg-white">
        <Overview />
        <FeaturedProducts />
        <FeaturedProjects data={featuredProjectsData} animate />
        <ClientsCorousal
          data={trustedByData}
          className="pt-15 pb-15 lg:pt-0 lg:pb-100"
        />
        <Services />
        <ClientsCorousal
          data={certifiedByData}
          className="pt-15 pb-15 lg:py-100"
        />
        <LatestNews />
        <Cta data={homeCtaData} />
      </div>
    </>
  );
};

export default Index;
