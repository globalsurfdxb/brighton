import Index from "@/app/components/client/product-details/Index-v2";
import { getProductBySlug } from "@/lib/services/products.service";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const data = await getProductBySlug(slug);
  if (!data) notFound();

  return (
    <>
      <Index data={data} />
    </>
  );
};

export default page;
