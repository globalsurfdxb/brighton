import Cta from "../common/Cta";
import InnerBanner from "../common/InnerBanner";
import { technologyPageData, technologyCtaData } from "./data";
import EngineeredSystem from "./sections/EngineeredSystem";
import LightTechnology from "./sections/LightTechnology";
import ScienceConsistency from "./sections/ScienceConsistency";

const Index = () => {
  return (
    <>
      <InnerBanner data={technologyPageData} />
      <LightTechnology />
      <EngineeredSystem />
      <ScienceConsistency />
      <Cta data={technologyCtaData} />
    </>
  );
};

export default Index;
