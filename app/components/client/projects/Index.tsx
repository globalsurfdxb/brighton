import Cta from "../common/Cta";
import { projectsCtaData } from "./data";
import Main from "./sections/Main";

const Index = () => {
  return (
    <>
      <Main />
      <Cta data={projectsCtaData} />
    </>
  );
};

export default Index;
