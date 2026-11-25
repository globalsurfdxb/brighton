import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Index from "@/app/components/client/blog";
import { getBlogsPage } from "@/lib/services/blog.service";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getBlogsPage();
  const title = data?.seo?.metaTitle?.trim();
  const description = data?.seo?.metaDescription?.trim();
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
  };
}

const page = async () => {
  const data = await getBlogsPage();
  if (!data) notFound();
  return (
    <Suspense>
      <Index data={data} />
    </Suspense>
  );
};

export default page;
