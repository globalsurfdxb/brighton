import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Index from "@/app/components/client/project-details/Index";
import {
  getProjectsPage,
  projectLookups,
  toProjectCards,
} from "@/lib/services/project.service";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function findProject(slug: string) {
  const data = await getProjectsPage();
  const project = data?.projects.find((p) => p.slug === slug && !p.isHidden);
  if (!data || !project) return null;
  const { sector, region } = projectLookups(data);
  const cards = toProjectCards(data).filter((p) => p.slug !== slug);
  const featured = new Set(data.projects.filter((p) => p.featured).map((p) => p.slug));
  const others = [
    ...cards.filter((p) => featured.has(p.slug)),
    ...cards.filter((p) => !featured.has(p.slug)),
  ].slice(0, 6);
  return {
    project,
    sector: sector.get(String(([] as string[]).concat(project.sector ?? [])[0])) ?? "",
    region: region.get(String(project.region)) ?? "",
    others,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const found = await findProject(id);
  return found ? { title: found.project.title } : {};
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  const found = await findProject(id);
  if (!found) notFound();
  return <Index {...found} />;
};

export default Page;
