import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Index from "@/app/components/client/home/Index";
import { getHomePage, getHomeServices } from "@/lib/services/home.service";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHomePage();
  const title = data?.seo?.metaTitle?.trim();
  const description = data?.seo?.metaDescription?.trim();
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
  };
}

const page = async () => {
  const [data, services] = await Promise.all([getHomePage(), getHomeServices()]);
  if (!data) notFound();
  return <Index data={data} services={services} />;
};

export default page;
