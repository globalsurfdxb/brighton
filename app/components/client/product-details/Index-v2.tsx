import { Suspense } from "react";
import ProductBanner from "./sections/ProductBanner-v2";
import ProductConfigurator from "./sections/ProductConfiguration/ProductConfigurator-v2";
import TechnicalSpecification from "./sections/TechnicalSpecification-v2";
import SpecifierResources from "./sections/Resources-v2";
import MoreProducts from "./sections/MoreProducts-v2";
import Cta from "../common/Cta";
import { productDetailsCtaData } from "./data-v2";
import { GetProductResult } from "@/app/types/product";

const Index = ({ data }: { data: GetProductResult }) => {
  const { product, moreProducts } = data;
  return (
    <>
      <ProductBanner product={product} />
      <Suspense>
        <ProductConfigurator product={product} />
      </Suspense>
      <TechnicalSpecification product={product} />
      <SpecifierResources product={product} />
      <MoreProducts products={moreProducts} />
      <Cta data={productDetailsCtaData} />
    </>
  );
};

export default Index;
