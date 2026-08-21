"use client";

import Image from "next/image";
import { ringItems, sectionTitle, RingItem } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";
import { motion } from "framer-motion";
import SectionDescription from "../../animations/SectionDescription";

const CONTAINER_W = 892;
const CONTAINER_H = 756.5;

const px = (v: number, axis: "x" | "y") =>
  `${(v / (axis === "x" ? CONTAINER_W : CONTAINER_H)) * 100}%`;

type PointPosition = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  centered?: boolean;
  textSide: "left" | "right";
};

const pointPositions: Record<string, PointPosition> = {
  "02": {
    top: px(74, "y"),
    left: px(200, "x"),
    centered: true,
    textSide: "left",
  },
  "03": {
    top: px(74, "y"),
    right: px(200, "x"),
    centered: true,
    textSide: "right",
  },
  "01": {
    top: px(431, "y"),
    left: px(10, "x"),
    centered: true,
    textSide: "left",
  },
  "04": {
    top: px(431, "y"),
    right: px(10, "x"),
    centered: true,
    textSide: "right",
  },
};

function RingPoint({ item }: { item: RingItem }) {
  const pos = pointPositions[item.id];
  const isLeft = pos.textSide === "left";

  const wrapperStyle: React.CSSProperties = {
    top: pos.top,
    bottom: pos.bottom,
    left: pos.left,
    right: pos.right,
  };

  const translateX =
    pos.left !== undefined ? "-translate-x-1/2" : "translate-x-1/2";
  const translateY =
    pos.top !== undefined ? "-translate-y-1/2" : "translate-y-1/2";

  return (
    <div
      className={`absolute z-10 flex h-14 w-14 3xl:h-[70px] 3xl:w-[70px] items-start justify-center ${translateX} ${translateY}`}
      style={wrapperStyle}
    >
      <div className="flex h-full w-full items-center justify-center rounded-[5px] bg-primary text-trim text-subtitle text-secondary">
        {item.number}
      </div>

      <div
        className={`absolute w-max max-w-[260px] 3xl:max-w-[350px] ${
          isLeft
            ? "right-full mr-5 md:mr-70 2xl:mr-[73px] text-right"
            : "left-full ml-5 md:ml-70 2xl:ml-[73px] text-left"
        }`}
      >
        <AnimatedTitle className="mb-2.5 text-subtitle" text={item.title} />
        <SectionDescription
          direction="y"
          className="text-description-4 text-description-color"
          text={item.description}
        />
      </div>
    </div>
  );
}

export default function LabToLaunchRing() {
  return (
    <section className="w-full pt-100 min-[1800px]:pt-[93.5px] max-h-[849px] bg-cream-background">
      <div className="container overflow-hidden">
        <div className="relative mx-auto aspect-[892/756.5] w-full xl:max-w-[580px] 2xl:max-w-[695px] 3xl:max-w-[892px]">
          <div className="absolute inset-0 h-full w-full">
            <Image
              src="/assets/images/technology/ring.svg"
              alt="Lab to Launch Ring"
              fill
              className="object-contain pointer-events-none select-none"
            />
          </div>
          <div className="absolute bottom-[32%] 3xl:bottom-[259px] left-1/2 -translate-x-1/2 text-center">
            <AnimatedTitle
              className="section-title max-w-[20ch]"
              text={sectionTitle.title}
            />
          </div>
          {ringItems.map((item, index) => (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.32 * index }}
              viewport={{ once: true }}
              key={item.id}
            >
              <RingPoint item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
