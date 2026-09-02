"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { guidingPrinciplesData } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";
import { useMediaQuery } from "@/app/hooks/useMediaQuery";
import SectionDescription from "../../animations/SectionDescription";
import Reveal from "../../animations/RevealItemsOneByOneAnimation";
import { moveUpV2 } from "../../animations/motionVariants";

export default function GuidingPrinciples() {
  const [activeIndex, setActiveIndex] = useState(1);
  const isDesktop = useMediaQuery(1280);

  return (
    <section className="w-full py-100 overflow-hidden">
      <div className="container mx-auto">
        <AnimatedTitle
          text={guidingPrinciplesData.title}
          className="section-title mb-20"
        />
        <SectionDescription
          direction="y"
          className="text-subtitle max-w-[50ch] text-description-color pb-40 lg:pb-100"
          text={guidingPrinciplesData.description}
        />

        <Swiper
          slidesPerView={1.2}
          spaceBetween={15}
          breakpoints={{
            640: { slidesPerView: 1.4, spaceBetween: 10 },
            768: { slidesPerView: 1.6, spaceBetween: 10 },
            1024: { slidesPerView: 2.1, spaceBetween: 10 },
            1280: { slidesPerView: 3, spaceBetween: 1.8 },
          }}
          className="!overflow-visible xl:!overflow-hidden"
        >
          {guidingPrinciplesData.items.map((item, i) => {
            const isActive = isDesktop ? activeIndex === i : true;

            return (
              <SwiperSlide key={i}>
                <Reveal variants={moveUpV2} delayRange={i * 0.12}>
                  <div
                    onMouseEnter={() => isDesktop && setActiveIndex(i)}
                    onClick={() => !isDesktop && setActiveIndex(i)}
                    className="relative h-[280px] md:h-[340px] lg:h-[400px]  2xl:h-[480px] 3xl:h-[680px] rounded-[10px] overflow-hidden group"
                  >
                    <Image
                      src={item.image || "/assets/images/placeholder.png"}
                      alt={item.imageAlt}
                      fill
                      className="object-cover object-center pointer-events-none"
                    />

                    {/* Overlay */}
                    <div
                      className="hidden 3xl:block absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.75) 94.63%)",
                      }}
                    />

                    <div
                      className="absolute inset-0 3xl:hidden"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.75) 75.63%)",
                      }}
                    />

                    {/* Content */}
                    <div className="absolute left-0 right-0 bottom-0 p-6 sm:p-50">
                      <div
                        className={`transition-transform duration-500 ease-out ${
                          item.description && isActive ? "-translate-y-20" : ""
                        }`}
                      >
                        <AnimatedTitle
                          text={item.title}
                          className="text-white text-subtitle"
                        />
                      </div>

                      {item.description && (
                        <motion.p
                          animate={isActive ? "active" : "rest"}
                          variants={{
                            rest: { opacity: 0, y: 10, height: 0 },
                            active: { opacity: 1, y: 0, height: "auto" },
                          }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="text-white text-description-4 overflow-hidden max-w-[413px]"
                        >
                          {item.description}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </Reveal>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
