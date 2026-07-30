// "use client";

// import Image from "next/image";
// import { Swiper, SwiperSlide } from "swiper/react";

// import "swiper/css";

// import AnimatedDividerTwo from "../../animations/AnimatedDividerTwo";

// export default function FeaturedProjects({ data, className }: { data: any, className?: string }) {
//   const { sectionTitle, projects } = data;

//   return (
//     <section className={`py-100 overflow-hidden ${className}`}>
//       <div className="container">
//         <h2 className="section-title mb-40 ">{sectionTitle}</h2>
//         <div className="cursor-grab">
//           <Swiper
//             spaceBetween={15}
//             slidesPerView={1.2}
//             speed={800}
//             loop={false}
//             breakpoints={{
//               640: {
//                 slidesPerView: 1.5,
//                 spaceBetween: 20,
//               },
//               1024: {
//                 slidesPerView: 1.8,
//                 spaceBetween: 20,
//               },
//               1400: {
//                 slidesPerView: 2.1841,
//                 spaceBetween: 24,
//               },
//               1700: {
//                 slidesPerView: 2.1841,
//                 spaceBetween: 30,
//               },
//             }}
//             className="!overflow-visible"
//           >
//             {projects.map((project: any, index: number) => (
//               <SwiperSlide key={index}>
//                 <div className="flex flex-col group">
//                   <h3 className="text-subtitle text-primary line-clamp-1">
//                     {project.title}
//                   </h3>
//                   <AnimatedDividerTwo
//                     className="border-secondary mt-5 mb-40"
//                     hoverColor="#0A0A0A"
//                   />
//                   <div className="relative w-full h-[280px] md:h-[360px] 2xl:h-[420px] 3xl:h-[520px] rounded-[10px] overflow-hidden">
//                     <Image
//                       src={project.image}
//                       alt={project.title}
//                       fill
//                       className="pointer-events-none object-cover group-hover:scale-105 transition-all duration-500 ease-in-out"
//                     />
//                     <div className="absolute top-5 right-5 rounded-full bg-black/50 px-[18.5px] py-[9.5px] flex justify-center items-center border border-secondary">
//                       <span className="text-15 leading-none max-h-[11px] text-secondary font-itc-medium">
//                         {project.location}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "swiper/css";

import AnimatedDividerTwo from "../../animations/AnimatedDividerTwo";

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
  const swiperRef = useRef<SwiperType | null>(null);

  useLayoutEffect(() => {
    if (!animate) return;
    if (!sectionRef.current) return;

    const section = sectionRef.current;

    const ctx = gsap.context(() => {
      let st: ScrollTrigger;

      const build = () => {
        const swiper = swiperRef.current;
        if (!swiper) return;

        swiper.update(); // recalc translate bounds for current breakpoint

        const distance = Math.abs(
          swiper.maxTranslate() - swiper.minTranslate(),
        );

        st?.kill();
        st = ScrollTrigger.create({
          trigger: section,
          start: "bottom bottom", // was: "top top"
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
          // markers: true,
        });
      };

      build();

      const onResize = () => {
        // slidesPerView/translate bounds change across breakpoints
        build();
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", onResize);

      return () => window.removeEventListener("resize", onResize);
    }, section);

    return () => ctx.revert();
  }, [animate]);

  return (
    <section ref={sectionRef} className={`py-100 overflow-hidden ${className}`}>
      <div className="container">
        <h2 className="section-title mb-40">{sectionTitle}</h2>
        <div className={animate ? "" : "cursor-grab"}>
          <Swiper
            onSwiper={(s) => (swiperRef.current = s)}
            spaceBetween={15}
            slidesPerView={1.2}
            speed={800}
            loop={false}
            breakpoints={swiperBreakpoints}
            allowTouchMove={!animate}
            simulateTouch={!animate}
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
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: any }) {
  return (
    <div className="flex flex-col group cursor-pointer">
      <h3 className="text-subtitle text-primary line-clamp-1">
        {project.title}
      </h3>
      <AnimatedDividerTwo
        className="border-secondary mt-5 mb-40"
        hoverColor="#0A0A0A"
      />
      <div className="relative w-full h-[280px] md:h-[360px] 2xl:h-[420px] 3xl:h-[520px] rounded-[10px] overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="pointer-events-none object-cover group-hover:scale-105 transition-all duration-500 ease-in-out"
        />
        <div className="absolute top-5 right-5 rounded-full bg-black/50 px-[18.5px] py-[9.5px] flex justify-center items-center border border-secondary">
          <span className="text-15 leading-none max-h-[11px] text-secondary font-itc-medium">
            {project.location}
          </span>
        </div>
      </div>
    </div>
  );
}
