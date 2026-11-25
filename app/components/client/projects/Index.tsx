import { Suspense } from "react";
import Cta from "../common/Cta";
import Main from "./sections/Main";
import type { ProjectDoc } from "@/app/types/project";
import { toProjectCards } from "@/lib/services/project.service";
import { slugify } from "@/lib/utils/slugify";

const Index = ({ data }: { data: ProjectDoc }) => {
  const cta = data.ctaSection;
  return (
    <>
      <Suspense>
        <Main
          data={{
            title: data.bannerSection?.title || "Projects",
            categories: (data.sectors ?? []).map((s) => ({
              id: slugify(s.title),
              label: s.title,
            })),
            regions: (data.regions ?? []).map((r) => r.title),
            projects: toProjectCards(data),
          }}
        />
      </Suspense>
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
