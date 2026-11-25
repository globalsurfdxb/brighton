import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Index from "@/app/components/client/news";
import { getNewsPage } from "@/lib/services/news.service";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getNewsPage();
  const title = data?.seo?.metaTitle?.trim();
  const description = data?.seo?.metaDescription?.trim();
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
  };
}

const page = async () => {
  const data = await getNewsPage();
  if (!data) notFound();
  return (
    <Suspense>
      <Index data={data} />
    </Suspense>
  );
};

export default page;
