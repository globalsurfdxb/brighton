import Image from "next/image";
import { engineeredSystemData } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";

export default function EngineeredSystem() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background image */}
      <Image
        src={engineeredSystemData.image}
        alt={engineeredSystemData.imageAlt}
        fill
        className="object-cover object-center -z-10"
      />

      {/* Overlay */}
      <div className="md:hidden absolute inset-0 bg-black/75" />
      <div
        className="hidden md:block absolute inset-0"
        style={{
          background:
            "linear-gradient(270deg, rgba(0, 0, 0, 0) 15.1%, rgba(0, 0, 0, 0.8) 85.36%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 container py-150 min-[1800px]:py-[235px]">
        <div>
          <AnimatedTitle
            text={engineeredSystemData.title}
            className="section-title text-white mb-30 max-w-[15ch]"
          />
          <p className="text-description-4 text-white max-w-[730px]">
            {engineeredSystemData.description}
          </p>
        </div>
      </div>
    </section>
  );
}
