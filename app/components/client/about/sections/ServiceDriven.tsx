"use client";

import Image from "next/image";
import { serviceDrivenData } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";
import SectionDescription from "../../animations/SectionDescription";
import { motion } from "framer-motion";
import { moveLeft } from "../../animations/motionVariants";

export default function ServiceDriven() {
  return (
    <section className="w-full py-100 overflow-hidden">
      <div className="container">
        <div className="flex flex-col lg:flex-row justify-between gap-30 lg:gap-100 min-[1900px]:gap-[110px] items-center">
          {/* Left */}
          <div className="w-full lg:w-1/2 flex flex-col flex-1">
            <AnimatedTitle
              text={serviceDrivenData.title}
              className="section-title mb-30 lg:max-w-[13ch]"
            />
            <SectionDescription
              direction="y"
              className="text-description-4 text-description-color max-w-[83ch]"
              text={serviceDrivenData.description}
            />
          </div>

          {/* Right */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={moveLeft(0.1)}
            className="w-full lg:w-1/2 relative aspect-[895/600] 3xl:w-[895px] 3xl:h-[600px] rounded-[10px] overflow-hidden"
          >
            <Image
              src={serviceDrivenData.image || "/assets/images/placeholder.png"}
              alt={serviceDrivenData.imageAlt}
              fill
              className="object-cover object-center pointer-events-none"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
