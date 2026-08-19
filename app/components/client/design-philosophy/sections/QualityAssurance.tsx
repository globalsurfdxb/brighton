import Image from "next/image";
import { qualityAssuranceData } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";

export default function QualityAssurance() {
  return (
    <section className="w-full py-100 bg-cream-background">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-60 3xl:gap-80">
          {/* Left */}
          <div className="w-full lg:w-[52%] relative aspect-[895/820] 3xl:w-[895px] 3xl:h-[820px] shrink-0 rounded-[10px] overflow-hidden">
            <Image
              src={qualityAssuranceData.image || "/assets/images/placeholder.png"}
              alt={qualityAssuranceData.imageAlt}
              fill
              className="object-cover object-center pointer-events-none"
            />
          </div>

          {/* Right */}
          <div className="w-full lg:w-1/2">
            <AnimatedTitle className="section-title mb-20" text={qualityAssuranceData.title} />
            <p className="text-subtitle text-description-color mb-40">
              {qualityAssuranceData.subtitle}
            </p>
            <p className="text-description-4 text-description-color mb-40 3xl:mb-60">
              {qualityAssuranceData.description}
            </p>

            <div className="grid grid-cols-2">
              {qualityAssuranceData.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-5 border border-secondary rounded-[10px] p-5 3xl:p-30 -mr-px -mb-px"
                >
                  <div className="w-12 h-12 3xl:w-15 3xl:h-15 shrink-0 rounded-[5px] bg-primary flex items-center justify-center">
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={40}
                      height={40}
                      className="w-auto h-7 3xl:h-9 pointer-events-none"
                    />
                  </div>
                  <p className="text-description-5 text-description-color">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}