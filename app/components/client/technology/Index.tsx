import Cta from "../common/Cta";
import InnerBanner from "../common/InnerBanner";
import {
  technologyPageData,
  technologyCtaData,
  introData,
  lightTechnologyData,
} from "./data";
import EngineeredSystem from "./sections/EngineeredSystem";
import ImageDescription from "../common/ImageDescription";
import ScienceConsistency from "./sections/ScienceConsistency";
import IntroSection from "../common/IntroSection";

const Index = () => {
  return (
    <>
      <InnerBanner data={technologyPageData} />
      <IntroSection data={introData} className="max-w-[115ch]" />
      <ImageDescription data={lightTechnologyData} />
      <EngineeredSystem />
      <ScienceConsistency />
      <Cta data={technologyCtaData} />
    </>
  );
};

export default Index;
