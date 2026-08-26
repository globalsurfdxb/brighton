"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import AnimatedTitle from "../animations/AnimatedTitle";

export interface RecentContentItem {
  id: number;
  title: string;
  date: string;
  category: string;
  image: string | StaticImageData;
}

interface RecentContentProps {
  title: string;
  items: RecentContentItem[];
  hrefPrefix: "news" | "blog";
}

const RecentContent = ({ title, items, hrefPrefix }: RecentContentProps) => {
  return (
    <section className="py-100 bg-cream-background overflow-hidden">
      <div className="container">
        <AnimatedTitle
          text={title}
          className="section-title mb-40"
        />
        <Swiper
          spaceBetween={15}
          speed={300}
          slidesPerView={1.2687}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2.4,
              spaceBetween: 20,
            },
            1280: { slidesPerView: 3, spaceBetween: 30 },
          }}
          className="!overflow-visible"
        >
          {items.map((item) => (
            <SwiperSlide key={item.id}>
              <Link href={`/${hrefPrefix}/${item.id}`}>
                <div className="flex flex-col gap-30 relative">
                  <div
                    className={`relative rounded-[10px] overflow-hidden bg-secondary ${
                      hrefPrefix === "blog"
                        ? "h-[260px] xl:h-[320px] 2xl:h-[460px] 3xl:h-[560px]"
                        : "h-[260px] xl:h-[320px] 2xl:h-[360px] 3xl:h-[420px]"
                    }`}
                  >
                    <Image
                      src={item.image || "/assets/images/placeholder.png"}
                      alt={item.title}
                      className="object-cover pointer-events-none"
                      fill
                    />
                  </div>
                  <div className="pb-4 flex justify-between border-b border-secondary text-description-color text-subtitle-2">
                    <p>{item.date.split("-").reverse().join(" - ")}</p>
                    <p className="mr-60 uppercase">{item.category}</p>
                  </div>
                  <div>
                    <h3 className="text-subtitle line-clamp-2">{item.title}</h3>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default RecentContent;
