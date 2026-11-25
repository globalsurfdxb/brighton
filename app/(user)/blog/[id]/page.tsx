import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Index from "@/app/components/client/blog-details";
import { getBlogsPage, toBlogCards } from "@/lib/services/blog.service";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function findBlog(slug: string) {
  const data = await getBlogsPage();
  const item = data?.blogs.find((n) => n.slug === slug && !n.isHidden);
  if (!data || !item) return null;
  const cards = toBlogCards(data);
  const category = cards.find((c) => c.slug === slug)?.category ?? "";
  const recent = cards.filter((c) => c.slug !== slug).slice(0, 6);
  return { item, category, recent };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const found = await findBlog(id);
  return found ? { title: found.item.title } : {};
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  const found = await findBlog(id);
  if (!found) notFound();
  return <Index {...found} />;
};

export default Page;
