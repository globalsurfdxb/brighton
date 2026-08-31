import { engineeredSystemData } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";
import Tilt3DImage from "../../common/Tilt3DImage";

export default function EngineeredSystem() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background image */}
      <Tilt3DImage
        src={engineeredSystemData.image}
        alt={engineeredSystemData.imageAlt}
        imgClassName="object-cover object-center"
        reveal
      />

      {/* Overlay */}
      <div className="md:hidden absolute inset-0 bg-black/75 pointer-events-none" />
      <div
        className="hidden md:block absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(270deg, rgba(0, 0, 0, 0) 15.1%, rgba(0, 0, 0, 0.8) 85.36%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 container py-150 min-[1800px]:py-[230px] pointer-events-none">
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
