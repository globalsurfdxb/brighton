"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

import { projectDetailsData } from "../data";
import SliderNavBtn from "../../common/Slidernavbtn";
import { useContainerInset } from "@/app/hooks/useContainerInset";
import { useMediaQuery } from "@/app/hooks/useMediaQuery";
import AnimatedTitle from "../../animations/AnimatedTitle";

export default function Main() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const inset = useContainerInset();
  const isDesktop = useMediaQuery(1280);

  return (
    <section style={{ paddingLeft: inset, paddingRight: isDesktop ? 0 : inset }} className="py-100 overflow-hidden xl:overflow-visible">
      <div className="grid grid-cols-1 gap-5 md:gap-10 xl:grid-cols-[320px_1fr] xl:gap-16">
        {/* Left - sticky meta */}
        <aside className="xl:sticky xl:top-100 xl:h-fit">
          <div className="border-b border-black/10 py-3 md:py-5 first:pt-0">
            <p className="text-sm text-description-color">Location</p>
            <p className="mt-1 text-base text-black">
              {projectDetailsData.location}
            </p>
          </div>
          <div className="border-b border-black/10 py-5">
            <p className="text-sm text-description-color">Sector</p>
            <p className="mt-1 text-base text-black">
              {projectDetailsData.sector}
            </p>
          </div>
        </aside>

        {/* Right - slider + overview */}
        <div className="xl:overflow-hidden">
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            speed={800}
            slidesPerView={1.15}
            spaceBetween={16}
            breakpoints={{
              1400: {
                slidesPerView: 1.1,
              },
            }}
            className="!overflow-visible"
          >
            {projectDetailsData.slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="relative aspect-[16/9] min-h-[240px] w-full overflow-hidden rounded-[10px]">
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="mt-30 flex items-center gap-2.5">
            <SliderNavBtn
              direction="prev"
              disabled={isBeginning}
              onClick={() => swiperRef.current?.slidePrev()}
            />
            <SliderNavBtn
              direction="next"
              disabled={isEnd}
              onClick={() => swiperRef.current?.slideNext()}
            />
          </div>

          <div className="mt-100">
            <AnimatedTitle text={projectDetailsData.overviewTitle} className="section-title mb-30" />
            <div>
              <div
                className="text-description text-description-color"
                dangerouslySetInnerHTML={{
                  __html: projectDetailsData.overviewParagraphs,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
