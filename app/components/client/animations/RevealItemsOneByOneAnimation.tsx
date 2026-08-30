"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { useRevealInView } from "@/app/hooks/useRevelInView";

type Props = {
  children: React.ReactNode;
  variants?: any;
  className?: string;
  delayRange?: number;
};

const Reveal = forwardRef<HTMLDivElement, Props>(function Reveal(
  { children, variants, className, delayRange = 0.26 },
  forwardedRef,
) {
  const { ref: internalRef, controls } = useRevealInView({ delayRange });

  const setRefs = (node: HTMLDivElement | null) => {
    internalRef.current = node;

    if (typeof forwardedRef === "function") {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  };

  return (
    <motion.div
      ref={setRefs}
      variants={variants}
      initial="hidden"
      animate={controls}
      className={className}
    >
      {children}
    </motion.div>
  );
});

export default Reveal;
