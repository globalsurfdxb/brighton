import Image from "next/image";
import { researchInnovationData } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";

export default function ResearchInnovation() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background image */}
      <Image
        src={researchInnovationData.image}
        alt={researchInnovationData.imageAlt}
        fill
        className="object-cover object-center -z-10"
      />

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(270deg, rgba(0, 0, 0, 0.75) 43.75%, rgba(0, 0, 0, 0.2) 77.34%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full container mx-auto flex items-center justify-end py-200 min-[1900px]:py-[235px]">
        <div className="ml-auto w-[49.3%] max-w-[897px]">
            <AnimatedTitle text={researchInnovationData.title} className="section-title text-white mb-30" />
          <div
            className="text-description-4 text-white"
            dangerouslySetInnerHTML={{
              __html: researchInnovationData.description,
            }}
          />
        </div>
      </div>
    </section>
  );
}
