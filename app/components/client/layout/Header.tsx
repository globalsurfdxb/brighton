"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { navItems } from "./data";
import { useIntroComplete } from "@/app/hooks/useIntroComplete";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.6, staggerChildren: 0.1 },
  },
};

const navContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.65, 0, 0.35, 1] as [number, number, number, number] },
  },
};

export default function Header() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const introComplete = useIntroComplete();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const diff = latest - previous;

    if (latest < 100) {
      setHidden(false);
      return;
    }

    if (diff > 0) {
      setHidden(true);
    } else if (diff < 0) {
      setHidden(false);
    }
  });

  return (
    <motion.header
      className="fixed inset-x-0 top-30 md:top-40 z-50"
      animate={{ y: hidden ? -160 : 0 }}
      transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
    >
      <div className="container">
        <div
  className={`relative overflow-hidden rounded-[10px] transition-shadow duration-500 ${
    introComplete ? "shadow-lg" : "shadow-none"
  }`}
>
<motion.div
  className="absolute inset-0 origin-center bg-white"
  initial={{ scaleX: 0 }}
  animate={{ scaleX: introComplete ? 1 : 0 }}
  transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
/>
          <motion.div
            className="relative flex items-center justify-between px-3 lg:px-5 py-[10px] lg:py-[15px]"
            variants={containerVariants}
            initial="hidden"
            animate={introComplete ? "visible" : "hidden"}
          >
            <div className="flex gap-60">
              <motion.div variants={itemVariants}>
                <Link href="/">
                  <Image
                    src="/assets/logos/header-logo.svg"
                    alt="logo"
                    width={180}
                    height={24}
                    className="pointer-events-none w-auto h-5 lg:h-[24px]"
                  />
                </Link>
              </motion.div>

              <motion.nav
                className="hidden lg:flex items-center gap-[37px]"
                variants={navContainerVariants}
              >
                {navItems.map((item) => (
                  <motion.div key={item.label} variants={itemVariants}>
                    <Link
                      href={item.href}
                      className="flex items-center text-15 font-itc-medium uppercase gap-[7px] leading-none group text-description-color hover:text-primary transition-all duration-500"
                    >
                      {item.label}
                      {item.hasDropdown && (
                        <Image
                          src="/assets/icons/plus.svg"
                          className="pointer-events-none pb-1 group-hover:rotate-45 transition-all duration-300"
                          alt="plus"
                          width={11}
                          height={11}
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>
            </div>

            <div className="flex items-center gap-[10px]">
              <motion.div variants={itemVariants}>
                <Link
                  href="#"
                  className="btn-fill-center hidden lg:flex items-center justify-center gap-4 rounded-[20px] bg-primary max-h-[36px] py-[11px] px-[19px] group border border-transparent hover:border-secondary transition-all duration-500"
                >
                  <span className="text-15 font-itc-medium uppercase leading-none text-secondary group-hover:text-primary max-h-[11px]">
                    Contact
                  </span>
                  <Image
                    src="/assets/icons/right-top-arrow-secondary.svg"
                    alt="contact-us"
                    width={14}
                    height={14}
                    className="pointer-events-none group-hover:rotate-45 group-hover:invert transition-all duration-500"
                  />
                </Link>
              </motion.div>

              <motion.div variants={itemVariants}>
                <button
                  type="button"
                  aria-label="Search"
                  style={{ "--fill-color": "#0A0A0A" } as React.CSSProperties}
                  className="btn-fill-center flex h-7 w-7 md:h-9 md:w-9 items-center justify-center rounded-full border border-secondary group cursor-pointer transition-all duration-500"
                >
                  <Image
                    src="/assets/icons/search.svg"
                    alt="search"
                    width={16}
                    height={16}
                    className="shrink-0 object-contain pointer-events-none w-auto h-3 md:h-4 group-hover:animate-[wiggle_1.3s_ease-in-out_infinite] group-hover:invert group-hover:brightness-0 transition-all duration-500"
                  />
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}