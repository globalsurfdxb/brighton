import Image from "next/image";
import { overviewData } from "../data";
import AnimatedDivider from "../../animations/AnimatedDivider";
import CustomButton from "../../common/CustomButton";

export default function Overview() {
  return (
    <section className="container pt-60 pb-100 overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-30 lg:gap-80">
        {overviewData.stats.map((stat) => (
          <div key={stat.label} className="flex flex-col">
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
        ))}
      </div>

      <div className="mt-60 grid grid-cols-1 sm:grid-cols-2 gap-30">
        {overviewData.cards.map((card) => (
          <div
            key={card.title}
            className="group relative aspect-6/5 w-full overflow-hidden rounded-[10px] 3xl:aspect-auto min-[1800px]:h-[760px]"
          >
            <video
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              src={card.video}
              poster={card.poster}
              autoPlay
              muted
              loop
              playsInline
            />

            <div
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,.85) 0%, rgba(0,0,0,0) 56.16%)",
              }}
              className="absolute inset-0 transition-all duration-500 group-hover:bg-black/35"
            />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col p-40 3xl:p-[45px]">
              <h3 className="text-subtitle text-white">{card.title}</h3>

              <div
                className="
    mt-[15px]
    overflow-hidden
  "
              >
                <div
                  className="
      translate-y-6
      opacity-0
      transition-all
      duration-500
      ease-out
      group-hover:translate-y-0
      group-hover:opacity-100
    "
                >
                  <p className="text-description text-secondary mb-5 3xl:mb-[26px] max-w-[50ch]">
                    {card.description}
                  </p>

                  <CustomButton text={card.button} link="#" btnClass="w-fit" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
