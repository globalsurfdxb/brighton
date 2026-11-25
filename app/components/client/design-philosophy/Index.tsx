import InnerBanner from "../common/InnerBanner";
import Cta from "../common/Cta";
import GuidingPrinciples from "./sections/GuidingPrinciples";
import QualityAssurance from "./sections/QualityAssurance";
import type { DesignPhilosophyDoc } from "@/app/types/designPhilosophy";

const Index = ({ data }: { data: DesignPhilosophyDoc }) => {
  const {
    bannerSection: banner,
    firstSection: first,
    secondSection: second,
    ctaSection: cta,
  } = data;

  return (
    <>
      <InnerBanner
        data={{
          title: banner?.title ?? "",
          image: banner?.image ?? "",
          imageAlt: banner?.imageAlt ?? "",
        }}
      />

      {first && !first.isHidden && (
        <GuidingPrinciples
          data={{
            title: first.title ?? "",
            description: first.subTitle ?? "",
            items: (first.items ?? []).map((item) => ({
              image: item.image ?? "",
              imageAlt: item.imageAlt ?? "",
              title: item.title ?? "",
              description: item.description ?? "",
            })),
          }}
        />
      )}

      {second && !second.isHidden && (
        <QualityAssurance
          data={{
            image: second.image ?? "",
            imageAlt: second.imageAlt ?? "",
            title: second.title ?? "",
            subtitle: second.subTitle ?? "",
            description: second.description ?? "",
            items: (second.items ?? []).map((item) => ({
              icon: item.icon ?? "",
              iconAlt: item.iconAlt ?? "",
              title: item.title ?? "",
            })),
          }}
        />
      )}

      {cta && !cta.isHidden && (
        <Cta
          data={{
            title: cta.title ?? "",
            description: cta.description ?? "",
            button: {
              text: cta.buttonText ?? "",
              href: cta.buttonLink || "#",
            },
          }}
        />
      )}
    </>
  );
};

export default Index;
