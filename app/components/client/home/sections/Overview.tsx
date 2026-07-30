import Image from "next/image";
import { overviewData } from "../data";
import AnimatedDivider from "../../animations/AnimatedDivider";
import CustomButton from "../../common/CustomButton";
import AnimatedTitle from "../../animations/AnimatedTitle";
import Reveal from "../../animations/RevealItemsOneByOneAnimation";
import { moveUpV2 } from "../../animations/motionVariants";

export default function Overview() {
  return (
    <section className="container pt-60 pb-100 overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-30 lg:gap-80">
        {overviewData.stats.map((stat, index) => (
          <Reveal key={index} variants={moveUpV2} delayRange={index * 0.14}>
            <div className="flex flex-col">
              <div className="flex items-end justify-between">
                <span className="text-subtitle-2 text-primary uppercase">
                  {stat.label}
                </span>
                <Image
                  src={stat.icon}
                  alt={stat.label}
                  width={35}
                  height={45}
                  className="pointer-events-none w-auto h-[28px] lg:h-[35px] 2xl:h-10 3xl:h-[45px] mr-30 3xl:mr-[28px] mb-[2px] object-contain"
                />
              </div>
              <AnimatedDivider className="border-secondary mt-4 mb-30" />
              <p className="text-description-2 text-description-color">
                {stat.value}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-60 grid grid-cols-1 sm:grid-cols-2 gap-30">
        {overviewData.cards.map((card , index) => (
          <Reveal key={card.title} variants={moveUpV2} delayRange={index * 0.14}>
          <div
            key={card.title}
            className="group relative aspect-6/5 w-full overflow-hidden rounded-[10px] 3xl:aspect-auto min-[1800px]:h-[760px]"
          >
            {/* Video wrapper handles fit + clipping; scaling happens here, isolated */}
            <div className="absolute inset-0 overflow-hidden">
              <video
                className="h-full w-full object-cover"
                src={card.video}
                poster={card.poster}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
            </div>

            {/* Default gradient — fades out on hover */}
            <div
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,.85) 0%, rgba(0,0,0,0) 56.16%)",
              }}
              className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0"
            />

            {/* Hover gradient — fades in on hover */}
            <div
              style={{
                background:
                  "linear-gradient(180deg, rgba(0, 0, 0, 0.85) 15.33%, rgba(0, 0, 0, 0) 89.87%)",
              }}
              className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col p-40 3xl:p-[45px]">
              <AnimatedTitle
                tag="h3"
                text={card.title}
                className="text-subtitle text-white"
              />

              <div className="mt-[15px] overflow-hidden">
                <p className="text-description text-secondary mb-5 3xl:mb-[26px] max-w-[50ch] translate-y-6 opacity-0 transition-all duration-500 ease-out delay-0 group-hover:translate-y-0 group-hover:opacity-100">
                  {card.description}
                </p>

                <div className="translate-y-6 opacity-0 transition-all duration-500 ease-out delay-80 group-hover:translate-y-0 group-hover:opacity-100">
                  <CustomButton text={card.button} link="#" btnClass="w-fit" />
                </div>
              </div>
            </div>
          </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
