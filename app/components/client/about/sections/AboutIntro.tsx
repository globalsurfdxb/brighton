import AnimatedTitle from "../../animations/AnimatedTitle";
import { aboutIntroData } from "../data";

export default function AboutIntro() {
  return (
    <section className="w-full border-t border-black pt-140 pb-100 min-[1920px]:pt-[168px]">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-20">
          <AnimatedTitle
            text={aboutIntroData.title}
            className="section-title max-w-[18ch]"
          />

          <div
            className="text-description-color text-description-4 max-w-[60ch] xl:mr-60 min-[1900px]:mr-[154px]"
            dangerouslySetInnerHTML={{ __html: aboutIntroData.description }}
          />
        </div>

        <div className="flex mt-100 gap-100">
          {aboutIntroData.stats.map((stat, i) => (
            <div key={i} className="flex items-stretch gap-30">
              <span className="w-px bg-secondary" />
              <div>
                <p className="section-title text-description-color">{stat.value}</p>
                <p className="text-subtitle text-description-color mt-[14px]">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
