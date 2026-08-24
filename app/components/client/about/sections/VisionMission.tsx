import Image from "next/image";
import { visionMissionData } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";

export default function VisionMission() {
  return (
    <section className="container max-h-[620px]">
        <div className="relative w-full max-w-[1920px] mx-auto p-0 rounded-[10px] overflow-hidden">
          {/* Background image */}
          <Image
            src={visionMissionData.image}
            alt={visionMissionData.imageAlt}
            fill
            className="object-cover object-center -z-10"
          />
          {/* Right panel */}
          <div className="md:ml-auto w-full md:w-[49.3%] max-w-[897px] flex flex-col z-10">
            {visionMissionData.items.map((item, i) => (
              <div
                key={i}
                className="flex-1 p-5 md:p-6 lg:p-80 3xl:py-[84px] 3xl:px-[89px] border border-secondary md:rounded-[10px] -mb-px relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-black/60 md:rounded-[10px]" />
                <div className="relative z-10">
                  <AnimatedTitle text={item.title} className="text-white text-subtitle mb-20" />
                  <div
                    className="text-white text-description-4 max-w-[682px]"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
    </section>
  );
}
