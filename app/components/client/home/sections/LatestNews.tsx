import Image from "next/image";
import { newsData } from "../data";
import AnimatedDivider from "../../animations/AnimatedDivider";
import AnimatedTitle from "../../animations/AnimatedTitle";
import { moveUpV2 } from "../../animations/motionVariants";
import Reveal from "../../animations/RevealItemsOneByOneAnimation";

export function NewsCard({ image, title, date, category }: any) {
  return (
    <div className="flex flex-col lg:flex-row gap-[30px] group cursor-pointer">
      <div className="relative h-[230px] 3xl:h-[275px] w-auto shrink-0 aspect-348/275 rounded-[10px] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
      </div>

      <div className="flex flex-col lg:mt-30">
        <div className="flex items-center justify-between text-16 leading-[100%] text-description-color tracking-[-0.01em] font-itc-medium pr-90 min-[1850px]:pr-[95px]">
          <span>{date}</span>
          <span className="uppercase">{category}</span>
        </div>

        <AnimatedDivider
          className="border-secondary my-3 lg:mt-4 lg:mb-6 min-[1850px]:mb-[26px]"
          hoverColor="#0A0A0A"
        />

        <h3 className="text-subtitle mb-6 min-[1850px]:mb-[26px] line-clamp-2">
          {title}
        </h3>

        <Image
          src="/assets/icons/right-top-arrow-black.svg"
          alt=""
          width={20}
          height={20}
          className="pointer-events-none group-hover:rotate-45 group-hover:translate-x-[5px] transition-all duration-500"
        />
      </div>
    </div>
  );
}

export default function LatestNews() {
  return (
    <section className="py-100 bg-cream-background">
      <div className="container">
        <AnimatedTitle
          tag="h2"
          text={newsData.sectionTitle}
          className="section-title mb-40"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-60 min-[1850px]:gap-x-[66px] gap-y-10 lg:gap-y-[30px]">
          {newsData.news.map((item, index) => (
            <Reveal key={index} variants={moveUpV2} delayRange={index * 0.12}>
            <NewsCard key={index} {...item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
