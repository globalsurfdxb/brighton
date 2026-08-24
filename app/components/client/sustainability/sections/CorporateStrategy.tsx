import Image from "next/image";
import { corporateStrategyData } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";

export default function CorporateStrategy() {
  const { title, description, image, imageAlt } = corporateStrategyData;

  return (
    <section className="w-full">
      <div className="container">
        <div className="bg-cream-background rounded-[10px] overflow-hidden grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-[1fr_909px]">
          {/* Left */}
          <div className="flex flex-col justify-center px-5 sm:px-40 lg:px-60 py-60 lg:py-150 3xl:py-[197px] pr-80">
            <AnimatedTitle text={title} className="section-title mb-30" />
            <p className="text-subtitle text-description-color">
              {description}
            </p>
          </div>

          {/* Right */}
          <div className="relative w-full min-h-[280px] md:min-h-[320px] rounded-[10px] overflow-hidden">
            <Image
              src={image}
              alt={imageAlt}
              fill
              className="object-cover object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
