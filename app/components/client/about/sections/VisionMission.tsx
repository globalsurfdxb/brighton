import { visionMissionData } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";
import SectionDescription from "../../animations/SectionDescription";
import Tilt3DImage from "../../common/Tilt3DImage";

export default function VisionMission() {
  return (
    <section className="container max-h-[620px]">
      <div className="relative w-full max-w-[1920px] mx-auto p-0 rounded-[10px] overflow-hidden">
        {/* Background image */}
        <Tilt3DImage
          src={visionMissionData.image}
          alt={visionMissionData.imageAlt}
          imgClassName="object-cover object-center"
          reveal
        />
        {/* Right panel */}
        <div className="md:ml-auto w-full md:w-[49.3%] max-w-[897px] flex flex-col z-10 pointer-events-none">
          {visionMissionData.items.map((item, i) => (
            <div
              key={i}
              className="flex-1 p-7 lg:p-80 3xl:py-[84px] 3xl:px-[89px] border border-secondary md:rounded-[10px] -mb-px relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/60 md:rounded-[10px]" />
              <div className="relative z-10">
                <AnimatedTitle
                  text={item.title}
                  className="text-white text-subtitle mb-20"
                />
                <SectionDescription
                  direction="y"
                  as="div"
                  className="text-white text-description-4 max-w-[682px]"
                  html={item.description}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
