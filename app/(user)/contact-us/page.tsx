import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Index from "@/app/components/client/contact-us/Index";
import { getContactPage } from "@/lib/services/contact.service";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getContactPage();
  const title = data?.seo?.metaTitle?.trim();
  const description = data?.seo?.metaDescription?.trim();
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
  };
}

const page = async () => {
  const data = await getContactPage();
  if (!data) notFound();
  return <Index data={data} />;
};

export default page;
