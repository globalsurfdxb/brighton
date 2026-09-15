import { Suspense } from "react";
import ProductBanner from "./sections/ProductBanner";
import ProductConfigurator from "./sections/ProductConfiguration/ProductConfigurator";
import TechnicalSpecification from "./sections/TechnicalSpecification";
import SpecifierResources from "./sections/Resources";
import MoreProducts from "./sections/MoreProducts";
import Cta from "../common/Cta";
import { productDetailsCtaData } from "./data";
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
      <SpecifierResources />
      <MoreProducts products={moreProducts} />
      <Cta data={productDetailsCtaData} />
    </>
  );
};

export default Index;
