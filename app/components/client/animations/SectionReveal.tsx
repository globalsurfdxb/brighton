"use client";

import { motion, type Variants } from "framer-motion";
import { CSSProperties, ReactNode } from "react";

interface SectionRevealProps {
  children: ReactNode;
  variants: Variants;
  className?: string;
  once?: boolean;
  style?: CSSProperties;
}

export default function SectionReveal({
  children,
  variants,
  className = "",
  once = true,
  style,
}: SectionRevealProps) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
