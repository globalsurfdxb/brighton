"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";

import { featuredProductsData } from "../data";
import SliderNavBtn from "../../common/Slidernavbtn";
import AnimatedDivider from "../../animations/AnimatedDivider";

export default function FeaturedProducts() {
  const { sectionTitle, projects } = featuredProductsData;

  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [progress, setProgress] = useState(0);

  const updateState = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);

    if (swiper.isEnd) {
      setProgress(1);
      return;
    }
    if (swiper.isBeginning) {
      setProgress(0);
      return;
    }

    const totalSlides = swiper.slides.length;
    const visible =
      typeof swiper.params.slidesPerView === "number"
        ? swiper.params.slidesPerView
        : 1;
    const maxIndex = Math.max(totalSlides - visible, 1);
    const current = swiper.activeIndex / maxIndex;
    setProgress(Math.min(Math.max(current, 0), 1));
  };

  return (
    <section className="w-full py-16 3xl:py-24 bg-cream-background">
      <div className="container">
        {/* Top row: title, progress line, nav buttons */}
        <div className="flex items-center justify-between  mb-40">
          <h2 className="section-title">
            {sectionTitle}
          </h2>

          <div className="flex items-center gap-80 min-[1850px]:gap-[87px]">
            <div className="hidden sm:block w-[140px] h-[2px] bg-secondary relative overflow-hidden rounded-full">
              <span
                className="absolute left-0 top-0 h-px bg-description-color transition-all duration-400 rounded-full"
                style={{ width: `${progress * 100}%` }}
              />
            </div>

            <div className="flex items-center gap-2.5">
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
          </div>
        </div>

        {/* Slider */}
        <div className="cursor-grab">
          <Swiper
            // modules={[Autoplay]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              updateState(swiper);
            }}
            onSlideChange={updateState}
            onProgress={updateState}
            spaceBetween={30}
            speed={800}
            slidesPerView={1.2}
            // autoplay={{
            //   delay: 4000,
            //   disableOnInteraction: false,
            // }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1400: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
              1700: {
                slidesPerView: 4,
                spaceBetween: 30
              }
            }}
          >
            {projects.map((project , index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-col group">
                  <div className="relative w-full h-[300px] md:h-[400px] 2xl:h-[450px] 3xl:h-[540px] rounded-[10px] overflow-hidden mb-30">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-all duration-500 ease-in-out"
                    />
                  </div>
                  <h3 className="text-subtitle text-primary line-clamp-1">{project.title}</h3>
                  <AnimatedDivider className="border-secondary mt-2.5 mb-5" hoverColor="#0A0A0A" />
                  <p className="text-description-3 text-description-color">{project.label}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}