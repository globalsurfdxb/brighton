import Main from "./sections/main";
import { newsDetails } from "./data";
import Cta from "../common/Cta";
import { ctaData } from "./data";
import RecentNews from "./sections/RecentNews";

const Index = () => {
  return (
    <>
      <Main data={newsDetails} />
      <RecentNews />
      <Cta data={ctaData} />
    </>
  );
}

export default Index;