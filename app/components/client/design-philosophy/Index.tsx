import InnerBanner from "../common/InnerBanner";
import { designPhilosophyCtaData, designPhilosophyPageData } from "./data";
import Cta from "../common/Cta";
import GuidingPrinciples from "./sections/GuidingPrinciples";
import QualityAssurance from "./sections/QualityAssurance";

const Index = () => {
  return (
    <>
      <InnerBanner data={designPhilosophyPageData} />
      <GuidingPrinciples />
      <QualityAssurance />
      <Cta data={designPhilosophyCtaData} />
    </>
  );
};

export default Index;
