import { researchInnovationData } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";
import SectionDescription from "../../animations/SectionDescription";
import Tilt3DImage from "../../common/Tilt3DImage";

export default function ResearchInnovation() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background image */}
      <Tilt3DImage
        src={researchInnovationData.image}
        alt={researchInnovationData.imageAlt}
        imgClassName="object-cover object-center"
        reveal
      />

      {/* Overlay */}
      <div className="lg:hidden absolute inset-0 bg-black/75 pointer-events-none" />
      <div
        className="hidden lg:block absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(270deg, rgba(0, 0, 0, 0.75) 43.75%, rgba(0, 0, 0, 0.2) 77.34%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full container mx-auto flex items-center justify-end py-150 lg:py-200 min-[1900px]:py-[235px] pointer-events-none">
        <div className="w-full lg:ml-auto lg:w-[49.3%] max-w-[897px]">
          <AnimatedTitle
            text={researchInnovationData.title}
            className="section-title text-white mb-30"
          />
          <SectionDescription
            direction="y"
            as="div"
            className="text-description-4 text-white"
            html={researchInnovationData.description}
          />
        </div>
      </div>
    </section>
  );
}
