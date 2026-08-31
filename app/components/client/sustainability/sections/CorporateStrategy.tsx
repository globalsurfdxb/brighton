"use client";

import Image from "next/image";
import { corporateStrategyData } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";
import SectionDescription from "../../animations/SectionDescription";
import { moveLeft, moveUp } from "../../animations/motionVariants";
import { motion } from "framer-motion";

export default function CorporateStrategy() {
  const { title, description, image, imageAlt } = corporateStrategyData;

  return (
    <section className="w-full">
      <div className="container overflow-hidden">
        <div className="bg-cream-background rounded-[10px] overflow-hidden grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-[1fr_909px]">
          {/* Left */}
          <div className="flex flex-col justify-center px-40 lg:px-60 py-60 lg:py-150 3xl:py-[197px] lg:pr-80">
            <AnimatedTitle
              text={title}
              className="section-title mb-20 sm:mb-30"
            />
            <SectionDescription
              direction="y"
              text={description}
              className="text-subtitle text-description-color"
            />
          </div>

          {/* Right */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={moveLeft(0.1)}
            className="relative w-full min-h-[280px] md:min-h-[320px] rounded-[10px] overflow-hidden"
          >
            <Image
              src={image}
              alt={imageAlt}
              fill
              className="object-cover object-top"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
