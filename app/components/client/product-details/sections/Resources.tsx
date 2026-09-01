import { resourceData } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";
import { ResourceCard } from "./ResourceCard";
import Reveal from "../../animations/RevealItemsOneByOneAnimation";
import { moveUpV2 } from "../../animations/motionVariants";

export default function SpecifierResources() {
  return (
    <section className="w-full bg-white py-100">
      <div className="container">
        {/* Section 1 — Specifier Resources */}
        <AnimatedTitle
          text={resourceData.resourcesTitle}
          className="mb-40 section-title"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-3 gap-3 md:gap-30 3xl:gap-[29px] mb-100">
          {resourceData.specifierResources.map((resource, index) => (
            <Reveal variants={moveUpV2} delayRange={index * 0.01} key={index}>
              <ResourceCard
                item={resource}
                textColor="text-foreground"
                iconSrc="/assets/icons/certificates/1.svg"
                arrowIcon="/assets/icons/certificates/resource_down_arrow.svg"
                arrowSize={"h-3 w-3 xl:h-[18px] xl:w-[18px] 3xl:h-5 3xl:w-5"}
              />
            </Reveal>
          ))}
        </div>

        {/* Section 2 — Certifications */}
        <h2 className="mb-40 section-title">
          {resourceData.certificationsTitle}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-3 gap-30 3xl:gap-[29px]">
          {resourceData.certifications.map((certification, index) => (
            <Reveal variants={moveUpV2} delayRange={index * 0.01} key={index}>
              <ResourceCard
                item={certification}
                bgColor="bg-cream-background"
                btnBgColor="bg-white"
                textColor="text-foreground"
                iconSrc="/assets/icons/certificates/2.svg"
                arrowIcon="/assets/icons/certificates/resource_plus.svg"
                arrowSize={"h-3 w-3 xl:h-5 xl:w-5"}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
