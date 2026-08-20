"use client";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

import { moreProductsData } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";
import ProductCard from "../../products/sections/ProductCard";
import CustomButton from "../../common/CustomButton";

export default function MoreProducts() {
  const { sectionTitle, products } = moreProductsData;

  return (
    <section className="w-full py-100 bg-cream-background overflow-hidden">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-[30px] sm:mb-40 gap-2.5 lg:gap-0">
          <AnimatedTitle
            tag="h2"
            text={sectionTitle}
            className="section-title"
          />
          <CustomButton text="VIEW ALL FAMILIES" variant="2" link="#" btnClass="w-fit" />
        </div>

        {/* Slider */}
        <div className="cursor-grab">
          <Swiper
            spaceBetween={15}
            speed={800}
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
              1024: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1280: {
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
            {products.map((product, index) => (
              <SwiperSlide key={index}>
                <ProductCard
                  key={product.id}
                  product={product}
                  bgColor="bg-white"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
