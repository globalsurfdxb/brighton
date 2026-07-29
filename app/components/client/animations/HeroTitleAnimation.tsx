"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

interface AnimatedTitleProps {
  text: string;
  className?: string;
  as?: "h1" | "h2";
}

export default function AnimatedTitle({
  text,
  className,
  as = "h1",
}: AnimatedTitleProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const words = el.querySelectorAll<HTMLElement>("[data-word-inner]");
    if (!words.length) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      gsap.set(words, { yPercent: 0, opacity: 1 });
      return;
    }

    gsap.set(words, { yPercent: 70, opacity: 0 });

    const play = () =>
      gsap.to(words, {
        yPercent: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.04,
        overwrite: true,
      });

    play();
  }, [text]);

  const Tag = as;
  const words = text.split(" ");

  return (
    <Tag ref={containerRef as any} className={className}>
      {words.map((word, i) => (
        <span key={`${text}-${i}`}>
          <span className="inline-block overflow-hidden align-top">
            <span
              data-word-inner
              className="inline-block will-change-transform"
            >
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
