"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { servicesData } from "../data";
import { useContainerInset } from "@/app/hooks/useContainerInset";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedTitle from "../../animations/AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const { sectionTitle, services } = servicesData;
  const inset = useContainerInset();
  const sectionRef = useRef<HTMLElement>(null);
  const mediaWrapperRef = useRef<HTMLDivElement>(null);
  const imageRevealRef = useRef<HTMLDivElement>(null);

  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);
  const rotateXTo = useRef<gsap.QuickToFunc | null>(null);
  const rotateYTo = useRef<gsap.QuickToFunc | null>(null);

  const [hoveredIndex, setHoveredIndex] = useState<number>(0);

  useLayoutEffect(() => {
    if (!sectionRef.current || !imageRevealRef.current) return;

    const ctx = gsap.context(() => {
      // --- Entry animation ---
      gsap.set(imageRevealRef.current, {
        clipPath: "inset(0% 38% 0% 38%)",
        scale: 1.15,
        filter: "blur(14px)",
        opacity: 0,
      });

      gsap.to(imageRevealRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        scale: 1.08,
        filter: "blur(0px)",
        opacity: 1,
        duration: 1.6,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          toggleActions: "play none none none",
          once: true,
        },
      });

      // --- Parallax quickTo setters ---
      xTo.current = gsap.quickTo(imageRevealRef.current, "x", {
        duration: 1.4,
        ease: "power3.out",
      });
      yTo.current = gsap.quickTo(imageRevealRef.current, "y", {
        duration: 1.4,
        ease: "power3.out",
      });
      rotateXTo.current = gsap.quickTo(imageRevealRef.current, "rotationX", {
        duration: 1.4,
        ease: "power3.out",
      });

      rotateYTo.current = gsap.quickTo(imageRevealRef.current, "rotationY", {
        duration: 1.4,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMediaMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1280) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.6;
    const relY = (e.clientY - rect.top) / rect.height - 0.6;

    const maxTranslate = 60;
    const maxRotate = 7;

    xTo.current?.(relX * maxTranslate);
    yTo.current?.(relY * maxTranslate);

    rotateYTo.current?.(relX * maxRotate);
    rotateXTo.current?.(-relY * maxRotate);
  };

  const handleMediaMouseLeave = () => {
    xTo.current?.(0);
    yTo.current?.(0);

    rotateXTo.current?.(0);
    rotateYTo.current?.(0);
  };

  return (
    <section ref={sectionRef} className="w-full bg-primary">
      {/* Top bar */}
      <div className="bg-primary pt-10 pb-5 md:py-30 3xl:py-[35px]">
        <div className="container flex items-center">
          <AnimatedTitle
            tag="h3"
            text={sectionTitle}
            className="section-title text-white sm:leading-none"
          />
        </div>
      </div>

      {/* Background image with center divider + two titles */}
      <div
        ref={mediaWrapperRef}
        style={{
          perspective: 1200,
          perspectiveOrigin: "center",
        }}
        onMouseMove={handleMediaMouseMove}
        onMouseLeave={handleMediaMouseLeave}
        className="hidden md:block relative w-full md:h-[420px] xl:h-[500px] 2xl:h-[600px] 3xl:h-[750px] overflow-hidden"
      >
        <div
          ref={imageRevealRef}
          style={{
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
          className="absolute inset-0 overflow-hidden"
        >
          {services.map((service, index) => (
            <div
              key={service.title}
              className="absolute inset-0 transition-opacity duration-700 ease-out"
              style={{ opacity: hoveredIndex === index ? 1 : 0 }}
            >
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="pointer-events-none object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        <div
          style={{
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0.7) 15.21%, rgba(0, 0, 0, 0.1) 53.68%)",
          }}
          className="absolute inset-0"
        />

        <div className="absolute inset-0 grid grid-cols-2 z-10">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="relative flex flex-col items-start pt-9 lg:pt-70 min-[1850px]:pt-[72px]"
              style={{ paddingLeft: inset, paddingRight: inset }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(0)}
            >
              <AnimatedTitle
                tag="h3"
                text={service.title}
                className="text-subtitle text-white"
              />

              {/* Description — fades/slides in on hover of this column */}
              <p
                className={`text-description text-secondary mt-3 lg:mt-5 max-w-[40ch] transition-all duration-500 ease-out ${
                  hoveredIndex === index
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 pointer-events-none"
                }`}
              >
                {service.description}
              </p>

              <div
                className={`mt-5 transition-all duration-500 delay-150 ease-out xl:hidden ${
                  hoveredIndex === index
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 pointer-events-none"
                }`}
              >
                <Image
                  src="/assets/icons/top-right-secondary-60.svg"
                  alt="arrow"
                  width={60}
                  height={60}
                  className="pointer-events-none w-auto h-7 2xl:h-12 3xl:h-15"
                />
              </div>

              {/* Arrow icon — fades in on hover of this column */}
              <motion.div
                className="absolute top-70 min-[1850px]:top-[72px] right-50 3xl:right-130 cursor-pointer hidden xl:block"
                style={{ marginRight: inset }}
                initial={false}
                animate={{
                  opacity: hoveredIndex === index ? 1 : 0,
                  x: hoveredIndex === index ? 0 : -20,
                  y: hoveredIndex === index ? 0 : 20,
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 9,
                  mass: 0.9,
                  delay: hoveredIndex === index ? 0.1 : 0,
                }}
              >
                <Image
                  src="/assets/icons/top-right-secondary-60.svg"
                  alt="arrow"
                  width={60}
                  height={60}
                  className="pointer-events-none w-auto h-12 3xl:h-15"
                />
              </motion.div>

              {index === 0 && (
                <motion.span
                  className="absolute right-0 top-0 h-full w-px origin-top bg-secondary/50"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile/tablet stacked layout — md+ uses the hover/reveal setup above */}
      <div className="container md:hidden flex flex-col gap-10 pb-10">
        {services.map((service) => (
          <div key={service.title} className="flex flex-col">
            <div className="relative w-full min-h-[238px] aspect-[335/220] rounded-[10px] overflow-hidden">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="mt-5 flex flex-col items-start">
              <AnimatedTitle
                tag="h3"
                text={service.title}
                className="text-subtitle text-white"
              />

              <p className="text-description text-secondary mt-2.5 mb-2.5">
                {service.description}
              </p>

              <Image
                src="/assets/icons/right-top-arrow-white-small.svg"
                alt="arrow"
                width={14}
                height={14}
                className="pointer-events-none w-auto h-3.5"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
