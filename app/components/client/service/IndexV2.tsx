import InnerBanner from "../common/InnerBanner";
import {
  servicePageData2,
  capabilitiesData2,
  sectorsWeServe2,
  processData2,
  introData2,
  ctaData,
} from "./data";
import IntroSection from "../common/IntroSection";
import ServiceTabSection from "./sections/ServiceTabSection";
import SectorsGrid from "./sections/SectorsGrid";
import ProcessSection from "./sections/ProcessSection";
import Cta from "../common/Cta";

const Index = () => {
  return (
    <>
      <InnerBanner data={servicePageData2} />
      <IntroSection data={introData2} className="max-w-244.25" />
      <ServiceTabSection data={capabilitiesData2} />
      <SectorsGrid data={sectorsWeServe2} />
      <ProcessSection data={processData2} />
      <Cta data={ctaData} />
    </>
  );
};

export default Index;
