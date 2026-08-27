"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import AnimatedTitle from "../../animations/AnimatedTitle";
import { motion, useInView } from "framer-motion";
import { Autoplay } from "swiper/modules";

interface ProcessSectionProps {
  data: {
    title: string;
    items: {
      id: string;
      title: string;
      description: string;
    }[];
  };
}

const ProcessSection = ({ data }: ProcessSectionProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const [lineTop, setLineTop] = useState(0);

  const isInView = useInView(wrapperRef, { once: true, amount: 0.4 });

  useLayoutEffect(() => {
    const measure = () => {
      if (!badgeRef.current || !wrapperRef.current) return;
      const badgeRect = badgeRef.current.getBoundingClientRect();
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      setLineTop(badgeRect.top - wrapperRect.top + badgeRect.height / 2);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section className="py-100 overflow-hidden">
      <div className="container">
        <AnimatedTitle text={data.title} className="section-title mb-40" />

        <div ref={wrapperRef} className="relative">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={-1}
            slidesPerView={1.2}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            grabCursor
            autoHeight
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="!overflow-visible md:!overflow-hidden [&_.swiper-wrapper]:!items-stretch [&_.swiper-slide]:!h-auto"
          >
            {data.items.map((item, index) => {
              const isFirst = index === 0;
              const isLast = index === data.items.length - 1;

              return (
                <SwiperSlide key={item.id}>
                  <div className="relative flex flex-col p-50 3xl:pb-80 min-[1800px]:pb-[78px] rounded-[10px] border border-secondary overflow-hidden h-full">
                    <div
                      style={{
                        background:
                          "linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)",
                      }}
                      className="absolute inset-0 z-0"
                    />

                    <motion.div
                      className={`absolute h-px bg-secondary z-10 pointer-events-none origin-left ${
                        isFirst ? "left-50" : "left-0"
                      } ${isLast ? "right-50" : "right-0"}`}
                      style={{ top: lineTop }}
                      initial={{ scaleX: 0 }}
                      animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.5,
                        ease: "linear",
                      }}
                    />

                    <AnimatedTitle
                      text={item.title}
                      className="relative z-20 text-subtitle mb-4.75"
                    />

                    <div
                      ref={index === 0 ? badgeRef : undefined}
                      className="relative z-20 flex items-center justify-center 3xl:w-17.5 3xl:h-17.5 2xl:w-15 2xl:h-15 w-12 h-12 rounded-[5px] bg-primary shrink-0"
                    >
                      <span className="text-secondary text-subtitle text-trim">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <p className="relative z-20 text-description-4 text-description-color mt-80">
                      {item.description}
                    </p>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
