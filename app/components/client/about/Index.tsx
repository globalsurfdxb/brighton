import InnerBanner from "../common/InnerBanner";
import AboutIntro from "./sections/AboutIntro";
import LightBeyond from "./sections/LightBeyond";
import VisionMission from "./sections/VisionMission";
import WhyChoose from "./sections/WhyChoose";
import ResearchInnovation from "./sections/ResearchInnovation";
import ServiceDriven from "./sections/ServiceDriven";
import Cta from "../common/Cta";
import type { AboutDoc } from "@/app/types/about";

const Index = ({ data }: { data: AboutDoc }) => {
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
        <AboutIntro
          data={{
            title: first.title ?? "",
            description: first.description ?? "",
            stats: (first.items ?? []).map((item) => ({
              value: item.value ?? "",
              label: item.label ?? "",
            })),
          }}
        />
      )}

      {second && !second.isHidden && (
        <VisionMission
          data={{
            image: second.Image ?? "",
            imageAlt: second.ImageAlt ?? "",
            items: (second.items ?? []).map((item) => ({
              title: item.title ?? "",
              description: item.description ?? "",
            })),
          }}
        />
      )}

      {third && !third.isHidden && (
        <LightBeyond
          data={{
            title: third.title ?? "",
            subtitle: third.subTitle ?? "",
            description: third.description ?? "",
            image: third.image ?? "",
            imageAlt: third.imageAlt ?? "",
          }}
        />
      )}

      {fourth && !fourth.isHidden && (
        <WhyChoose
          data={{
            title: fourth.title ?? "",
            items: (fourth.items ?? []).map((item) => ({
              icon: item.image ?? "",
              iconAlt: item.imageAlt ?? "",
              title: item.title ?? "",
            })),
          }}
        />
      )}

      {fifth && !fifth.isHidden && (
        <ResearchInnovation
          data={{
            title: fifth.title ?? "",
            description: fifth.description ?? "",
            image: fifth.image ?? "",
            imageAlt: fifth.imageAlt ?? "",
          }}
        />
      )}

      {sixth && !sixth.isHidden && (
        <ServiceDriven
          data={{
            title: sixth.title ?? "",
            description: sixth.description ?? "",
            image: sixth.image ?? "",
            imageAlt: sixth.imageAlt ?? "",
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
