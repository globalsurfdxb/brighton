import Image from "next/image";
import { lightBeyondData } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";
import AnimatedDivider from "../../animations/AnimatedDivider";

export default function LightBeyond() {
  const { title, subtitle, description, image, imageAlt } = lightBeyondData;

  return (
    <section className="w-full py-100">
      <div className="container">
        <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-0 items-center">
          {/* Left */}
          <div className="w-full lg:w-1/2 flex flex-col flex-1">
            <AnimatedTitle text={title} className="section-title mb-40 mr-60" />
            <p className="text-subtitle text-description-color max-w-[40ch] mr-60">{subtitle}</p>
            <AnimatedDivider className="mb-60 mt-80 border-secondary" />
            <p className="text-description-4 text-description-color max-w-[81ch] mr-60">
              {description}
            </p>
          </div>

          {/* Right */}
          <div className="w-full lg:w-1/2 relative aspect-[895/700] 3xl:w-[895px] 3xl:h-[700px] rounded-[10px] overflow-hidden">
            <Image
              src={image}
              alt={imageAlt}
              fill
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
