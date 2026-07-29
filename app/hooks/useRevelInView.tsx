"use client";

import { useEffect } from "react";
import { useInView } from "framer-motion";
import { useAnimation } from "framer-motion";
import { useRef } from "react";

export function useRevealInView({
  delayRange = 0.22,
}: { delayRange?: number } = {}) {
  const ref = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { once: true, margin: "0px 0px -70px 0px" });

  useEffect(() => {
    if (isInView) {
      const delay = Math.random() * delayRange;
      controls.start({
        ...{ opacity: 1, y: 0 },
        transition: { delay, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
      });
    }
  }, [isInView, controls, delayRange]);

  return { ref, controls };
}
