import Cta from "../common/Cta";
import { productsCtaData } from "./data";
import Main from "./sections/Main";
import { Suspense } from "react";

const Index = () => {
  return (
    <>
      <Suspense>
        <Main />
      </Suspense>
      <Cta data={productsCtaData} />
    </>
  );
};

export default Index;
