import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Index from "@/app/components/client/service";
import { getServiceBySlug } from "@/lib/services/service.service";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getServiceBySlug(id);
  const title = data?.seo?.metaTitle?.trim() || data?.name;
  const description = data?.seo?.metaDescription?.trim();
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
  };
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  const data = await getServiceBySlug(id);
  if (!data || data.isHidden) notFound();
  return <Index data={data} />;
};

export default Page;
