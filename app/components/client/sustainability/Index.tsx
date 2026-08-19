import Cta from "../common/Cta";
import InnerBanner from "../common/InnerBanner";
import {
  sustainabilityPageData,
  sustainabilityCtaData,
  wellbeingData,
  introData,
} from "./data";
import IntroSection from "../common/IntroSection";
import ImageDescription from "../common/ImageDescription";
import CorporateStrategy from "./sections/CorporateStrategy";
import CertifiedCompliant from "./sections/CertifiedCompliant";
import Research from "./sections/Research";
import EnergyEfficiency from "./sections/EnergyEfficiency";

const Index = () => {
  return (
    <>
      <InnerBanner data={sustainabilityPageData} />
      <IntroSection data={introData} className="max-w-[115ch]" />
      <EnergyEfficiency />
      <Research />
      <ImageDescription data={wellbeingData} />
      <CorporateStrategy />
      <CertifiedCompliant />
      <Cta data={sustainabilityCtaData} />
    </>
  );
};

export default Index;
