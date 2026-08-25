"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import PillBtn from "./PillBtn";

interface CategoryOption {
  id: string;
  label: string;
}

interface CommonCategoryTabsProps {
  options: CategoryOption[];
  active: string;
  onChange: (id: string) => void;
  allLabel?: string;
  allId?: string;
}

export default function CommonCategoryTabs({
  options,
  active,
  onChange,
  allLabel = "All",
  allId = "all",
}: CommonCategoryTabsProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <Swiper
      speed={800}
      slidesPerView="auto"
      spaceBetween={5}
      freeMode
      grabCursor
      allowTouchMove
      touchStartPreventDefault={false}
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
      }}
      className="w-full !overflow-visible"
    >
      <SwiperSlide className="!w-auto">
        <PillBtn
          label={allLabel}
          active={active === allId}
          onClick={() => {
            onChange(allId);
            swiperRef.current?.slideTo(0);
          }}
        />
      </SwiperSlide>
      {options.map((opt, index) => (
        <SwiperSlide key={opt.id} className="!w-auto">
          <PillBtn
            label={opt.label}
            active={active === opt.id}
            onClick={() => {
              onChange(opt.id);
              swiperRef.current?.slideTo(index + 1);
            }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
