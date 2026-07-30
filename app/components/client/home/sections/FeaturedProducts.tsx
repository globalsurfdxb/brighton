"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";

import { featuredProductsData } from "../data";
import SliderNavBtn from "../../common/Slidernavbtn";
import AnimatedDividerTwo from "../../animations/AnimatedDividerTwo";
import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useContainerInset } from "@/app/hooks/useContainerInset";
import AnimatedTitle from "../../animations/AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedProducts() {
  const { sectionTitle, projects } = featuredProductsData;
  const sectionRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [progress, setProgress] = useState(0);
  const inset = useContainerInset();

  const updateState = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);

    if (swiper.isEnd) {
      setProgress(1);
      return;
    }
    if (swiper.isBeginning) {
      setProgress(0);
      return;
    }

    const totalSlides = swiper.slides.length;
    const visible =
      typeof swiper.params.slidesPerView === "number"
        ? swiper.params.slidesPerView
        : 1;
    const maxIndex = Math.max(totalSlides - visible, 1);
    const current = swiper.activeIndex / maxIndex;
    setProgress(Math.min(Math.max(current, 0), 1));
  };

  useLayoutEffect(() => {
    if (!sectionRef.current || !sliderRef.current) return;

    const ctx = gsap.context(() => {
      const slides = sliderRef.current!.querySelectorAll(
        ".featured-slide-inner",
      );

      // Initial state — container "closed" via clip-path, slightly zoomed
      gsap.set(sliderRef.current, {
        clipPath: "inset(0% 0% 100% 0%)",
        scale: 1.06,
      });

      // Cards start pushed back, tilted, and blurred
      gsap.set(slides, {
        opacity: 0,
        y: 120,
        rotateX: 20,
        filter: "blur(8px)",
        transformOrigin: "50% 100%",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      tl.to(sliderRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        scale: 1,
        duration: 1.5,
        ease: "power3.out",
      }).to(
        slides,
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.08,
        },
        "<0.25",
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-100 bg-cream-background overflow-hidden"
    >
      <div>
        {/* Top row: title, progress line, nav buttons */}
        <div className="container flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-40">
          <AnimatedTitle
            tag="h2"
            text={sectionTitle}
            className="section-title"
          />

          <div className="flex items-center gap-80 min-[1850px]:gap-[87px] justify-between">
            <div className="w-[140px] h-[2px] bg-secondary relative overflow-hidden rounded-full">
              <span
                className="absolute left-0 top-0 h-[2px] bg-description-color transition-all duration-400 rounded-full"
                style={{ width: `${progress * 100}%` }}
              />
            </div>

            <div className="flex items-center gap-2.5">
              <SliderNavBtn
                direction="prev"
                disabled={isBeginning}
                onClick={() => swiperRef.current?.slidePrev()}
              />
              <SliderNavBtn
                direction="next"
                disabled={isEnd}
                onClick={() => swiperRef.current?.slideNext()}
              />
            </div>
          </div>
        </div>

        {/* Slider */}
        <div
          style={{
            paddingLeft: inset,
            paddingRight: inset,
            perspective: "1200px",
          }}
          ref={sliderRef}
          className="cursor-grab"
        >
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              updateState(swiper);
            }}
            onSlideChange={updateState}
            onProgress={updateState}
            spaceBetween={15}
            speed={800}
            slidesPerView={1.2}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1400: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
              1700: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
            }}
            className="!overflow-visible lg:!overflow-hidden"
          >
            {projects.map((project, index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-col group featured-slide-inner">
                  <div className="relative w-full h-[300px] md:h-[400px] 2xl:h-[450px] 3xl:h-[540px] rounded-[10px] overflow-hidden mb-30">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="pointer-events-none object-cover group-hover:scale-105 transition-all duration-500 ease-in-out"
                    />
                  </div>
                  <h3 className="text-subtitle text-primary line-clamp-1">
                    {project.title}
                  </h3>
                  <AnimatedDividerTwo
                    className="border-secondary mt-2.5 mb-5"
                    hoverColor="#0A0A0A"
                  />
                  <p className="text-description-3 text-description-color">
                    {project.label}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
