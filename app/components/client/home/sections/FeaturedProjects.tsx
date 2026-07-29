"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

import { featuredProjectsData } from "../data";
import { useContainerInset } from "@/app/hooks/useContainerInset";
import AnimatedDivider from "../../animations/AnimatedDivider";
import AnimatedDividerTwo from "../../animations/AnimatedDividerTwo";

export default function FeaturedProjects() {
  const { sectionTitle, projects } = featuredProjectsData;
  const inset = useContainerInset();

  return (
    <section className="py-100 overflow-hidden">
      <div className="container">
        <h2 className="section-title mb-40 ">{sectionTitle}</h2>
        <div className="cursor-grab">
          <Swiper
            // modules={[Autoplay]}
            spaceBetween={15}
            slidesPerView={1.2}
            // autoplay={{
            //   delay: 4000,
            //   disableOnInteraction: false,
            // }}
            speed={800}
            loop={false}
            breakpoints={{
              640: {
                slidesPerView: 1.5,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 1.8,
                spaceBetween: 20,
              },
              1400: {
                slidesPerView: 2.1841,
                spaceBetween: 24,
              },
              1700: {
                slidesPerView: 2.1841,
                spaceBetween: 30,
              }
            }}
            className="!overflow-visible"
          >
            {projects.map(({ title, image, location }, index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-col group">
                  <h3 className="text-subtitle text-primary line-clamp-1">{title}</h3>
                  <AnimatedDividerTwo className="border-secondary mt-5 mb-40" hoverColor="#0A0A0A" />
                  <div className="relative w-full h-[280px] md:h-[360px] 2xl:h-[420px] 3xl:h-[520px] rounded-[10px] overflow-hidden">
                    <Image
                      src={image}
                      alt={title}
                      fill
                      className="pointer-events-none object-cover group-hover:scale-105 transition-all duration-500 ease-in-out"
                    />
                    <div className="absolute top-5 right-5 rounded-full bg-black/50 px-[19px] py-[9.5px] flex justify-center items-center border border-secondary">
                      <span className="text-15 leading-none max-h-[11px] text-secondary font-itc-medium">{location}</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
