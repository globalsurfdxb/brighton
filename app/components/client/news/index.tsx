import Cta from "../common/Cta";
import { ctaData } from "./data";
import NewsList from "./section/NewsList";
import { newsSection } from "./data";

const Index = () => {
  return (
    <>
      <NewsList data={newsSection} />
      <Cta data={ctaData} />
    </>
  );
};

export default Index;
