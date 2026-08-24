"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { scienceConsistencyData } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";
import PlusMinusIcon from "./PlusMinusIcon";
import { useLenis } from "../../layout/LenisProvider";

export default function ScienceConsistency() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [baseImage, setBaseImage] = useState(
    scienceConsistencyData.items[1].image,
  );
  const { scrollTo } = useLenis();

  return (
    <section className="w-full py-100 bg-cream-background">
      <div className="container">
        <AnimatedTitle
          text={scienceConsistencyData.title}
          className="section-title mb-5 sm:mb-40"
        />

        <div
          id="science-consistency"
          className="flex flex-col lg:flex-row gap-30 items-stretch"
        >
          {/* Left - image */}
          <div className="hidden lg:block relative w-full lg:w-[50%] xl:w-[52%] shrink-0 aspect-[895/700] 3xl:w-[895px] 3xl:h-[700px] rounded-[10px] overflow-hidden">
            <Image
              src={baseImage}
              alt=""
              fill
              className="object-cover object-center pointer-events-none"
            />

            <motion.div
              key={activeIndex}
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
              onAnimationComplete={() =>
                setBaseImage(scienceConsistencyData.items[activeIndex].image)
              }
              className="absolute inset-0"
            >
              <Image
                src={scienceConsistencyData.items[activeIndex].image}
                alt={scienceConsistencyData.items[activeIndex].imageAlt}
                fill
                className="object-cover object-center pointer-events-none"
              />
            </motion.div>
          </div>

          {/* Right - accordion */}
          <div className="flex flex-col gap-30 w-full lg:flex-1 lg:pb-[50px] xl:pb-0">
            {scienceConsistencyData.items.map((item, i) => {
              const isActive = activeIndex === i;

              return (
                <div
                  key={i}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() =>
                    scrollTo("#science-consistency", { offset: -15 })
                  }
                  className="rounded-[10px] p-30 3xl:px-50 3xl:py-40 cursor-pointer relative"
                  style={{
                    background:
                      "linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)",
                  }}
                >
                  <div
                    className={`absolute right-20 flex items-center justify-between transition-all duration-300 ${
                      isActive ? "top-20" : "top-30"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 3xl:w-10 3xl:h-10 flex items-center justify-center rounded-[5px] transition-colors duration-500 ${
                        isActive ? "bg-primary" : "bg-secondary"
                      }`}
                    >
                      <PlusMinusIcon isActive={isActive} />
                    </div>
                  </div>
                  <AnimatedTitle
                    tag={"h3"}
                    className="text-subtitle text-primary text-trim max-w-[88%]"
                    text={item.title}
                  />

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <p className="text-description-4 text-description-color max-w-[80%] mt-30">
                          {item.description}
                        </p>

                        {/* Mobile / Tablet image */}
                        <div className="lg:hidden relative w-full aspect-[895/700] max-h-[280px] md:max-h-[380px] mt-30 rounded-[10px] overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.imageAlt}
                            fill
                            className="object-cover object-center"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
