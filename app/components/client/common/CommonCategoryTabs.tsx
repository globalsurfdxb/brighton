"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import PillBtn from "./PillBtn";
import FilterSelectDropDown from "./FilterDropdown";
import Reveal from "../animations/RevealItemsOneByOneAnimation";
import { moveRight, moveUpV2 } from "../animations/motionVariants";
import { motion } from "framer-motion";

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
  mobileAllLabel?: string;
}

export default function CommonCategoryTabs({
  options,
  active,
  onChange,
  allLabel = "All",
  allId = "all",
  mobileAllLabel = "All",
}: CommonCategoryTabsProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  const activeLabel =
    active === allId
      ? allLabel
      : (options.find((opt) => opt.id === active)?.label ?? null);

  return (
    <>
      <motion.div
        variants={moveRight(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="w-full md:hidden"
      >
        <FilterSelectDropDown
          className="w-full"
          label={mobileAllLabel}
          options={options.map((opt) => opt.label)}
          value={active === allId ? null : activeLabel}
          onChange={(value) => {
            if (!value) {
              onChange(allId);
              return;
            }
            const match = options.find((opt) => opt.label === value);
            onChange(match ? match.id : allId);
          }}
        />
      </motion.div>

      <div className="hidden md:flex">
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
            <Reveal variants={moveUpV2} delayRange={0}>
              <PillBtn
                label={allLabel}
                active={active === allId}
                onClick={() => {
                  onChange(allId);
                  swiperRef.current?.slideTo(0);
                }}
              />
            </Reveal>
          </SwiperSlide>
          {options.map((opt, index) => (
            <SwiperSlide key={opt.id} className="!w-auto">
              <Reveal variants={moveUpV2} delayRange={index * 0.1}>
                <PillBtn
                  label={opt.label}
                  active={active === opt.id}
                  onClick={() => {
                    onChange(opt.id);
                    swiperRef.current?.slideTo(index + 1);
                  }}
                />
              </Reveal>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
