import InnerBanner from "../common/InnerBanner";
import {
  servicePageData,
  capabilitiesData,
  sectorsWeServe,
  processData,
  introData,
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
      <InnerBanner data={servicePageData} />
      <IntroSection data={introData} className="max-w-244.25" />
      <ServiceTabSection data={capabilitiesData} />
      <SectorsGrid data={sectorsWeServe} />
      <ProcessSection data={processData} />
      <Cta data={ctaData} />
    </>
  );
};

export default Index;
