"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { whyChooseData } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";

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
          breakpoints={{
            480: { slidesPerView: 1.3 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
            1560: { slidesPerView: 5 },
          }}
          className="!pr-px !overflow-visible"
        >
          {whyChooseData.items.map((item, i) => (
            <SwiperSlide key={i}>
              <div className="border border-secondary rounded-[10px] p-40 h-[410px] 2xl:h-[440px] 3xl:h-[473px] -mr-px relative">
                <div className="absolute inset-0 rounded-[10px]" style={{background: "linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)"}} />
                <div className="relative h-full flex flex-col justify-between">
                    <div className="3xl:w-17.5 3xl:h-17.5 w-15 h-15 rounded-[5px] bg-primary flex items-center justify-center">
                      <Image
                        src={item.icon}
                        alt={item.title}
                        width={48}
                        height={48}
                        className="h-9 3xl:h-12 w-auto 3xl:w-12"
                      />
                    </div>
                    <p className="text-subtitle">{item.title}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
