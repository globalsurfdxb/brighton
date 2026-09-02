"use client";

import Image from "next/image";
import { qualityAssuranceData } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";
import { motion } from "framer-motion";
import { moveRight, moveUpV2 } from "../../animations/motionVariants";
import SectionDescription from "../../animations/SectionDescription";
import Reveal from "../../animations/RevealItemsOneByOneAnimation";

export default function QualityAssurance() {
  return (
    <section className="w-full py-100 bg-cream-background overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-stretch gap-30 md:gap-60 3xl:gap-80">
          {/* Left */}
          <motion.div
            variants={moveRight(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="w-full lg:w-[52%] relative max-[767px]:max-h-[280px] max-[1023px]:max-h-[450px] aspect-[895/820] min-[1800px]:w-[895px] min-[1800px]:h-[820px] shrink-0 rounded-[10px] overflow-hidden"
          >
            <Image
              src={
                qualityAssuranceData.image || "/assets/images/placeholder.png"
              }
              alt={qualityAssuranceData.imageAlt}
              fill
              className="object-cover object-center pointer-events-none"
            />
          </motion.div>

          {/* Right */}
          <div className="w-full lg:w-1/2 self-center">
            <AnimatedTitle
              className="section-title mb-20"
              text={qualityAssuranceData.title}
            />
            <SectionDescription
              direction="y"
              className="text-subtitle text-description-color mb-20 md:mb-40"
              text={qualityAssuranceData.subtitle}
            />
            <SectionDescription
              direction="y"
              className="text-description-4 text-description-color mb-30 md:mb-40 3xl:mb-60"
              text={qualityAssuranceData.description}
            />

            <div className="grid grid-cols-2">
              {qualityAssuranceData.items.map((item, i) => (
                <Reveal key={i} variants={moveUpV2} delayRange={i * 0.12}>
                  <div className="flex items-center gap-5 border border-secondary rounded-[10px] p-3 sm:p-5 3xl:p-30 -mr-px -mb-px">
                    <div className="w-10 h-10 md:w-12 md:h-12 3xl:w-15 3xl:h-15 shrink-0 rounded-[5px] bg-primary flex items-center justify-center">
                      <Image
                        src={item.icon || "/assets/images/placeholder.png"}
                        alt={item.title}
                        width={40}
                        height={40}
                        className="w-auto h-5.5 md:h-7 3xl:h-9 pointer-events-none"
                      />
                    </div>
                    <p className="text-description-5 text-description-color">
                      {item.title}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
