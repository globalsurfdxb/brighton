import Image from "next/image";
import { lightBeyondData } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";
import AnimatedDivider from "../../animations/AnimatedDivider";

export default function LightBeyond() {

  return (
    <section className="w-full py-100">
      <div className="container">
        <div className="flex flex-col lg:flex-row justify-between gap-30 lg:gap-0 items-center">
          {/* Left */}
          <div className="w-full lg:w-1/2 flex flex-col flex-1">
            <AnimatedTitle text={lightBeyondData.title} className="section-title mb-5 sm:mb-40 mr-60" />
            <p className="text-subtitle text-description-color max-w-[40ch] mr-60">{lightBeyondData.subtitle}</p>
            <AnimatedDivider className="my-5 md:my-8 xl:mb-60 xl:mt-80 border-secondary" />
            <p className="text-description-4 text-description-color max-w-[81ch] mr-60">
              {lightBeyondData.description}
            </p>
          </div>

          {/* Right */}
          <div className="w-full lg:w-1/2 relative max-[767px]:max-h-[320px] max-[1023px]:max-h-[450px] aspect-[895/700] 3xl:w-[895px] 3xl:h-[700px] rounded-[10px] overflow-hidden">
            <Image
              src={lightBeyondData.image}
              alt={lightBeyondData.imageAlt}
              fill
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
