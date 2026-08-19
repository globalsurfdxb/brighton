
import InnerBanner from "../common/InnerBanner";
import { servicePageData, capabilitiesData, sectorsWeServe, processData, ctaData } from "./data";
import IntroSection from "./sections/IntroSection";
import ServiceTabSection from "./sections/ServiceTabSection";
import SectorsGrid from "./sections/SectorsGrid";
import ProcessSection from "./sections/ProcessSection";
import Cta from "../common/Cta";
const Index = () => {
  return ( 
    <>
      <InnerBanner data={servicePageData} />
      <IntroSection />
      <ServiceTabSection data={capabilitiesData}  />
      <SectorsGrid data={sectorsWeServe} />
      <ProcessSection data={processData} />
      <Cta data={ctaData} />
    </>
   );
}
 
export default Index;