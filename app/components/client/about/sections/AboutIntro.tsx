import AnimatedCounter from "../../animations/AnimatedCounter";
import AnimatedTitle from "../../animations/AnimatedTitle";
import SectionDescription from "../../animations/SectionDescription";
import { aboutIntroData } from "../data";

export default function AboutIntro() {
  return (
    <section className="w-full border-t border-black pt-100 md:pt-140 pb-100 min-[1920px]:pt-[168px]">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-5 lg:gap-50">
          <AnimatedTitle
            text={aboutIntroData.title}
            className="section-title max-w-[18ch]"
          />

          <SectionDescription
            as="div"
            direction="y"
            className="text-description-color text-description-4 lg:max-w-[60ch] min-[1900px]:max-w-[587px] xl:mr-60 min-[1900px]:mr-[154px]"
            html={aboutIntroData.description}
          />
        </div>

        <div className="flex mt-40 lg:mt-100 gap-100">
          {aboutIntroData.stats.map((stat, i) => (
            <div key={i} className="flex items-stretch gap-30">
              <span className="w-px bg-secondary max-h-[85%] mt-[5px]" />
              <div>
                <p className="section-title text-description-color">
                  <AnimatedCounter to={stat.value} offset={15} />
                </p>
                <AnimatedTitle text={stat.label} className="text-subtitle text-description-color mt-2.5 sm:mt-[14px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
