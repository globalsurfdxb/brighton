"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface SectionTitleProps {
  title: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const tagMotion: Record<string, any> = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
};

export default function SectionTitle({
  title,
  className = "",
  as = "h2",
}: SectionTitleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const MotionTag = tagMotion[as];

  return (
    <div ref={ref} className="overflow-hidden">
      <MotionTag
        className={`section-heading ${className}`}
        initial={{ y: "50px", opacity: 0 }}
        animate={
          isInView ? { y: "0px", opacity: 1 } : { y: "50px", opacity: 0.1 }
        }
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] , delay: 0.15 }}
      >
        {title}
      </MotionTag>
    </div>
  );
}
