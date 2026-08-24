import Image from "next/image";
import { researchData } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";

export default function Research() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background image */}
      <Image
        src={researchData.image}
        alt={researchData.imageAlt}
        fill
        className="object-cover object-top -z-10"
      />

      {/* Overlay */}
      <div className="md:hidden absolute inset-0 bg-black/75" />
      <div
        className="hidden md:block absolute inset-0"
        style={{
          background:
            "linear-gradient(270deg, rgba(0, 0, 0, 0) 0%, rgba(10, 10, 10, 0.85) 81.69%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 container py-150 min-[1800px]:py-[178px]">
        <div>
          <AnimatedTitle
            text={researchData.title}
            className="section-title text-white mb-30 max-w-[15ch]"
          />
          <div
            className="text-description-4 text-white max-w-[793px]"
            dangerouslySetInnerHTML={{ __html: researchData.description }}
          />
        </div>
      </div>
    </section>
  );
}
