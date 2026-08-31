"use client";

import Link from "next/link";
import {
  footerColumns,
  footerAddress,
  footerContact,
  footerSocials,
  footerLegal,
} from "./data";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import AnimatedTitle from "../animations/AnimatedTitle";
import Reveal from "../animations/RevealItemsOneByOneAnimation";
import { moveUp, moveUpV2 } from "../animations/motionVariants";
import SectionDescription from "../animations/SectionDescription";
import { useLenis } from "./LenisProvider";

function AccordionToggleIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="flex-shrink-0"
    >
      <rect x="0" y="7" width="16" height="2" rx="1" fill="#000000" />

      <motion.rect
        x="7"
        y="0"
        width="2"
        height="16"
        rx="1"
        fill="#000000"
        style={{ transformOrigin: "50% 50%" }}
        animate={{ scaleY: isOpen ? 0 : 1 }}
        transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
      />
    </svg>
  );
}

export default function Footer() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { scrollTo } = useLenis();

  const handleToggle = (index: number) => {
    const willOpen = openIndex !== index;
    setOpenIndex(willOpen ? index : null);

    if (willOpen) {
      // wait for the expand animation (500ms) to finish before measuring
      setTimeout(() => {
        const el = containerRefs.current[index];
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // only move if it's not already fully visible
        if (rect.bottom > viewportHeight) {
          const overflow = rect.bottom - viewportHeight;
          scrollTo(window.scrollY + overflow + 20, { immediate: false });
        }
      }, 520);
    }
  };

  const getMarginBottom = (index: number) => {
    if (index === footerColumns.length - 1) return 0;
    if (openIndex === index || openIndex === index + 1) return 25;
    return 30;
  };

  return (
    <footer className="border-t border-black z-10 bg-white">
      <div className="pt-100 pb-10 sm:pb-70">
        <div className="container hidden  md:grid md:grid-cols-3 xl:grid-cols-6 gap-x-6 gap-y-5 lg:gap-y-10">
          {footerColumns.map((column) => (
            <div
              key={column.title}
              className="flex flex-col gap-6 min-[1850px]:gap-[26px]"
            >
              <AnimatedTitle
                className="text-subtitle"
                text={column.title}
                tag="h3"
              />
              <ul className="flex flex-col">
                {column.links.map((link, i) => (
                  <Reveal key={i} variants={moveUpV2} delayRange={i * 0.08}>
                    <li>
                      <Link
                        href={link.href}
                        className="text-18 leading-[1.8888888889] font-itc-medium tracking-[-0.01em] text-description-color hover:text-primary transition-colors duration-500"
                      >
                        {link.label}
                      </Link>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile/tablet accordion — md+ uses the grid above */}
        <div className="md:hidden flex flex-col">
          {footerColumns.map((column, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={column.title}
                ref={(el) => {
                  containerRefs.current[index] = el;
                }}
                style={{ marginBottom: getMarginBottom(index) }}
                className={`transition-all duration-500 container ${
                  isOpen ? "bg-cream-background py-5" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleToggle(index)}
                  className="w-full flex items-center justify-between"
                >
                  <span className="text-subtitle">{column.title}</span>
                  <AccordionToggleIcon isOpen={isOpen} />
                </button>

                <motion.div
                  initial={false}
                  animate={isOpen ? "open" : "collapsed"}
                  variants={{
                    open: { height: "auto", opacity: 1, marginTop: 15 },
                    collapsed: { height: 0, opacity: 0, marginTop: 0 },
                  }}
                  transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
                  style={{ overflow: "hidden" }}
                >
                  <ul className="flex flex-col gap-2">
                    {column.links.map((link, i) => (
                      <li key={i}>
                        <Link
                          href={link.href}
                          className="text-description text-description-color hover:text-primary transition-colors duration-500"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            );
          })}
        </div>

        <motion.div
          className="mt-10 mb-10 md:mt-100 md:mb-70 h-px w-full origin-left"
          style={{
            background:
              "linear-gradient(90deg, rgba(191, 191, 191, 0.1) 0%, rgba(191, 191, 191, 0.5) 50%, rgba(191, 191, 191, 0.1) 100%)",
          }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
        />

        <div className="container grid grid-cols-2 lg:grid-cols-6 gap-x-6 gap-y-3.75 md:gap-y-8">
          <div className="col-span-2 text-description text-description-color hover:text-primary transition-colors duration-500 w-fit max-w-[35ch]">
            <Link
              href={"https://maps.app.goo.gl/1Ze6x9FHGQF4eCPF8"}
              target="_blank"
            >
              <SectionDescription direction="y" text={footerAddress.line} />
            </Link>
          </div>

          <div className="col-span-2 lg:col-start-3 text-subtitle">
            <motion.div
              initial="hidden"
              whileInView="show"
              variants={moveUp(0.1)}
              viewport={{ once: true }}
              className="flex flex-col"
            >
              <Link
                className="w-fit hover:text-description-color transition-colors duration-500"
                href={`tel:${footerContact.phone}`}
              >
                {footerContact.phone}
              </Link>
              <Link
                className="w-fit hover:text-description-color transition-colors duration-500"
                href={`mailto:${footerContact.email}`}
              >
                {footerContact.email}
              </Link>
            </motion.div>

            <div className="flex flex-wrap gap-6 sm:gap-x-30 gap-y-2 text-description text-description-color mt-3.75 md:mt-30">
              {footerSocials.map((social, i) => (
                <Reveal key={i} variants={moveUpV2} delayRange={i * 0.1}>
                  <Link
                    key={social.label}
                    href={social.href || "#"}
                    {...(social.href !== "#" && {
                      target: "_blank",
                      rel: "noopener noreferrer",
                    })}
                    className="hover:text-black transition-colors duration-500 w-fit"
                  >
                    {social.label}
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            variants={moveUp(0.1)}
            viewport={{ once: true }}
            className="mt-3.75 md:mt-0 col-span-2 lg:col-start-5 flex flex-wrap gap-x-30 gap-y-2 text-description text-description-color"
          >
            <Link href={"#"}>
              <button className="btn-fill-center cursor-pointer max-h-[51px] md:max-h-[80px] rounded-[50px] border border-secondary px-[30px] sm:px-8 3xl:px-[39.5px] py-[15.5px] lg:py-6 3xl:py-[27px] transition-colors duration-500 group w-full flex items-center justify-center gap-2.5 sm:gap-4 bg-primary">
                <span className="text-subtitle text-28 md:text-24 3xl:text-28  !leading-none text-white max-h-[21px] group-hover:text-primary">
                  Download Catalogue
                </span>
                <Image
                  src="/assets/icons/download-primary.svg"
                  alt="Download Catalogue"
                  width={26}
                  height={26}
                  className="pointer-events-none invert brightness-0 transition-all duration-500 group-hover:invert-0 group-hover:brightness-100 w-auto h-5 3xl:h-[26px]"
                />
              </button>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="bg-[#F8F8F8] overflow-hidden">
        <div className="container flex flex-col sm:flex-row md:items-center pt-5 sm:pt-[27px] pb-5 sm:pb-[23px] text-description sm:text-subtitle-2 text-description-color">
          <div className="flex flex-col md:flex-row md:flex-wrap gap-3.75 md:gap-5 lg:gap-40 min-[1850px]:gap-[47px]">
            <span className="w-fit">{footerLegal.links[0].label}</span>
            <div className="flex gap-3.75 md:gap-5 lg:gap-40 min-[1850px]:gap-[47px]">
              {footerLegal.links.slice(1).map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="hover:text-black transition-colors w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
