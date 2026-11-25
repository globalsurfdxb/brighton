import InnerBanner from "../common/InnerBanner";
import IntroSection from "../common/IntroSection";
import ServiceTabSection from "./sections/ServiceTabSection";
import SectorsGrid from "./sections/SectorsGrid";
import ProcessSection from "./sections/ProcessSection";
import Cta from "../common/Cta";
import type { ServiceDoc } from "@/app/types/services";

const Index = ({ data }: { data: ServiceDoc }) => {
  const {
    bannerSection: banner,
    firstSection: first,
    secondSection: second,
    thirdSection: third,
    fourthSection: fourth,
    ctaSection: cta,
  } = data;

  return (
    <>
      {banner && !banner.isHidden && (
        <InnerBanner
          data={{
            title: banner.title || data.name,
            image: banner.image ?? "",
            imageAlt: banner.imageAlt ?? "",
          }}
        />
      )}

      {first && !first.isHidden && (
        <IntroSection
          data={{
            description: first.title ?? "",
            linkText: first.btnText ?? "",
            link: first.btnLink ?? "",
          }}
          className="max-w-244.25"
        />
      )}

      {second && !second.isHidden && (second.items?.length ?? 0) > 0 && (
        <ServiceTabSection
          data={{
            sectionTitle: second.title ?? "",
            items: second.items.map((item, i) => ({
              id: `capability-${i + 1}`,
              title: item.title ?? "",
              image: item.image ?? "",
              description: item.description ?? "",
            })),
          }}
        />
      )}

      {third && !third.isHidden && (
        <SectorsGrid
          data={{
            title: third.title ?? "",
            items: (third.items ?? []).map((item, i) => ({
              id: `sector-${i + 1}`,
              title: item.title ?? "",
              icon: item.icon ?? "",
            })),
          }}
        />
      )}

      {fourth && !fourth.isHidden && (
        <ProcessSection
          data={{
            title: fourth.title ?? "",
            items: (fourth.items ?? []).map((item, i) => ({
              id: String(i + 1).padStart(2, "0"),
              title: item.title ?? "",
              description: item.description ?? "",
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
