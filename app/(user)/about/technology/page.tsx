import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Index from "@/app/components/client/technology/Index";
import { getTechnologyPage } from "@/lib/services/technology.service";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getTechnologyPage();
  const title = data?.seo?.metaTitle?.trim();
  const description = data?.seo?.metaDescription?.trim();
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
  };
}

const page = async () => {
  const data = await getTechnologyPage();
  if (!data) notFound();
  return <Index data={data} />;
};

export default page;
