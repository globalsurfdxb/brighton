"use client";

import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  AnimatePresence,
} from "framer-motion";
import { navItems } from "./data";
import {
  useIntroComplete,
  registerHeaderSurface,
} from "@/app/hooks/useIntroComplete";
import { useEffect, useRef, useState } from "react";

const SCROLL_THRESHOLD = 100;

const containerVariants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.1, staggerChildren: 0.1 },
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
    transition: {
      duration: 0.5,
      ease: [0.65, 0, 0.35, 1] as [number, number, number, number],
    },
  },
};

export default function Header() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const introComplete = useIntroComplete();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const surfaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerHeaderSurface(surfaceRef.current);
    return () => registerHeaderSurface(null);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const diff = latest - previous;

    setIsScrolled(latest > SCROLL_THRESHOLD);

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
      className={`fixed inset-x-0 z-50 transition-[top] duration-500 ease-in-out ${
        !isScrolled ? "top-30 md:top-40" : "top-0"
      }`}
      animate={{ y: hidden ? -160 : 0 }}
      transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
    >
      <div className="container">
        <div className="relative">
          {/* background surface — this is the only thing that expands */}
          <motion.div
            ref={surfaceRef}
            aria-hidden
            className={`absolute inset-y-0 left-1/2 -translate-x-1/2 origin-center bg-white transition-[width,border-radius] duration-500 ease-in-out -z-10 ${
              isScrolled
                ? "w-screen rounded-none shadow-lg"
                : "w-full rounded-[10px]"
            }`}
          />

          <div
            className={`transition-[padding] duration-500 ease-in-out py-5 lg:py-3 2xl:py-3.75 ${
              isScrolled ? "" : "px-3 2xl:px-5"
            }`}
          >
            <motion.div
              className="relative flex items-center justify-between"
              variants={containerVariants}
              initial="hidden"
              animate={introComplete ? "visible" : "hidden"}
            >
              <div className="flex gap-50 2xl:gap-60">
                <motion.div variants={itemVariants}>
                  <Link href="/">
                    <Image
                      src="/assets/logos/header-logo.svg"
                      alt="logo"
                      width={180}
                      height={24}
                      className="pointer-events-none w-auto h-6"
                    />
                  </Link>
                </motion.div>

                <motion.nav
                  className="hidden xl:flex items-center gap-6 2xl:gap-[37px]"
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

              <div className="flex items-center gap-1.5 xl:gap-2.5">
                <motion.div variants={itemVariants}>
                  <Link
                    href="#"
                    className="btn-fill-center hidden sm:flex items-center justify-center gap-4 rounded-[20px] bg-primary max-h-[36px] py-[11px] px-[19px] group border border-transparent hover:border-secondary transition-all duration-500"
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
                    aria-label={isSearchOpen ? "Close search" : "Search"}
                    onClick={() => setIsSearchOpen((prev) => !prev)}
                    style={{ "--fill-color": "#0A0A0A" } as React.CSSProperties}
                    className="hidden xl:flex btn-fill-center h-7 w-7 md:h-9 md:w-9 items-center justify-center rounded-full border border-secondary group cursor-pointer transition-all duration-500"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {isSearchOpen ? (
                        <motion.div
                          key="close"
                          initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
                          animate={{ opacity: 1, rotate: 0, scale: 1 }}
                          exit={{ opacity: 0, rotate: 45, scale: 0.6 }}
                          transition={{
                            duration: 0.3,
                            ease: [0.65, 0, 0.35, 1],
                          }}
                        >
                          <Image
                            src="/assets/icons/plus.svg"
                            alt="close"
                            width={16}
                            height={16}
                            className="shrink-0 object-contain pointer-events-none w-auto h-3 md:h-4 rotate-45 group-hover:invert group-hover:brightness-0 transition-all duration-500"
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="search"
                          initial={{ opacity: 0, rotate: 45, scale: 0.6 }}
                          animate={{ opacity: 1, rotate: 0, scale: 1 }}
                          exit={{ opacity: 0, rotate: -45, scale: 0.6 }}
                          transition={{
                            duration: 0.3,
                            ease: [0.65, 0, 0.35, 1],
                          }}
                        >
                          <Image
                            src="/assets/icons/search.svg"
                            alt="search"
                            width={16}
                            height={16}
                            className="shrink-0 object-contain pointer-events-none w-auto h-3 md:h-4 group-hover:animate-[wiggle_1.3s_ease-in-out_infinite] group-hover:invert group-hover:brightness-0 transition-all duration-500"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <button
                    type="button"
                    style={{ "--fill-color": "#0A0A0A" } as React.CSSProperties}
                    className="xl:hidden flex btn-fill-center h-9 w-9 items-center justify-center rounded-full border border-secondary group cursor-pointer transition-all duration-500"
                  >
                    <Image
                      src="/assets/icons/hamburger.svg"
                      alt="close"
                      width={20}
                      height={20}
                      className="shrink-0 object-contain pointer-events-none w-auto h-5 group-hover:invert group-hover:brightness-0 transition-all duration-500"
                    />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>

          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute right-0 top-full mt-2 min-w-[280px] -z-10"
              >
                {/* clip mask — nothing above this line is ever visible */}
                <div className="overflow-hidden">
                  <motion.div
                    initial={{ scaleY: 0, opacity: 0, y: -24 }}
                    animate={{ scaleY: 1, opacity: 1, y: 0 }}
                    exit={{ scaleY: 0, opacity: 0, y: -24 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    style={{ originY: 0 }}
                    className="w-full rounded-[50px] border border-secondary bg-primary"
                  >
                    <div className="px-4 py-2">
                      <input
                        type="text"
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-full outline-none text-15 leading-none font-itc-medium text-secondary placeholder:text-secondary"
                      />
                    </div>
                  </motion.div>
                </div>

                {/* dropdown stays as-is below */}
                <AnimatePresence>
                  {searchQuery.length > 0 && (
                    <motion.ul
                      initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
                      animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
                      exit={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
                      style={{ originY: 0 }}
                      className="w-full mt-[2px] rounded-[10px] border border-secondary bg-white overflow-hidden max-h-64 overflow-y-auto"
                    >
                      <li className="px-4 py-3 text-15 leading-none font-tasa text-primary hover:bg-primary hover:text-white transition-colors duration-500">
                        Result item
                      </li>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}
