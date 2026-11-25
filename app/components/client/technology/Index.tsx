import Cta from "../common/Cta";
import InnerBanner from "../common/InnerBanner";
import EngineeredSystem from "./sections/EngineeredSystem";
import ImageDescription from "../common/ImageDescription";
import ScienceConsistency from "./sections/ScienceConsistency";
import IntroSection from "../common/IntroSection";
import PerformanceSpecify from "./sections/PerformanceSpecify";
import LabToLaunchRing from "./sections/LabToLaunchRing";
import type { TechnologyDoc } from "@/app/types/technology";

const Index = ({ data }: { data: TechnologyDoc }) => {
  const {
    bannerSection: banner,
    firstSection: first,
    secondSection: second,
    thirdSection: third,
    fourthSection: fourth,
    fifthSection: fifth,
    sixthSection: sixth,
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
        <IntroSection
          data={{ description: first.description ?? "" }}
          className="max-w-[115ch]"
        />
      )}

      {second && !second.isHidden && (
        <ImageDescription
          data={{
            title: second.title ?? "",
            description: second.description ?? "",
            image: second.Image ?? "",
            imageAlt: second.ImageAlt ?? "",
          }}
        />
      )}

      {third && !third.isHidden && (
        <LabToLaunchRing
          data={{
            title: third.title ?? "",
            items: (third.items ?? []).map((item, i) => {
              const number = String(i + 1).padStart(2, "0");
              return {
                id: number,
                number,
                title: item.title ?? "",
                description: item.description ?? "",
              };
            }),
          }}
        />
      )}

      {fourth && !fourth.isHidden && (
        <EngineeredSystem
          data={{
            title: fourth.title ?? "",
            description: fourth.description ?? "",
            image: fourth.image ?? "",
            imageAlt: fourth.imageAlt ?? "",
          }}
        />
      )}

      {fifth && !fifth.isHidden && (
        <PerformanceSpecify
          data={{
            title: fifth.title ?? "",
            items: (fifth.items ?? []).map((item) => ({
              title: item.title ?? "",
              description: item.description ?? "",
              icon: item.icon ?? "",
              iconAlt: item.iconAlt ?? "",
            })),
          }}
        />
      )}

      {sixth && !sixth.isHidden && (sixth.items?.length ?? 0) > 0 && (
        <ScienceConsistency
          data={{
            title: sixth.title ?? "",
            items: (sixth.items ?? []).map((item) => ({
              title: item.title ?? "",
              description: item.description ?? "",
              image: item.image ?? "",
              imageAlt: item.imageAlt ?? "",
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
