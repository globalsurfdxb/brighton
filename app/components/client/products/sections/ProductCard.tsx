"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedDivider from "../../animations/AnimatedDivider";

export default function ProductCard({ product }: { product: any }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex h-[260px] items-center justify-center overflow-hidden rounded-[10px] bg-cream-background sm:h-[340px] md:h-[400px] lg:h-[430px] 3xl:h-[540px]">
        {/* Base image — scales down on hover */}
        <motion.div
          className="absolute inset-0"
          animate={{ scale: isHovered ? 0.72 : 1 }}
          transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain"
          />
        </motion.div>

{/* Hover image — bottom-to-top reveal */}
<AnimatePresence>
  {isHovered && product.hoverImage && (
    <motion.div
      className="absolute inset-0"
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
      exit={{ clipPath: "inset(100% 0% 0% 0%)" }}
      transition={{ duration: 0.52, ease: [0.65, 0, 0.35, 1] }}
    >
      {/* Slight scale-in on the image itself for depth */}
      <motion.div
        className="relative h-full w-full"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        exit={{ scale: 1.1 }}
        transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
      >
        <Image
          src={product.hoverImage}
          alt={product.title}
          fill
          className="object-cover"
        />

        {/* Gradient overlay — hover image only */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0) 43.24%, rgba(0, 0, 0, 0.25) 100%)",
          }}
        />
      </motion.div>

      {/* Corner arrow icon */}
      <motion.div
        className="absolute left-30 bottom-30"
        initial={{ opacity: 0, y: 40, x: -40, scale: 0.6 }}
        animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, x: -40, scale: 0.6 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Image
          src="/assets/icons/right-top-arrow-white.svg"
          className="invert brightness-0"
          alt=""
          width={40}
          height={40}
        />
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
      </div>

      <div className="mt-30">
        <h3 className="text-subtitle">{product.title}</h3>
        <AnimatedDivider
          className="mt-2.5 mb-5 border-secondary"
          hoverColor="#0A0A0A"
        />
        <p className="text-description-3 text-description-color">
          {product.subtitle}
        </p>
      </div>
    </div>
  );
}
