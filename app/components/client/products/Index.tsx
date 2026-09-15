import Cta from "../common/Cta";
import { productsCtaData } from "./data";
import Main from "./sections/Main";
import { Suspense } from "react";
import { GetProductsResult } from "@/app/types/product";

const Index = ({ data }: { data: GetProductsResult }) => {
  return (
    <>
      <Suspense>
        <Main data={data} />
      </Suspense>
      <Cta data={productsCtaData} />
    </>
  );
};

export default Index;
