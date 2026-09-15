import ProductBanner from "./sections/ProductBanner";
import ProductConfigurator from "./sections/ProductConfiguration/ProductConfigurator";
import TechnicalSpecification from "./sections/TechnicalSpecification";
import SpecifierResources from "./sections/Resources";
import MoreProducts from "./sections/MoreProducts";
import Cta from "../common/Cta";
import { productDetailsCtaData } from "./data";

const Index = () => {
  return (
    <>
      <ProductBanner />
      <ProductConfigurator />
      <TechnicalSpecification />
      <SpecifierResources />
      <MoreProducts />
      <Cta data={productDetailsCtaData} />
    </>
  );
};

export default Index;
