"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { productBannerData } from "../data";
import CustomButton from "../../common/CustomButton";
import AnimatedDivider from "../../animations/AnimatedDivider";

export default function ProductBanner() {
  const { category, subCategory, name, description, images, specs, buttons } =
    productBannerData;
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="w-full pt-140 3xl:pt-[146px] container">
      <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-15">
        {/* Left: Image gallery */}
        <div className="relative w-full lg:w-[110%] 3xl:w-[896px]">
          <div className="relative aspect-[896/760] w-full overflow-hidden rounded-[10px] bg-cream-background 3xl:h-[760px] 3xl:w-[896px]">
            <AnimatePresence initial={false}>
              <motion.div
                key={activeIndex}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.12 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={images[activeIndex].src}
                  alt={images[activeIndex].alt}
                  fill
                  className="pointer-events-none object-cover"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Thumbnails */}
          <div className="absolute bottom-0 left-0 flex gap-[5px] p-2.5">
            {images.map((img, index) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`cursor-pointer relative h-[80px] w-[90px] shrink-0 overflow-hidden rounded-[10px] bg-white transition-opacity duration-300 3xl:h-[100px] 3xl:w-[115px] ${
                  activeIndex === index ? " ring ring-secondary" : ""
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="pointer-events-none object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex flex-col">
          <p className="text-subtitle-2 text-description-color uppercase mb-30 min-[1920px]:min-h-[19px]">
            {category} · {subCategory}
          </p>

          <h1 className="hero-title mb-60">{name}</h1>

          <p className="text-description-4 text-description-color mb-30 min-[1900px]:max-w-[80ch]">
            {description}
          </p>

          <div className="flex lg:flex-nowrap gap-[5px] mb-50">
            {specs.map((spec) => (
              <div
                key={spec}
                className="flex flex-1 min-w-0 aspect-square 3xl:flex-none 3xl:w-[162px] 3xl:h-[162px] px-20 flex-col items-center justify-center rounded-[10px] bg-primary text-description-4 text-center text-white"
              >
                <span className="text-trim">{spec}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-[9px]">
            <CustomButton
              variant="2"
              text={buttons[0].text}
              link={buttons[0].link}
              btnClass="w-fit"
            />
            <CustomButton
              variant="3"
              text={buttons[1].text}
              link={buttons[1].link}
              btnClass="w-fit"
              iconDirection="down"
            />
          </div>
        </div>
      </div>

      <AnimatedDivider className="border-primary mt-100" />
    </section>
  );
}
