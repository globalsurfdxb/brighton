import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Index from "@/app/components/client/digital-catalogue/Index";
import { getDigitalCataloguePage } from "@/lib/services/digitalCatalogue.service";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getDigitalCataloguePage();
  const title = data?.seo?.metaTitle?.trim();
  const description = data?.seo?.metaDescription?.trim();
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
  };
}

const page = async () => {
  const data = await getDigitalCataloguePage();
  if (!data) notFound();
  return <Index data={data} />;
};

export default page;
