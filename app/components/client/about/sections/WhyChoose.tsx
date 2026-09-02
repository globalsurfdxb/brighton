"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { whyChooseData } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";
import Reveal from "../../animations/RevealItemsOneByOneAnimation";
import { moveUpV2 } from "../../animations/motionVariants";

export default function WhyChoose() {
  return (
    <section className="w-full py-100 bg-cream-background overflow-hidden">
      <div className="container">
        <AnimatedTitle
          text={whyChooseData.title}
          className="section-title mb-40"
        />

        <Swiper
          slidesPerView={1.3}
          autoHeight
          speed={800}
          breakpoints={{
            480: { slidesPerView: 1.3 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
            1560: { slidesPerView: 5 },
          }}
          className="!pr-px !overflow-visible md:!overflow-hidden [&_.swiper-wrapper]:!items-stretch [&_.swiper-slide]:!h-auto"
        >
          {whyChooseData.items.map((item, i) => (
            <SwiperSlide key={i}>
              <Reveal variants={moveUpV2} delayRange={i * 0.08} className="h-full">
                <div className="border border-secondary rounded-[10px] p-40 -mr-px relative h-full">
                  <div
                    className="absolute inset-0 rounded-[10px]"
                    style={{
                      background:
                        "linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)",
                    }}
                  />
                  <div className="relative h-full flex flex-col gap-[90px] lg:gap-200 3xl:gap-[209px]">
                    <div className="3xl:w-17.5 3xl:h-17.5 2xl:w-15 2xl:h-15 w-12 h-12 rounded-[5px] bg-primary flex items-center justify-center shrink-0">
                      <Image
                        src={item.icon || "/assets/images/placeholder.png"}
                        alt={item.title}
                        width={48}
                        height={48}
                        className="h-6 2xl:h-9 3xl:h-12 w-auto 3xl:w-12 pointer-events-none"
                      />
                    </div>
                    <p className="text-subtitle">{item.title}</p>
                  </div>
                </div>
              </Reveal>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
