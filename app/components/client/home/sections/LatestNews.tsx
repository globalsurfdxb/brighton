"use client";

import Image from "next/image";
import { newsData } from "../data";
import AnimatedDivider from "../../animations/AnimatedDivider";
import AnimatedTitle from "../../animations/AnimatedTitle";
import { moveUpV2 } from "../../animations/motionVariants";
import Reveal from "../../animations/RevealItemsOneByOneAnimation";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";

export function NewsCard({ image, title, date, category }: any) {
  return (
    <Link href={`/news/${title.toLowerCase().replace(/ /g, "-")}`}>
    <div className="flex flex-col 2xl:flex-row gap-30 group cursor-pointer">
      <div className="relative h-[221px] sm:h-[230px] lg:h-[250px] 2xl:h-[220px] 3xl:h-[275px] w-auto shrink-0 aspect-348/275 rounded-[10px] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="pointer-events-none object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
      </div>

      <div className="flex flex-col lg:mt-30">
        <div className="flex items-center justify-between text-[11px] sm:text-16 leading-[1.54545455] sm:leading-[100%] text-description-color tracking-[-0.01em] font-itc-medium pr-[45px] sm:pr-90 min-[1850px]:pr-[95px]">
          <span>{date}</span>
          <span className="uppercase">{category}</span>
        </div>

        <AnimatedDivider
          className="border-secondary my-3.75 lg:mt-4 lg:mb-6 min-[1850px]:mb-[26px]"
          hoverColor="#0A0A0A"
        />

        <h3 className="text-subtitle 2xl:mb-6 min-[1850px]:mb-[26px] line-clamp-2">
          {title}
        </h3>

        <Image
          src="/assets/icons/right-top-arrow-black.svg"
          alt=""
          width={20}
          height={20}
          className="hidden 2xl:block pointer-events-none group-hover:rotate-45 group-hover:translate-x-[5px] transition-all duration-500"
        />
      </div>
    </div>
    </Link>
  );
}

export default function LatestNews() {
  return (
    <section className="py-100 bg-cream-background overflow-hidden">
      <div className="container">
        <AnimatedTitle
          tag="h2"
          text={newsData.sectionTitle}
          className="section-title mb-5 sm:mb-40"
        />
        <div className="hidden 2xl:grid grid-cols-1 lg:grid-cols-2 gap-x-60 min-[1850px]:gap-x-[66px] gap-y-10 lg:gap-y-[30px]">
          {newsData.news.map((item, index) => (
            <Reveal key={index} variants={moveUpV2} delayRange={index * 0.12}>
              <NewsCard key={index} {...item} />
            </Reveal>
          ))}
        </div>

        <div className="2xl:hidden">
          <Swiper
            spaceBetween={15}
            speed={800}
            slidesPerView={1.2687}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2.4,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
            }}
            className="!overflow-visible lg:!overflow-hidden"
          >
            {newsData.news.map((item, index) => (
              <SwiperSlide key={index}>
                <NewsCard key={index} {...item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
