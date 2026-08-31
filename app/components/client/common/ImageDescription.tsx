"use client";

import Image from "next/image";
import AnimatedTitle from "../animations/AnimatedTitle";
import { moveRight } from "../animations/motionVariants";
import { motion } from "framer-motion";
import SectionDescription from "../animations/SectionDescription";

interface ImageDescriptionProps {
  data: {
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  };
}

export default function ImageDescription({ data }: ImageDescriptionProps) {
  return (
    <section className="w-full py-100 overflow-hidden">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between gap-5 md:gap-8 lg:gap-80 items-stretch">
          {/* Left */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={moveRight(0.1)}
            className="w-full md:w-1/2 relative max-[639px]:max-h-[380px] max-[767px]:max-h-[400px] aspect-[895/640] 3xl:w-[895px] 3xl:h-[640px] rounded-[10px] overflow-hidden"
          >
            <Image
              src={data.image}
              alt={data.imageAlt}
              fill
              className="object-cover object-center"
            />
          </motion.div>

          {/* Right */}
          <div className="w-full lg:w-1/2 flex flex-col flex-1 self-center py-20 xl:py-0">
            <AnimatedTitle text={data.title} className="section-title mb-30" />
            <SectionDescription
              direction="y"
              text={data.description}
              className="text-description-4 text-description-color"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
