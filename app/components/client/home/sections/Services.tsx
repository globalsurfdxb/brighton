"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { servicesData } from "../data";
import { useContainerInset } from "@/app/hooks/useContainerInset";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const { sectionTitle, backgroundImage, services } = servicesData;
  const inset = useContainerInset();
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current || !imageWrapperRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(imageWrapperRef.current, {
        width: 200,
        height: 200,
        xPercent: -50,
        yPercent: -50,
        left: "50%",
        top: "50%",
      });

      gsap.to(imageWrapperRef.current, {
        width: "100%",
        height: "100%",
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          toggleActions: "play none none none",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-primary">
      {/* Top bar */}
      <div className="bg-primary py-30 3xl:py-[35px]">
        <div className="container flex items-center">
          <h2 className="section-title text-white leading-none">
            {sectionTitle}
          </h2>
        </div>
      </div>

      {/* Background image with center divider + two titles */}
      <div className="relative w-full h-[320px] md:h-[420px] xl:h-[500px] 2xl:h-[600px] 3xl:h-[750px]">
        <div
          ref={imageWrapperRef}
          className="absolute overflow-hidden will-change-[width,height]"
        >
          <Image
            src={backgroundImage}
            alt={sectionTitle}
            fill
            className="pointer-events-none object-cover"
            priority
          />
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
              className="relative flex items-start pt-70 min-[1850px]:pt-[72px]"
              style={{ paddingLeft: inset, paddingRight: inset }}
            >
              <h3 className="text-subtitle text-white">{service.title}</h3>

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
    </section>
  );
}
