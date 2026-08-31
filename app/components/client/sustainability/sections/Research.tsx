import { researchData } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";
import Tilt3DImage from "../../common/Tilt3DImage";
import SectionDescription from "../../animations/SectionDescription";

export default function Research() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background image */}
      <Tilt3DImage
        src={researchData.image}
        alt={researchData.imageAlt}
        imgClassName="object-cover object-top"
        reveal
      />

      {/* Overlay */}
      <div className="md:hidden absolute inset-0 bg-black/75 pointer-events-none" />
      <div
        className="hidden md:block absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(270deg, rgba(0, 0, 0, 0) 0%, rgba(10, 10, 10, 0.85) 81.69%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 container py-150 min-[1800px]:py-[178px] pointer-events-none">
        <div>
          <AnimatedTitle
            text={researchData.title}
            className="section-title text-white mb-30 max-w-[15ch]"
          />
          <SectionDescription
            as="div"
            direction="y"
            html={researchData.description}
            className="text-description-4 text-white max-w-[793px]"
          />
        </div>
      </div>
    </section>
  );
}
