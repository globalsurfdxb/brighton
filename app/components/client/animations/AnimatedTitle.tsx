"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ElementType } from "react";
import { useIntroComplete } from "@/app/hooks/useIntroComplete";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedTitleProps {
  text: string;
  className?: string;
  tag?: ElementType;
}

export default function AnimatedTitle({
  text,
  className = "",
  tag = "h2",
}: AnimatedTitleProps) {
  const rootRef = useRef<HTMLHeadingElement>(null);
  const introComplete = useIntroComplete();

  useLayoutEffect(() => {
    if (!rootRef.current || !introComplete) return;

    const chars = rootRef.current.querySelectorAll(".animated-char");

    const ctx = gsap.context(() => {
      gsap.set(chars, {
        scale: 1,
        opacity: 0.4,
        transformOrigin: "50% 50%",
        willChange: "transform",
      });

      gsap.to(chars, {
        keyframes: [
          {
            scale: 1.18,
            opacity: 1,
            duration: 0.23,
            ease: "power2.out",
          },
          {
            scale: 1,
            duration: 0.35,
            ease: "power3.out",
          },
        ],
        stagger: {
          each: 0.028,
        },
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 85%",
          once: true,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [introComplete]);

  const Tag = tag;

  return (
    <Tag ref={rootRef} className={className}>
      {text.split("").map((char, index) => (
        <span
          key={index}
          className="animated-char inline-block"
          style={{
            whiteSpace: char === " " ? "pre" : undefined,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </Tag>
  );
}
