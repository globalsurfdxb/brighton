"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";

interface AnimatedDividerProps {
  className?: string;
  hoverColor?: string;
}

export default function AnimatedDivider({
  className = "",
  hoverColor,
}: AnimatedDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div
      ref={ref}
      className={`relative border-t origin-center ${className}`}
      style={{
        transform: isInView ? "scaleX(1)" : "scaleX(0)",
        transition:
          "transform 1s cubic-bezier(0.65, 0, 0.35, 1), border-color 0.3s ease",
      }}
    >
      {hoverColor && (
        <div
          className="absolute left-0 top-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100"
          style={{ backgroundColor: hoverColor }}
        />
      )}
    </div>
  );
}