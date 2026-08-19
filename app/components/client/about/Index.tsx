import InnerBanner from "../common/InnerBanner";
import { aboutCtaData, aboutPageData } from "./data";
import AboutIntro from "./sections/AboutIntro";
import LightBeyond from "./sections/LightBeyond";
import VisionMission from "./sections/VisionMission";
import WhyChoose from "./sections/WhyChoose";
import ResearchInnovation from "./sections/ResearchInnovation";
import ServiceDriven from "./sections/ServiceDriven";
import Cta from "../common/Cta";

const Index = () => {
  return (
    <>
      <InnerBanner data={aboutPageData} />
      <AboutIntro />
      <VisionMission />
      <LightBeyond />
      <WhyChoose />
      <ResearchInnovation />
      <ServiceDriven />
      <Cta data={aboutCtaData} />
    </>
  );
};

export default Index;
