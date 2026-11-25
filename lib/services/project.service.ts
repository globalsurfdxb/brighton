import { unstable_cache } from "next/cache";
import connectDB from "@/lib/mongodb";
import Projects from "@/app/models/Projects";
import type { ProjectDoc, ProjectItem } from "@/app/types/project";
import { slugify } from "@/lib/utils/slugify";

export const getProjectsPage = unstable_cache(
  async (): Promise<ProjectDoc | null> => {
    await connectDB();
    const doc = await Projects.findOne({}).lean();
    return doc ? (JSON.parse(JSON.stringify(doc)) as ProjectDoc) : null;
  },
  ["projects-page"],
  { tags: ["Projects"], revalidate: 3600 },
);

export type ProjectCardItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  categoryLabel: string;
  region: string;
  image: string;
};

export function projectLookups(doc: ProjectDoc) {
  const sector = new Map(doc.sectors.map((s) => [String(s._id), s.title]));
  const region = new Map(doc.regions.map((r) => [String(r._id), r.title]));
  return { sector, region };
}

export function toProjectCards(doc: ProjectDoc): ProjectCardItem[] {
  const { sector, region } = projectLookups(doc);
  return doc.projects
    .filter((p) => !p.isHidden && p.slug)
    .map((p: ProjectItem) => {
      const sectorTitle = sector.get(String(([] as string[]).concat(p.sector ?? [])[0])) ?? "";
      return {
        id: p._id,
        slug: p.slug,
        title: p.title ?? "",
        category: slugify(sectorTitle),
        categoryLabel: sectorTitle,
        region: region.get(String(p.region)) ?? "",
        image: p.thumbImage ?? "",
      };
    });
}
