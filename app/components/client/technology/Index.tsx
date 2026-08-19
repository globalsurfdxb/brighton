import Cta from "../common/Cta";
import InnerBanner from "../common/InnerBanner";
import { technologyPageData, technologyCtaData, introData } from "./data";
import EngineeredSystem from "./sections/EngineeredSystem";
import LightTechnology from "./sections/LightTechnology";
import ScienceConsistency from "./sections/ScienceConsistency";
import IntroSection from "../common/IntroSection";

const Index = () => {
  return (
    <>
      <InnerBanner data={technologyPageData} />
      <IntroSection data={introData} className="max-w-[115ch]" />
      <LightTechnology />
      <EngineeredSystem />
      <ScienceConsistency />
      <Cta data={technologyCtaData} />
    </>
  );
};

export default Index;
