"use client";

import Image from "next/image";
import { useState } from "react";
import AnimatedTitle from "../../animations/AnimatedTitle";
import { motion } from "framer-motion";
import { moveRight } from "../../animations/motionVariants";
import SectionDescription from "../../animations/SectionDescription";
import CatalogueRequestForm from "../CatalogueRequestForm";
import CatalogueFlipbook from "../CatalogueFlipbook";
import type { CatalogueAccess } from "@/app/types/catalogueRequest";

type MainData = {
  title: string;
  subTitle: string;
  catalogueText: string;
  image: string;
  imageAlt: string;
};

export default function Main({ data }: { data: MainData }) {
  const [catalogue, setCatalogue] = useState<CatalogueAccess | null>(null);

  return (
    <section className="w-full pb-100 top-spacing">
      <div className="container">
        <AnimatedTitle
          text={data.title}
          className="hero-title mb-30 md:mb-80 min-[1900px]:mb-[83px]"
        />

        <div className="flex flex-col md:flex-row gap-40 lg:gap-60 xl:gap-130 min-[1900px]:gap-[184px]">
          {/* Left - catalogue cover */}
          <motion.div
            variants={moveRight(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative w-full md:w-[38%] lg:w-[35%] max-[639px]:max-h-[400px] max-[767px]:max-h-[450px] aspect-[587/747] 3xl:w-[587px] 3xl:h-[747px] shrink-0 rounded-[10px] overflow-hidden select-none"
          >
            <Image
              src={data.image || "/assets/images/placeholder.png"}
              alt={data.imageAlt}
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover object-center pointer-events-none"
            />

            {/* <div className="absolute inset-0 bg-black/20" /> */}

            <div className="absolute z-10 left-5 lg:left-40 3xl:left-[48px] top-60 lg:top-100 3xl:top-[117px]">
              <Image
                src="/assets/logos/header-logo.svg"
                alt="Brighton"
                width={372}
                height={50}
                className="invert brightness-0 h-6 xl:h-10 3xl:h-12.5 w-auto max-w-[372px] pointer-events-none"
              />
              <p
                className="text-[26px] font-itc-medium tracking-[-0.01em] leading-[2.5] bg-clip-text text-transparent mt-2 xl:mt-4.5"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, #FFFFFF 25.38%, #999999 60%)",
                }}
              >
                {data.catalogueText}
              </p>
            </div>
          </motion.div>

          {/* Right - form */}
          <div className="w-full flex-1 lg:mt-80">
            <SectionDescription
              text={data.subTitle}
              className="text-subtitle text-description-color max-w-[37ch] mb-80"
              direction="y"
            />

            <CatalogueRequestForm onSuccess={setCatalogue} />
          </div>
        </div>
      </div>

      <CatalogueFlipbook
        access={catalogue}
        onClose={() => setCatalogue(null)}
      />
    </section>
  );
}
