"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedTitle from "../../animations/AnimatedTitle";
import PlusMinusIcon from "../../technology/sections/PlusMinusIcon";
import { useLenis } from "../../layout/LenisProvider";
import Reveal from "../../animations/RevealItemsOneByOneAnimation";
import { moveRight, moveUpV2 } from "../../animations/motionVariants";

interface ServiceTabSectionProps {
  data: {
    sectionTitle: string;
    items: {
      id: string;
      title: string;
      image: string;
      description: string;
    }[];
  };
}

const ServiceTabSection = ({ data }: ServiceTabSectionProps) => {
  const items = data.items ?? [];
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const [baseImage, setBaseImage] = useState<string>(items[0]?.image ?? "");

  const activeIndex = items.findIndex((item) => item.id === activeId);
  const activeItem = items[activeIndex] ?? items[0];

  const mid = Math.ceil(items.length / 2);
  const columns = [items.slice(0, mid), items.slice(mid)];

  const handleSelect = (id: string) => {
    if (id === activeId) return;
    setActiveId(id);
  };

  const { scrollTo } = useLenis();

  return (
    <section className="py-100">
      <div className="container">
        <AnimatedTitle
          text={data.sectionTitle}
          className="section-title mb-4 xl:mb-40"
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-[1.15fr_1fr] min-[1800px]:grid-cols-[895px_auto] gap-60 2xl:gap-80">
          {/* Image (desktop only) */}
          <motion.div
            variants={moveRight(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative hidden xl:block"
          >
            <div className="relative w-full rounded-[10px] overflow-hidden bg-cream-background lg:min-h-full 3xl:min-h-[720px]">
              <Image
                src={baseImage}
                alt=""
                fill
                className="object-cover object-center pointer-events-none"
              />

              {activeItem && (
                <motion.div
                  key={activeIndex}
                  initial={{ clipPath: "inset(0 100% 0 0)" }}
                  animate={{ clipPath: "inset(0 0% 0 0)" }}
                  transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
                  onAnimationComplete={() => setBaseImage(activeItem.image)}
                  className="absolute inset-0"
                >
                  <Image
                    src={activeItem.image}
                    alt={activeItem.title}
                    fill
                    className="object-cover object-center pointer-events-none"
                  />
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Right side */}
          <div className="flex flex-col xl:pt-70 pb-50 3xl:pb-0">
            {/* ---- Desktop: two-column tab list ---- */}
            <div className="hidden xl:grid grid-cols-2 gap-x-40 3xl:gap-[45px] mb-100 3xl:mb-150">
              {columns.map((col, colIdx) => (
                <Reveal
                  key={colIdx}
                  variants={moveUpV2}
                  delayRange={colIdx * 0.1}
                >
                  <div className="flex flex-col">
                    {col.map((item) => {
                      const isActive = activeItem?.id === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelect(item.id)}
                          onMouseEnter={() => handleSelect(item.id)}
                          className="group flex items-center justify-between border-b border-secondary last:border-b-0 text-left pr-20 py-2 xl:py-3 first:pt-0 last:pb-0"
                        >
                          <span
                            className={`text-subtitle-3 transition-colors duration-500 ${
                              isActive
                                ? "text-primary"
                                : "text-description-color group-hover:text-primary"
                            }`}
                          >
                            {item.title}
                          </span>

                          <span className="relative h-7.5 w-7.5 shrink-0">
                            <AnimatePresence>
                              {isActive && (
                                <motion.div
                                  initial={{ opacity: 0, x: -15 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -15 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 25,
                                  }}
                                  className="absolute inset-0 flex items-center justify-center rounded-[5px] bg-black text-white"
                                >
                                  <Image
                                    src="/assets/icons/right-top-arrow-secondary.svg"
                                    width={13.33}
                                    height={13.33}
                                    className="object-contain w-auto h-3.25 shrink-0"
                                    alt="icon-arrow"
                                  />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </Reveal>
              ))}
            </div>

            {/* ---- Desktop: active description ---- */}
            <div className="hidden xl:block overflow-hidden">
              <AnimatePresence mode="wait">
                {activeItem && (
                  <motion.div
                    key={activeItem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
                  >
                    <AnimatedTitle
                      text={activeItem.title}
                      className="text-subtitle mb-20 lg:mb-6 3xl:mb-[26px]"
                    />
                    <p className="text-description-4 text-description-color max-w-[68ch] pl-0.5 pb-6 xl:pb-10 2xl:pb-12 3xl:pb-0">
                      {activeItem.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ---- Mobile / Tablet: accordion ---- */}
            <div className="xl:hidden flex flex-col">
              {items.map((item) => {
                const isActive = activeItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    id={`accordion-item-${item.id}`}
                    className="border-b border-secondary"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        const willOpen = !isActive;
                        setActiveId(isActive ? "" : item.id);
                        if (willOpen) {
                          setTimeout(() => {
                            scrollTo(`#accordion-item-${item.id}`, {
                              offset: -15,
                            });
                          }, 410);
                        }
                      }}
                      className="flex w-full items-center justify-between gap-4 py-4 text-left"
                    >
                      <span
                        className={`text-subtitle transition-colors duration-500 ${
                          isActive ? "text-primary" : "text-description-color"
                        }`}
                      >
                        {item.title}
                      </span>

                      <div
                        className={`w-8 h-8 3xl:w-10 3xl:h-10 flex items-center justify-center rounded-[5px] transition-colors duration-500 ${
                          isActive ? "bg-primary" : "bg-secondary"
                        }`}
                      >
                        <PlusMinusIcon isActive={isActive} />
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <p className="text-description-4 text-description-color">
                            {item.description}
                          </p>

                          {/* Mobile / Tablet image */}
                          <div className="xl:hidden relative w-full aspect-[895/700] max-h-[280px] md:max-h-[380px] lg:max-h-[450px] mt-30 mb-30 rounded-[10px] overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.title}
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
};

export default ServiceTabSection;
