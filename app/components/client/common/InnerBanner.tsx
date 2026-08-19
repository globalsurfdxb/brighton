"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import AnimatedTitle from "../animations/AnimatedTitle";

interface PageBannerProps {
  data: {
    title: string;
    image: string;
    imageAlt: string;
  };
}

export default function InnerBanner({ data }: PageBannerProps) {
  const imageRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const img = imageRef.current;
    if (!img) return;

    gsap.set(img, { scale: 1.5, transformOrigin: "center center" });

    const play = () => {
      gsap.to(img, {
        scale: 1,
        duration: 1.3,
        ease: "power2.out",
        onComplete: () => {
          gsap
            .timeline({
              repeat: -1,
              defaults: { ease: "sine.inOut" },
            })
            .to(img, { scale: 1.15, duration: 14 })
            .to(img, { scale: 1, duration: 14 });
        },
      });
    };

    if (window.__introComplete) {
      const id = requestAnimationFrame(play);
      return () => cancelAnimationFrame(id);
    }

    window.addEventListener("introComplete", play, { once: true });
    return () => window.removeEventListener("introComplete", play);
  }, []);

  return (
    <section className="relative w-full h-[308px] sm:h-[450px] lg:h-[580px] 3xl:h-[700px] overflow-hidden">
      {/* Background image */}
      <Image
        ref={imageRef}
        src={data.image || "/assets/images/placeholder.png"}
        alt={data.imageAlt}
        fill
        priority
        className="object-cover object-center will-change-transform"
      />

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 37.36%, rgba(0, 0, 0, 0.7) 85.5%)`,
        }}
      />

      {/* Title */}
      <div className="absolute left-0 right-0 bottom-0">
        <div className="container pb-80 3xl:pb-120">
          <AnimatedTitle
            text={data.title}
            className="hero-title text-white relative"
          />
        </div>
      </div>
    </section>
  );
}
