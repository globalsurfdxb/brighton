"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

import { subcategories as allSubcategories } from "../data";
import Reveal from "../../animations/RevealItemsOneByOneAnimation";
import { moveUpV2 } from "../../animations/motionVariants";

interface Props {
  subcategories: typeof allSubcategories;
  active: string;
  onChange: (id: string) => void;
}

export default function SubCategoryTabs({ subcategories, active, onChange }: Props) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [swiperReady, setSwiperReady] = useState(false);

  useEffect(() => {
    if (!swiperReady || !swiperRef.current) return;
    const index = subcategories.findIndex((s) => s.id === active);
    if (index !== -1) {
      swiperRef.current.slideTo(index);
    }
  }, [active, swiperReady, subcategories]);

  return (
    <Swiper
      speed={800}
      slidesPerView="auto"
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
        setSwiperReady(true);
      }}
      className="!overflow-visible"
    >
      {subcategories.map((sub, index) => {
        const isActive = active === sub.id;

        return (
          <SwiperSlide key={sub.id} className="!w-auto">
            <Reveal key={index} variants={moveUpV2} delayRange={index * 0.03}>
              <button
                style={
                  {
                    "--fill-color": "var(--color-primary, #0A0A0A)",
                  } as React.CSSProperties
                }
                type="button"
                onClick={() => onChange(sub.id)}
                className={`cursor-pointer btn-fill-center shrink-0 flex items-center gap-3 rounded-[10px] border border-secondary px-3 py-[15px] text-left transition-colors duration-500 3xl:min-w-[303px] ${
                  index !== subcategories.length - 1 ? "-mr-px" : ""
                } ${
                  isActive
                    ? "bg-primary text-white z-0"
                    : "text-description-color hover:text-white z-10"
                }`}
              >
                <span className="flex 3xl:w-17.5 3xl:h-17.5 2xl:w-15 2xl:h-15 w-12 h-12 shrink-0 items-center justify-center rounded-full bg-[#D9D9D9]">
                  <Image
                    src={sub.icon}
                    alt=""
                    width={30}
                    height={30}
                    className="h-6 lg:h-[30px] w-auto"
                  />
                </span>

                <span className="min-w-[186px] max-w-[186px] text-16 font-itc-medium leading-[1.375] tracking-[-0.01em]">
                  {sub.title}
                </span>
              </button>
            </Reveal>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}