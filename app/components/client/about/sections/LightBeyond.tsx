"use client";

import Image from "next/image";
import { lightBeyondData } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";
import AnimatedDivider from "../../animations/AnimatedDivider";
import SectionDescription from "../../animations/SectionDescription";
import { moveLeft } from "../../animations/motionVariants";
import { motion } from "framer-motion";

export default function LightBeyond() {
  return (
    <section className="w-full py-100">
      <div className="container overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between gap-30 lg:gap-0 items-stretch">
          {/* Left */}
          <div className="w-full lg:w-1/2 flex flex-col flex-1 self-center py-50 xl:py-0">
            <AnimatedTitle
              text={lightBeyondData.title}
              className="section-title mb-5 sm:mb-40 mr-60"
            />
            <SectionDescription
              direction="y"
              className="text-subtitle text-description-color max-w-[40ch] mr-60"
              text={lightBeyondData.subtitle}
            />
            <AnimatedDivider className="my-5 md:my-8 xl:mb-60 xl:mt-80 border-secondary" />
            <SectionDescription
              direction="y"
              className="text-description-4 text-description-color max-w-[81ch] mr-60"
              text={lightBeyondData.description}
            />
          </div>

          {/* Right */}
          <motion.div
            variants={moveLeft(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="w-full lg:w-1/2 relative max-[767px]:max-h-[280px] max-[1023px]:max-h-[450px] aspect-[895/700] min-[1800px]:w-[895px] min-[1800px]:h-[700px] rounded-[10px] overflow-hidden"
          >
            <Image
              src={lightBeyondData.image}
              alt={lightBeyondData.imageAlt}
              fill
              className="object-cover object-center"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
