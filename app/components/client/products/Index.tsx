import Cta from "../common/Cta";
import { productsCtaData } from "./data";
import Main from "./sections/Main";

const Index = () => {
  return (
    <>
      <Main />
      <Cta data={productsCtaData} />
    </>
  );
};

export default Index;
