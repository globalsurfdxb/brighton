"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { servicesData } from "../data";
import { useContainerInset } from "@/app/hooks/useContainerInset";

export default function Services() {
  const { sectionTitle, backgroundImage, services } = servicesData;
  const inset = useContainerInset();

  return (
    <section className="w-full">
      {/* Top bar */}
      <div className="bg-primary py-30 3xl:py-[35px]">
        <div className="container flex items-center">
          <h2 className="section-title text-white">{sectionTitle}</h2>
        </div>
      </div>

      {/* Background image with center divider + two titles */}
      <div className="relative w-full h-[320px] md:h-[420px] xl:h-[500px] 2xl:h-[600px] 3xl:h-[750px]">
        <Image
          src={backgroundImage}
          alt={sectionTitle}
          fill
          className="object-cover"
          priority
        />

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
              style={{ paddingLeft: inset }}
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
