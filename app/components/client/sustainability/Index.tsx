import Cta from "../common/Cta";
import InnerBanner from "../common/InnerBanner";
import IntroSection from "../common/IntroSection";
import ImageDescription from "../common/ImageDescription";
import CorporateStrategy from "./sections/CorporateStrategy";
import CertifiedCompliant from "./sections/CertifiedCompliant";
import Research from "./sections/Research";
import EnergyEfficiency from "./sections/EnergyEfficiency";
import type { SustainabilityDoc } from "@/app/types/sustainability";

const block = (s?: {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
}) => ({
  title: s?.title ?? "",
  description: s?.description ?? "",
  image: s?.image ?? "",
  imageAlt: s?.imageAlt ?? "",
});

const Index = ({ data }: { data: SustainabilityDoc }) => {
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

      {second && !second.isHidden && (second.items?.length ?? 0) > 0 && (
        <EnergyEfficiency
          data={{
            title: second.title ?? "",
            description: second.description ?? "",
            items: (second.items ?? []).map(block),
          }}
        />
      )}

      {third && !third.isHidden && <Research data={block(third)} />}

      {fourth && !fourth.isHidden && <ImageDescription data={block(fourth)} />}

      {fifth && !fifth.isHidden && (
        <CorporateStrategy
          data={block({ ...fifth, description: fifth.subTitle })}
        />
      )}

      {sixth && !sixth.isHidden && <CertifiedCompliant data={block(sixth)} />}

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
