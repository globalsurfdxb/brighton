import Image from "next/image";
import { overviewData } from "../data";
import AnimatedDivider from "../../animations/AnimatedDivider";

export default function Overview() {
  return (
    <section className="container pt-60 pb-100 overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-80">
        {overviewData.stats.map((stat) => (
          <div key={stat.label} className="flex flex-col">
            <div className="flex items-end justify-between">
              <span className="text-subtitle-2 text-primary uppercase">
                {stat.label}
              </span>
              <Image
                src={stat.icon}
                alt={stat.label}
                width={50}
                height={50}
                className="w-auto h-auto pr-30 pb-[6px]"
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
            className="relative aspect-6/5 w-full overflow-hidden rounded-[10px] 3xl:aspect-auto min-[1800px]:h-[760px]"
          >
            <video
              className="absolute inset-0 h-full w-full object-cover"
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
                  "linear-gradient(180deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0) 56.16%)",
              }}
              className="absolute inset-0"
            />
            <h3 className="absolute left-50 top-40 3xl:top-[45px] text-white text-subtitle">
              {card.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
