"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "swiper/css";

import AnimatedDividerTwo from "../../animations/AnimatedDividerTwo";
import AnimatedTitle from "../../animations/AnimatedTitle";
import Link from "next/link";
import { Autoplay } from "swiper/modules";

gsap.registerPlugin(ScrollTrigger);

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

  useLayoutEffect(() => {
    if (!animate) return;
    if (!sectionRef.current || !sliderRef.current) return;

    const section = sectionRef.current;
    const slider = sliderRef.current;

    const ctx = gsap.context(() => {
      const cards = slider.querySelectorAll(".featured-project-card");

      gsap.set(cards, {
        opacity: 0,
        x: 40,
        scale: 0.8,
        filter: "blur(10px)",
        clipPath: "inset(0% 0% 0% 100% round 10px)",
      });

      const entryTl = gsap.timeline({
        scrollTrigger: {
          trigger: slider,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      entryTl.to(cards, {
        opacity: 1,
        x: 0,
        scale: 1,
        filter: "blur(0px)",
        clipPath: "inset(0% 0% 0% 0% round 10px)",
        duration: 1,
        ease: "power3.inOut",
        stagger: {
          each: 0.16,
          from: "start",
        },
      })
      .to(
          cards,
          {
            scale: 1.02,
            duration: 0.5,
            delay: 0.2,
            ease: "sine.inOut",
            stagger: {
              each: 0.12,
              yoyo: true,
              repeat: 1,
            },
          },
          "-=0.6",
        );
    }, section);

    return () => ctx.revert();
  }, [animate]);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;
    let started = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            swiperRef.current?.autoplay?.start();
          }
        });
      },
      { threshold: 0.3 },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={`overflow-hidden ${className}`}>
      <div className="container relative py-[60px] md:py-100">
        <AnimatedTitle
          tag="h2"
          text={sectionTitle}
          className="section-title mb-5 sm:mb-40 md:pb-1.5"
        />
        <div ref={sliderRef} className="cursor-grab">
          <Swiper
            modules={[Autoplay]}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              enabled: false,
            }}
            onSwiper={(s) => (swiperRef.current = s)}
            spaceBetween={15}
            slidesPerView={1.2687}
            speed={800}
            loop={false}
            breakpoints={{
              640: { slidesPerView: 1.5, spaceBetween: 20 },
              1024: { slidesPerView: 1.8, spaceBetween: 20 },
              1400: { slidesPerView: 2.1841, spaceBetween: 24 },
              1700: { slidesPerView: 2.1841, spaceBetween: 30 },
            }}
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
