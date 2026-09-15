import Cta from "../common/Cta";
import { productsCtaData } from "./data-v2";
import Main from "./sections/Main-v2";
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
