"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

import { projectDetailsData } from "../data";
import SliderNavBtn from "../../common/Slidernavbtn";
import { useContainerInset } from "@/app/hooks/useContainerInset";
import { useMediaQuery } from "@/app/hooks/useMediaQuery";
import AnimatedTitle from "../../animations/AnimatedTitle";
import AnimatedDivider from "../../animations/AnimatedDivider";
import { motion } from "framer-motion";
import { moveRight, moveUp, moveUpV2 } from "../../animations/motionVariants";
import Reveal from "../../animations/RevealItemsOneByOneAnimation";

export default function Main() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const inset = useContainerInset();
  const isDesktop = useMediaQuery(1280);

  return (
    <section
      style={{ paddingLeft: inset, paddingRight: isDesktop ? 0 : inset }}
      className="py-100 overflow-hidden xl:overflow-visible"
    >
      <div className="grid grid-cols-1 gap-5 md:gap-40 xl:grid-cols-[20%_auto] 3xl:grid-cols-[420px_1fr] 2xl:gap-[43px]">
        {/* Left - sticky meta */}
        <aside className="xl:sticky xl:top-100 xl:h-fit flex flex-col gap-3 md:gap-5 xl:gap-[26px]">
          <motion.div
            variants={moveRight(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <p className="text-15 leading-[1.533333334] text-description-color mb-[5px] font-itc-book tracking-[-0.01em]">
              Location
            </p>
            <p className="text-20 text-description-color font-itc-medium leading-[1.25] tracking-[-0.01em]">
              {projectDetailsData.location}
            </p>
            <AnimatedDivider className="border-secondary mt-3 md:mt-5 xl:mt-[26px]" />
          </motion.div>

          <motion.div
            variants={moveRight(0.15)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <p className="text-15 leading-[1.533333334] text-description-color mb-[5px] font-itc-book tracking-[-0.01em]">
              Sector
            </p>
            <p className="text-20 text-description-color leading-[1.25] tracking-[-0.01em] font-itc-medium">
              {projectDetailsData.sector}
            </p>
            <AnimatedDivider className="border-secondary mt-3 md:mt-5 xl:mt-[26px]" />
          </motion.div>
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
                slidesPerView: 1.166,
              },
            }}
            className="!overflow-visible"
          >
            {projectDetailsData.slides.map((slide, index) => (
              <SwiperSlide key={slide.id}>
                <Reveal variants={moveUpV2} delayRange={index * 0.09}>
                  <div className="relative aspect-[16/9] min-h-[240px] w-full overflow-hidden rounded-[10px]">
                    <Image
                      src={slide.image}
                      alt={slide.alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Reveal>
              </SwiperSlide>
            ))}
          </Swiper>

          <motion.div
            variants={moveUp(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-30 flex items-center gap-2.5"
          >
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
          </motion.div>

          <div
            style={{ paddingRight: isDesktop ? inset : "auto" }}
            className="mt-100"
          >
            <AnimatedTitle
              text={projectDetailsData.overviewTitle}
              className="section-title mb-30"
            />
            <motion.div
              variants={moveUp(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="news-content 2xl:mr-80 min-[1900]:max-w-[1202px]"
              dangerouslySetInnerHTML={{
                __html: projectDetailsData.overviewParagraphs,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
