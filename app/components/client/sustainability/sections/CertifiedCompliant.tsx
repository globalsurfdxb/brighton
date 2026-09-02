"use client";

import Image from "next/image";
import { certifiedCompliantData } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";
import SectionDescription from "../../animations/SectionDescription";
import { moveRight } from "../../animations/motionVariants";
import { motion } from "framer-motion";

export default function CertifiedCompliant() {
  return (
    <section className="w-full py-100">
      <div className="container">
        <div className="flex flex-col sm:flex-row items-start md:items-center gap-30 lg:gap-80 overflow-hidden">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={moveRight(0.1)}
            className="relative w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] md:w-[220px] md:h-[220px] 2xl:w-[265px] 2xl:h-[265px] shrink-0 order-2 sm:order-1"
          >
            <Image
              src={certifiedCompliantData.image || "/assets/images/placeholder.png"}
              alt={certifiedCompliantData.imageAlt}
              fill
              className="object-contain pointer-events-none"
            />  
          </motion.div>

          <div className="order-1">
            <AnimatedTitle
              text={certifiedCompliantData.title}
              className="section-title mb-30"
            />
            <SectionDescription
              as="div"
              direction="y"
              html={certifiedCompliantData.description}
              className="text-description-4 text-description-color max-w-[120ch]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
