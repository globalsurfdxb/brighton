"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { productBannerData } from "../data";
import CustomButton from "../../common/CustomButton";

export default function ProductBanner() {
  const { category, subCategory, name, description, images, specs, buttons } =
    productBannerData;
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="w-full">
      <div className="mx-auto grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Left: Image gallery */}
        <div className="relative w-full 3xl:w-[896px]">
          <div className="relative aspect-[896/760] w-full overflow-hidden rounded-[10px] bg-cream-background 3xl:h-[760px] 3xl:w-[896px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.15 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.65, ease: [0.65, 0, 0.35, 1] }}
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
          <div className="absolute bottom-0 left-0 flex gap-[5px] p-3">
            {images.map((img, index) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`relative h-[70px] w-[80px] shrink-0 overflow-hidden rounded-[8px] bg-white transition-opacity duration-300 3xl:h-[100px] 3xl:w-[115px] ${
                  activeIndex === index
                    ? "opacity-100 ring-2 ring-black"
                    : "opacity-70 hover:opacity-100"
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
        <div className="flex flex-col gap-6">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            {category} · {subCategory}
          </p>

          <h1 className="font-serif text-6xl font-light leading-none text-black sm:text-7xl">
            {name}
          </h1>

          <p className="max-w-xl text-sm leading-relaxed text-neutral-600 sm:text-base">
            {description}
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {specs.map((spec) => (
              <div
                key={spec.value}
                className="flex h-[90px] w-full flex-col items-center justify-center rounded-[10px] bg-black px-3 text-center text-white sm:w-[130px]"
              >
                <span className="text-sm font-medium">{spec.value}</span>
                {spec.label && (
                  <span className="text-xs text-neutral-300">{spec.label}</span>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {buttons.map((button, index) => (
              <CustomButton
                key={index}
                text={button.text}
                link={button.link}
                btnClass="w-fit"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
