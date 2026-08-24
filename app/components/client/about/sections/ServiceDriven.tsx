import Image from "next/image";
import { serviceDrivenData } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";

export default function ServiceDriven() {

  return (
    <section className="w-full py-100">
      <div className="container">
        <div className="flex flex-col lg:flex-row justify-between gap-30 lg:gap-100 min-[1900px]:gap-[110px] items-center">
          {/* Left */}
          <div className="w-full lg:w-1/2 flex flex-col flex-1">
            <AnimatedTitle text={serviceDrivenData.title} className="section-title mb-30 lg:max-w-[13ch]" />
            <p className="text-description-4 text-description-color max-w-[83ch]">
              {serviceDrivenData.description}
            </p>
          </div>

          {/* Right */}
          <div className="w-full lg:w-1/2 relative aspect-[895/600] 3xl:w-[895px] 3xl:h-[600px] rounded-[10px] overflow-hidden">
            <Image
              src={serviceDrivenData.image}
              alt={serviceDrivenData.imageAlt}
              fill
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
