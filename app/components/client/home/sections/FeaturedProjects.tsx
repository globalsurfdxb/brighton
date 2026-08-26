"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "swiper/css";

import AnimatedDividerTwo from "../../animations/AnimatedDividerTwo";
import AnimatedTitle from "../../animations/AnimatedTitle";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const swiperBreakpoints = {
  640: { slidesPerView: 1.5, spaceBetween: 20 },
  1024: { slidesPerView: 1.8, spaceBetween: 20 },
  1400: { slidesPerView: 2.1841, spaceBetween: 24 },
  1700: { slidesPerView: 2.1841, spaceBetween: 30 },
};

export default function FeaturedProjects({
  data,
  className,
  animate = false,
}: {
  data: any;
  className?: string;
  animate?: boolean;
}) {
  const { sectionTitle, projects } = data;

  const sectionRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  // Tracks whether pin/scrub mode is currently active (only >=1280px)
  const [pinEnabled, setPinEnabled] = useState(false);

  useLayoutEffect(() => {
    if (!animate) return;
    if (!sectionRef.current || !sliderRef.current) return;

    const section = sectionRef.current;
    const slider = sliderRef.current;

    const ctx = gsap.context(() => {
      // --- Entry + pop animation (runs once, independent of breakpoint) ---
      const cards = slider.querySelectorAll(".featured-project-card");

      gsap.set(cards, {
        opacity: 0,
        y: 120,
        rotateX: 20,
        filter: "blur(8px)",
        transformOrigin: "50% 100%",
      });

      const entryTl = gsap.timeline({
        scrollTrigger: {
          trigger: slider,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      entryTl
        .to(cards, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.08,
        })
        .to(
          cards,
          {
            scale: 1.016,
            duration: 0.6,
            ease: "sine.inOut",
            stagger: {
              each: 0.1,
              yoyo: true,
              repeat: 1,
            },
          },
          "-=0.6",
        );

      // --- Pin/scrub logic (only >=1280px) ---
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1280px)", () => {
        setPinEnabled(true);

        let st: ScrollTrigger;

        const build = () => {
          const swiper = swiperRef.current;
          if (!swiper) return;

          swiper.update();

          const distance = Math.abs(
            swiper.maxTranslate() - swiper.minTranslate(),
          );

          st?.kill();
          st = ScrollTrigger.create({
            trigger: section,
            start: "top 5%",
            end: () => `+=${distance * 1.5}`,
            pin: true,
            pinSpacing: true,
            anticipatePin: 0,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const swiper = swiperRef.current;
              if (!swiper) return;
              const min = swiper.minTranslate();
              const max = swiper.maxTranslate();
              const x = gsap.utils.interpolate(min, max, self.progress);
              swiper.setTranslate(x);
            },
          });
        };

        build();

        // Cleanup when leaving this matchMedia range (crossing below 1280px)
        return () => {
          st?.kill();
          setPinEnabled(false);
          // reset swiper translate so it's not stuck mid-scrub when it becomes free-scroll
          swiperRef.current?.setTranslate(0);
          swiperRef.current?.update();
        };
      });

      return () => mm.revert();
    }, section);

    return () => ctx.revert();
  }, [animate]);

  const isPinMode = animate && pinEnabled;

  return (
    <section ref={sectionRef} className={`overflow-hidden ${className}`}>
      <div className="container relative py-[60px] md:py-100">
        <AnimatedTitle
          tag="h2"
          text={sectionTitle}
          className="section-title mb-5 sm:mb-40 md:pb-1.5"
        />
        <div ref={sliderRef} className={isPinMode ? "" : "cursor-grab"}>
          <Swiper
            onSwiper={(s) => (swiperRef.current = s)}
            spaceBetween={15}
            slidesPerView={1.2687}
            speed={800}
            loop={false}
            breakpoints={swiperBreakpoints}
            allowTouchMove={!isPinMode}
            simulateTouch={!isPinMode}
            mousewheel={false}
            className="!overflow-visible"
          >
            {projects.map((project: any, index: number) => (
              <SwiperSlide key={index}>
                <ProjectCard project={project} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="lg:hidden absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-[rgba(191,191,191,0.1)] via-[rgba(191,191,191,0.5)] to-[rgba(191,191,191,0.1)]" />
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: any }) {
  return (
    <Link href={`/projects/${project.title.toLowerCase().replace(/\s/g, "-")}`}>
      <div className="featured-project-card flex flex-col group cursor-pointer">
        <h3 className="text-subtitle text-primary line-clamp-1">
          {project.title}
        </h3>
        <AnimatedDividerTwo
          className="border-secondary mt-2 md:mt-5 mb-3.75 md:mb-40"
          hoverColor="#0A0A0A"
        />
        <div className="relative w-full h-[200px] sm:h-[280px] md:h-[360px] 2xl:h-[420px] 3xl:h-[520px] rounded-[10px] overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="pointer-events-none object-cover group-hover:scale-105 transition-all duration-500 ease-in-out"
          />
          <div className="absolute top-3.75 md:top-5 right-3.75 md:right-5 rounded-full bg-black/50 px-3.75 md:px-[18.5px] py-[5px] md:py-[9.5px] flex justify-center items-center border border-secondary">
            <span className="text-15 leading-none max-h-[9px] md:max-h-[11px] text-secondary font-itc-medium">
              {project.location}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
