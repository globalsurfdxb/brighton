"use client";

import { motion } from "framer-motion";

interface PlusMinusIconProps {
  isActive: boolean;
}

export default function PlusMinusIcon({ isActive }: PlusMinusIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className="w-4 h-4 3xl:w-[20px] 3xl:h-[20px]"
    >
      <motion.path
        d="M20 10L0 10"
        animate={{ stroke: isActive ? "#FFFFFF" : "#0A0A0A" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        strokeWidth="2"
      />
      <motion.path
        d="M10 0L10 20"
        animate={{
          scaleY: isActive ? 0 : 1,
          stroke: isActive ? "#FFFFFF" : "#0A0A0A",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        strokeWidth="2"
        style={{ transformOrigin: "10px 10px" }}
      />
    </svg>
  );
}
