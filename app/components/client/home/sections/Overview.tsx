
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-20 md:gap-0 lg:gap-80">
        {overviewData.stats.map((stat, index) => (
          <Reveal key={index} variants={moveUpV2} delayRange={index * 0.14}>
            <div className="flex flex-col bg-cream-background md:bg-transparent p-3.75 md:p-0 rounded-[8px] md:rounded-none">
              <div className="flex items-end justify-between">
                <span className="text-[15px] md:text-16 leading-[100%] font-itc-medium tracking-[-0.01em] text-primary uppercase">
                  {stat.label}
                </span>
                <Image
                  src={stat.icon}
                  alt={stat.label}
                  width={35}
                  height={45}
                  className="pointer-events-none w-9 md:w-auto h-9 lg:h-9.5 2xl:h-10 3xl:h-[45px] md:mr-30 3xl:mr-[28px] mb-[2px] object-contain"
                />
              </div>
              <AnimatedDivider className="border-secondary mt-3.75 md:mt-4 mb-3.75 md:mb-30" />
              <p className="text-description-2 text-description-color">
                {stat.value}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-60 grid grid-cols-1 md:grid-cols-2 gap-3.75 sm:gap-30">
        {overviewData.cards.map((card, index) => (
          <Reveal
            key={card.title}
            variants={moveUpV2}
            delayRange={index * 0.14}
          >
            <div
              key={card.title}
              className="group relative min-h-[325px] sm:min-h-[400px] md:min-h-auto md:aspect-6/5 w-full overflow-hidden rounded-[10px] 3xl:aspect-auto min-[1800px]:h-[760px]"
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

              {/* Default gradient desktop — fades out on hover */}
              <div
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,.85) 0%, rgba(0,0,0,0) 56.16%)",
                }}
                className="hidden 2xl:block absolute inset-0 transition-opacity duration-500 group-hover:opacity-0"
              />

              <div
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,.85) 0%, rgba(0,0,0,0) 90.16%)",
                }}
                className="hidden md:block 2xl:hidden absolute inset-0 transition-opacity duration-500 group-hover:opacity-0"
              />

              {/* Default gradient mobile — fades out on hover */}
              <div
                style={{
                  background:
                    "linear-gradient(0deg, #000000 0%, rgba(0, 0, 0, 0) 49.85%)",
                }}
                className="md:hidden absolute inset-0"
              />

              {/* Hover gradient — fades in on hover */}
              <div
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0, 0, 0, 0.85) 15.33%, rgba(0, 0, 0, 0) 89.87%)",
                }}
                className="hidden md:block absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />

              {/* Content */}
              <div className="absolute bottom-0 left-0 md:top-0 flex flex-col p-5 sm:p-40 3xl:p-[45px]">
                <AnimatedTitle
                  tag="h3"
                  text={card.title}
                  className="text-subtitle text-white"
                />

                <div className="mt-2.5 md:mt-3.75 overflow-hidden">
                  <p className="text-description text-secondary 2xl:mb-5 3xl:mb-[26px] max-w-[50ch] 2xl:translate-y-6 2xl:opacity-0 transition-all duration-500 ease-out delay-0 2xl:group-hover:translate-y-0 2xl:group-hover:opacity-100">
                    {card.description}
                  </p>

                  <div className="hidden xl:block translate-y-6 opacity-0 transition-all duration-500 ease-out delay-80 group-hover:translate-y-0 group-hover:opacity-100">
                    <CustomButton
                      text={card.button}
                      link="#"
                      btnClass="w-fit"
                    />
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
