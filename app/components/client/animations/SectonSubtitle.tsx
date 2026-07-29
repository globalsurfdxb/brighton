"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface SectionSubtitleProps {
  text?: string;
  html?: string;
  className?: string;
  as?: "p" | "span" | "div";
}

const tagMotion: Record<string, any> = {
  p: motion.p,
  span: motion.span,
  div: motion.div,
};

export default function SectionSubtitle({
  text,
  html,
  className = "",
  as = "p",
}: SectionSubtitleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const MotionTag = tagMotion[as];

  return (
    <div ref={ref} className="overflow-hidden">
      <MotionTag
        className={`text-subtitle ${className}`}
        initial={{ y: "40px", opacity: 0 }}
        animate={
          isInView ? { y: "0px", opacity: 1 } : { y: "40px", opacity: 0.1 }
        }
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        {...(html
          ? { dangerouslySetInnerHTML: { __html: html } }
          : { children: text })}
      />
    </div>
  );
}
