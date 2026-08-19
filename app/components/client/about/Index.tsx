import InnerBanner from "../common/InnerBanner";
import { aboutPageData } from "./data";
import AboutIntro from "./sections/AboutIntro";
import LightBeyond from "./sections/LightBeyond";
import VisionMission from "./sections/VisionMission";
import WhyChoose from "./sections/WhyChoose";

const Index = () => {
  return (
    <>
      <InnerBanner data={aboutPageData} />
      <AboutIntro />
      <VisionMission />
      <LightBeyond />
      <WhyChoose />
    </>
  );
};

export default Index;
