import { resourceData } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";
import { ResourceCard } from "./ResourceCard";

export default function SpecifierResources() {
  return (
    <section className="w-full bg-white py-100">
      <div className="container">
        {/* Section 1 — Specifier Resources */}
        <AnimatedTitle
          text={resourceData.resourcesTitle}
          className="mb-40 section-title"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-3 gap-30 3xl:gap-[29px] mb-100">
          {resourceData.specifierResources.map((resource, index) => (
            <ResourceCard
              key={index}
              item={resource}
              textColor="text-foreground"
              iconSrc="/assets/icons/certificates/1.svg"
              arrowIcon="/assets/icons/certificates/resource_down_arrow.svg"
              arrowSize={18}
            />
          ))}
        </div>

        {/* Section 2 — Certifications */}
        <h2 className="mb-40 section-title">
          {resourceData.certificationsTitle}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-3 gap-30 3xl:gap-[29px]">
          {resourceData.certifications.map((certification, index) => (
            <ResourceCard
              key={index}
              item={certification}
              bgColor="bg-cream-background"
              textColor="text-foreground"
              iconSrc="/assets/icons/certificates/2.svg"
              arrowIcon="/assets/icons/certificates/resource_plus.svg"
              arrowSize={20}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
