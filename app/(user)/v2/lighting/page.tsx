import Index from "@/app/components/client/products/Index-v2";
import { GetProductsResult } from "@/app/types/product";
import { getProductsPageData } from "@/lib/services/products.service";

export const dynamic = "force-dynamic";

const page = async () => {
  const data: GetProductsResult = await getProductsPageData();
  return (
    <>
      <Index data={data} />
    </>
  );
};

export default page;
