import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Index from "@/app/components/client/sustainability/Index";
import { getSustainabilityPage } from "@/lib/services/sustainability.service";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSustainabilityPage();
  const title = data?.seo?.metaTitle?.trim();
  const description = data?.seo?.metaDescription?.trim();
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
  };
}

const page = async () => {
  const data = await getSustainabilityPage();
  if (!data) notFound();
  return <Index data={data} />;
};

export default page;
