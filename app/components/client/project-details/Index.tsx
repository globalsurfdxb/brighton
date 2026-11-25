import Cta from "../common/Cta";
import FeaturedProjects from "../home/sections/FeaturedProjects";
import Main from "./sections/Main";
import ProjectBanner from "./sections/ProjectBanner";
import type { ProjectItem } from "@/app/types/project";
import type { ProjectCardItem } from "@/lib/services/project.service";

const Index = ({
  project,
  sector,
  region,
  others,
}: {
  project: ProjectItem;
  sector: string;
  region: string;
  others: ProjectCardItem[];
}) => {
  const cta = project.ctaSection;
  return (
    <>
      <ProjectBanner
        title={project.title ?? ""}
        image={project.bannerImage || "/assets/images/placeholder.png"}
      />
      <Main
        data={{
          location: region,
          sector,
          overviewTitle: project.contentTitle ?? "",
          overviewParagraphs: project.content ?? "",
          slides: (project.images ?? [])
            .filter((img) => img.url)
            .map((img, i) => ({
              id: `slide-${i + 1}`,
              image: img.url,
              alt: img.alt || project.title,
            })),
        }}
      />
      {others.length > 0 && (
        <FeaturedProjects
          data={{
            sectionTitle: "Discover Other Projects",
            projects: others.map((p) => ({
              title: p.title,
              slug: p.slug,
              image: p.image || "/assets/images/placeholder.png",
              location: p.region,
            })),
          }}
          className="bg-cream-background"
        />
      )}
      {cta && !cta.isHidden && (
        <Cta
          data={{
            title: cta.title ?? "",
            description: cta.description ?? "",
            button: { text: cta.buttonText ?? "", href: cta.buttonLink || "#" },
          }}
        />
      )}
    </>
  );
};

export default Index;
