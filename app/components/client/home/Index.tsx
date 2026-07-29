import FeaturedProjects from "./sections/Featuredprojects";
import FeaturedProducts from "./sections/FeaturedProducts";
import Hero from "./sections/Hero";
import Overview from "./sections/Overview";
import ClientsCorousal from "./sections/ClientsCorousal";
import { trustedByData, certifiedByData } from "./data";
import Services from "./sections/Services";
import LatestNews from "./sections/LatestNews";
import HomeCta from "./sections/HomeCta";

const Index = () => {
  return (
    <>
      <Hero />
      <Overview />
      <FeaturedProducts />
      <FeaturedProjects />
      <ClientsCorousal data={trustedByData} className="pb-100" />
      <Services />
      <ClientsCorousal data={certifiedByData} className="py-100" />
      <LatestNews />
      <HomeCta />
    </>
  );
};

export default Index;
