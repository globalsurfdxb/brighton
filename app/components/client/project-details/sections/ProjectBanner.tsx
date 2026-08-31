"use client";

import { useRef, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import AnimatedTitle from "../../animations/AnimatedTitle";
import { introPromise } from "@/app/hooks/introSignal";
import { moveRight } from "../../animations/motionVariants";
import { motion } from "framer-motion";

export default function ProjectBanner({
  image,
  title,
}: {
  image: string;
  title: string;
}) {
  const router = useRouter();
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

    let cancelled = false;
    let rafId: number | null = null;

    introPromise.then(() => {
      if (cancelled) return;
      rafId = requestAnimationFrame(play);
    });

    return () => {
      cancelled = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="relative flex max-h-[800px] h-[450px] lg:h-[580px] 2xl:h-[80svh] 3xl:h-[90svh] w-full overflow-hidden">
      <Image
        ref={imageRef}
        src={image}
        alt={title}
        fill
        priority
        className="object-cover"
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0) 39%, rgba(0, 0, 0, 0.5) 83.56%)",
        }}
      />

      {/* Content wrapper */}
      <div className="relative container z-10 flex h-full w-full flex-col justify-between pt-[280px] sm:pt-[140px] 2xl:pt-200 3xl:pt-[206px] pb-90 min-[1850px]:pb-[94px]">
        <motion.div
          variants={moveRight(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <button
            style={
              {
                "--fill-color": "#ffffff",
              } as React.CSSProperties
            }
            type="button"
            onClick={() => router.back()}
            className="btn-fill-center flex w-fit items-center gap-2 lg:gap-2.5 text-white cursor-pointer max-h-9.25 md:max-h-10.5 px-[17px] py-2 border border-secondary rounded-[100px] group transition-colors duration-500"
          >
            <Image
              src="/assets/icons/arrow-left-white.svg"
              alt=""
              width={27}
              height={27}
              className="w-auto h-5 lg:h-[27px] group-hover:-translate-x-1 transition-all duration-500 group-hover:invert-0 group-hover:brightness-0"
            />
            <span className="text-description-3 uppercase text-trim group-hover:text-primary transition-colors duration-500">
              Back
            </span>
          </button>
        </motion.div>

        <AnimatedTitle
          className="hero-title text-white"
          text={title}
          tag="h1"
        />
      </div>
    </div>
  );
}
