"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Tilt3DImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  maxTranslate?: number;
  maxRotate?: number;
  reveal?: boolean;
}

export default function Tilt3DImage({
  src,
  alt,
  className = "",
  imgClassName = "object-cover",
  priority = false,
  maxTranslate = 60,
  maxRotate = 7,
  reveal = false,
}: Tilt3DImageProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);
  const rotateXTo = useRef<gsap.QuickToFunc | null>(null);
  const rotateYTo = useRef<gsap.QuickToFunc | null>(null);

  useLayoutEffect(() => {
    if (!reveal || !wrapperRef.current || !imageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(imageRef.current, {
        clipPath: "inset(0% 38% 0% 38%)",
        scale: 1.15,
        opacity: 0,
      });

      gsap.to(imageRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        scale: 1.08,
        opacity: 1,
        duration: 1.6,
        ease: "power4.out",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top bottom",
          toggleActions: "play none none none",
          once: true,
        },
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, [reveal]);

  const ensureQuickTo = () => {
    if (!imageRef.current || xTo.current) return;
    xTo.current = gsap.quickTo(imageRef.current, "x", {
      duration: 1.4,
      ease: "power3.out",
    });
    yTo.current = gsap.quickTo(imageRef.current, "y", {
      duration: 1.4,
      ease: "power3.out",
    });
    rotateXTo.current = gsap.quickTo(imageRef.current, "rotationX", {
      duration: 1.4,
      ease: "power3.out",
    });
    rotateYTo.current = gsap.quickTo(imageRef.current, "rotationY", {
      duration: 1.4,
      ease: "power3.out",
    });
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1280) return;
    ensureQuickTo();

    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;

    xTo.current?.(relX * maxTranslate);
    yTo.current?.(relY * maxTranslate);
    rotateYTo.current?.(relX * maxRotate);
    rotateXTo.current?.(-relY * maxRotate);
  };

  const handleMouseLeave = () => {
    if (window.innerWidth < 1280) return;
    xTo.current?.(0);
    yTo.current?.(0);
    rotateXTo.current?.(0);
    rotateYTo.current?.(0);
  };

  return (
    <div
      ref={wrapperRef}
      style={{ perspective: 1200, perspectiveOrigin: "center" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`absolute inset-0 overflow-hidden ${className}`}
    >
      <div
        ref={imageRef}
        style={{
          transformStyle: "preserve-3d",
          willChange: "transform",
          transform: reveal ? undefined : "scale(1.12)",
        }}
        className="absolute inset-0"
      >
        <Image
          src={src || "/assets/images/placeholder.png"}
          alt={alt}
          fill
          priority={priority}
          className={`${imgClassName} pointer-events-none`}
        />
      </div>
    </div>
  );
}
