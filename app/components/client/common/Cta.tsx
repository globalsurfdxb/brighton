"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedTitle from "../animations/AnimatedTitle";
import SectionDescription from "../animations/SectionDescription";

interface CtaProps {
  data: {
    title: string;
    description: string;
    button: {
      text: string;
      href: string;
    };
  };
}

export default function Cta({ data }: CtaProps) {
  return (
    <section className="relative bg-primary py-100 3xl:min-h-[330px] overflow-hidden">
      {/* Glossy overlay */}
      <motion.div
        initial={{ clipPath: "inset(0 0 0 0)" }}
        whileInView={{ clipPath: "inset(0 0 0 100%)" }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{
          duration: 1.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.15) 35%, rgba(255,255,255,0.15) 65%, rgba(255,255,255,0.35) 100%)",
        }}
      />
      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between max-w-[92%] 3xl:max-w-[1553px] gap-5 lg:gap-0">
          <div className="flex flex-col gap-30">
            <AnimatedTitle
              tag="h2"
              text={data.title}
              className="section-title text-white"
            />
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <SectionDescription
                text={data.description}
                className="text-description text-secondary"
              />
            </motion.div>
          </div>

          <div className="lg:mb-2 w-fit">
            <Link
              href={data.button.href === "#" ? "/contact-us" : data.button.href}
            >
              <button className="btn-fill-center cursor-pointer max-h-[51px] sm:max-h-[80px] rounded-[50px] border border-secondary px-[30px] lg:px-9 xl:px-10 3xl:px-12.5 py-4.5 lg:py-6 3xl:py-[29px] transition-colors duration-500 group w-full flex justify-center items-center">
                <span className="text-subtitle !leading-none text-white max-h-[15px] sm:max-h-[21px] group-hover:text-primary">
                  {data.button.text}
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
