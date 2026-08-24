"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { energyEfficiencyData } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";
import PlusMinusIcon from "../../technology/sections/PlusMinusIcon";

export default function EnergyEfficiency() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [baseImage, setBaseImage] = useState(
    energyEfficiencyData.items[1].image,
  );

  return (
    <section className="w-full py-100 overflow-hidden">
      <div className="container">
        <div className="flex flex-col 2xl:flex-row items-start">
          {/* Left - title + description */}
          <div className="w-full 2xl:w-auto 2xl:max-w-[30%] min-[1900px]:max-w-[463px] pt-60 mr-40 3xl:mr-80 mb-40 2xl:mb-0">
            <AnimatedTitle
              text={energyEfficiencyData.title}
              className="section-title mb-30 sm:mb-50 2xl:mb-60"
            />
            <p className="text-description-4 text-description-color lg:max-w-[78%] 2xl:max-w-full ">
              {energyEfficiencyData.description}
            </p>
          </div>

          {/* Middle - image */}
          <div className="relative flex flex-row w-full">
            <div className="hidden lg:block relative lg:w-[50%] 2xl:w-auto shrink-0 2xl:aspect-[587/667] 2xl:h-[480px] 3xl:w-[587px] 3xl:h-[667px] rounded-[10px] overflow-hidden mr-40 3xl:mr-70 min-[1900px]:mr-[73px]">
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
                  setBaseImage(energyEfficiencyData.items[activeIndex].image)
                }
                className="absolute inset-0"
              >
                <Image
                  src={energyEfficiencyData.items[activeIndex].image}
                  alt={energyEfficiencyData.items[activeIndex].imageAlt}
                  fill
                  className="object-cover object-center pointer-events-none"
                />
              </motion.div>
            </div>
            {/* Right - accordion */}
            <div className="flex flex-col gap-2.5 w-full lg:w-[50%] 2xl:max-w-[617px] self-center 3xl:self-start 3xl:pt-60 xl:pb-100 2xl:pb-0">
              {energyEfficiencyData.items.map((item, i) => {
                const isActive = activeIndex === i;
                return (
                  <div
                    key={i}
                    onMouseEnter={() => setActiveIndex(i)}
                    className="rounded-[10px] p-30 3xl:py-40 cursor-pointer relative"
                    style={{
                      background:
                        "linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)",
                    }}
                  >
                    <div
                      className={`absolute right-20 flex items-center justify-between transition-all duration-300 ${
                        isActive ? "top-20" : "top-1/2 -translate-y-1/2"
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
                      className="text-subtitle text-primary text-trim max-w-[90%]"
                      text={item.title}
                    />
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <p className="text-description-4 text-description-color max-w-[80%] mt-30">
                            {item.description}
                          </p>
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
      </div>
    </section>
  );
}
