import { digitalCatalogueCtaData } from "./data";
import Cta from "../common/Cta";
import Main from "./sections/Main";

const Index = () => {
  return (
    <>
      <Main />
      <Cta data={digitalCatalogueCtaData} />
    </>
  );
};

export default Index;
