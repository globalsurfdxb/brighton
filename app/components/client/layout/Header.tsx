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
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NavDropdown from "./Deskdropdown";
import MobileMenuIcon from "./MobileMenuIcon";
import MobileNav, { SearchResult } from "./MobileNav";
import { isLightHeaderRoute } from "@/lib/utils/lightHeaderRoutes";

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

export function PlusMinusIcon({ isHovered }: { isHovered: boolean }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      className="shrink-0 -mt-[5px]"
    >
      <motion.path
        d="M5.50488 0L5.50488 11"
        stroke="#0A0A0A"
        strokeWidth="2"
        animate={{ scaleY: isHovered ? 0 : 1, opacity: isHovered ? 0 : 1 }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
      />
      <path d="M11 5.505L0 5.505" stroke="#0A0A0A" strokeWidth="2" />
    </svg>
  );
}

export default function Header() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const introComplete = useIntroComplete();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const surfaceRef = useRef<HTMLDivElement>(null);
  const upScrollAccum = useRef(0);
  const headerBoxRef = useRef<HTMLDivElement>(null);
  const paddingBoxRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const [dropdownLeft, setDropdownLeft] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const isExpanded = isScrolled || isMobileMenuOpen;

  const SCROLL_THRESHOLD = 80;

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  const isLight = isLightHeaderRoute(pathname);

  const searchIndex: SearchResult[] = navItems.flatMap((item) => {
    const parent: SearchResult = { label: item.label, href: item.href };
    const children: SearchResult[] =
      item.dropdownItems?.map((sub) => ({
        label: sub.label,
        href: sub.href,
        parentLabel: item.label,
      })) ?? [];
    return [parent, ...children];
  });

  const query = searchQuery.trim().toLowerCase();
  const searchResults =
    query.length > 0
      ? searchIndex.filter((r) => r.label.toLowerCase().includes(query))
      : [];
  const isSearching = query.length > 0;

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
      upScrollAccum.current = 0;
      return;
    }

    if (diff > 0) {
      upScrollAccum.current = 0;
      setHidden(true);
    } else if (diff < 0) {
      upScrollAccum.current += Math.abs(diff);

      if (upScrollAccum.current > 50) {
        setHidden(false);
      }
    }
  });

  const cancelClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimeoutRef.current = setTimeout(() => {
      setActiveIndex(null);
    }, 150);
  };

  const openDropdown = (idx: number) => {
    cancelClose();
    const item = navItems[idx];
    const itemEl = itemRefs.current[item.label];
    const boxEl = headerBoxRef.current;
    if (!itemEl || !boxEl) return;

    const itemRect = itemEl.getBoundingClientRect();
    const boxRect = boxEl.getBoundingClientRect();

    setDropdownLeft(itemRect.left - boxRect.left);
    setActiveIndex(idx);
  };

  useEffect(() => {
    registerHeaderSurface(surfaceRef.current);
    return () => registerHeaderSurface(null);
  }, []);

  useLayoutEffect(() => {
    if (!isMobileMenuOpen) return;
    const paddingEl = paddingBoxRef.current;
    if (!paddingEl) return;

    const clone = paddingEl.cloneNode(true) as HTMLDivElement;
    clone.style.transition = "none";
    clone.style.position = "absolute";
    clone.style.visibility = "hidden";
    clone.style.pointerEvents = "none";
    clone.style.top = "-9999px";
    clone.style.left = "-9999px";

    paddingEl.parentElement?.appendChild(clone);
    const finalHeight = clone.getBoundingClientRect().height;
    clone.remove();

    setHeaderHeight(finalHeight);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isSearchOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    return () => cancelClose();
  }, []);

  return (
    <motion.header
      className={`fixed inset-x-0 z-50 transition-[top] duration-500 ease-in-out ${
        !isExpanded ? "top-30 md:top-40" : "top-0"
      }`}
      animate={{ y: isMobileMenuOpen ? 0 : hidden ? -160 : 0 }}
      transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
    >
      <div className="container">
        <div className="relative" ref={headerBoxRef}>
          {/* background surface — this is the only thing that expands */}
          <motion.div
            ref={surfaceRef}
            aria-hidden
            className={`absolute inset-y-0 left-1/2 -translate-x-1/2 origin-center transition-[width,border-radius,background-color] duration-500 ease-in-out -z-10 ${
              isExpanded
                ? "w-screen rounded-none shadow-lg"
                : "w-full rounded-[10px]"
            } ${isLight ? "bg-cream-background" : "bg-white"}`}
          />

          <div
            ref={paddingBoxRef}
            className={`transition-[padding] duration-500 ease-in-out lg:py-3 2xl:py-3.75 ${
              isExpanded ? "py-5" : "py-2.5 px-3 2xl:px-5"
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
                {navItems.map((item, idx) => {
                    const matchesHref = (href: string) =>
                      href.includes("?")
                        ? currentUrl === href
                        : pathname === href || pathname.startsWith(`${href}/`);

                    const matchesSubHref = (href: string) =>
                      href.includes("?") ? currentUrl === href : pathname === href;

                    const isActive =
                      matchesHref(item.href) ||
                      item.dropdownItems?.some((sub) => matchesSubHref(sub.href));
                    return (
                      <motion.div
                        key={item.label}
                        variants={itemVariants}
                        ref={(el) => {
                          itemRefs.current[item.label] = el;
                        }}
                        onMouseEnter={() => item.hasDropdown && openDropdown(idx)}
                        onMouseLeave={scheduleClose}
                      >
                        <Link
                          href={item.href}
                          className={`flex items-center text-15 font-itc-medium uppercase gap-[7px] text-trim group transition-all duration-500 hover:text-primary ${
                            isActive ? "text-primary" : "text-description-color"
                          }`}
                        >
                          {item.label}
                          {item.hasDropdown && (
                            <PlusMinusIcon isHovered={activeIndex === idx} />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.nav>
              </div>

              <div className="flex items-center gap-1.5 xl:gap-2.5">
                <motion.div variants={itemVariants}>
                  <Link
                    href="/contact-us"
                    className="btn-fill-center hidden xl:flex items-center justify-center gap-4 rounded-[20px] bg-primary max-h-[36px] py-[11px] px-[19px] group border border-transparent hover:border-secondary transition-all duration-500"
                  >
                    <span className="text-15 font-itc-medium uppercase text-trim text-secondary group-hover:text-primary">
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

                <motion.div
                  variants={itemVariants}
                  ref={searchRef}
                  className="relative"
                >
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

                  <AnimatePresence>
                    {isSearchOpen && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute right-0 top-full mt-20 min-w-[320px] 3xl:min-w-[350px] -z-10"
                      >
                        {/* clip mask — nothing above this line is ever visible */}
                        <div className="overflow-hidden">
                          <motion.div
                            initial={{ scaleY: 0, opacity: 0, y: -24 }}
                            animate={{ scaleY: 1, opacity: 1, y: 0 }}
                            exit={{ scaleY: 0, opacity: 0, y: -24 }}
                            transition={{
                              type: "spring",
                              stiffness: 260,
                              damping: 18,
                            }}
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

                        {/* dropdown*/}
                        <AnimatePresence>
                          {isSearching && (
                            <motion.ul
                              initial={{
                                clipPath: "inset(0 0 100% 0)",
                                opacity: 0,
                              }}
                              animate={{
                                clipPath: "inset(0 0 0% 0)",
                                opacity: 1,
                              }}
                              exit={{
                                clipPath: "inset(0 0 100% 0)",
                                opacity: 0,
                              }}
                              transition={{
                                duration: 0.4,
                                ease: [0.65, 0, 0.35, 1],
                              }}
                              style={{ originY: 0 }}
                              className="w-full mt-[2px] rounded-[10px] border border-secondary bg-white overflow-hidden max-h-64 overflow-y-auto max-w-[320px] 3xl:max-w-[350px]"
                              data-lenis-prevent
                            >
                              {searchResults.length > 0 ? (
                                searchResults.map((result, idx) => (
                                  <li key={`${result.href}-${idx}`}>
                                    <Link
                                      href={result.href}
                                      onClick={() => {
                                        setIsSearchOpen(false);
                                        setSearchQuery("");
                                      }}
                                      style={
                                        {
                                          "--fill-color": "#0A0A0A",
                                        } as React.CSSProperties
                                      }
                                      className="relative flex items-center justify-between btn-fill-center px-4 py-3 text-subtitle-2 text-trim text-description-color border-b border-secondary rounded-b-[10px] hover:text-white transition-colors duration-500"
                                    >
                                      <span>{result.label}</span>
                                    </Link>
                                  </li>
                                ))
                              ) : (
                                <li className="px-4 py-3 text-subtitle-2 text-description-color">
                                  No results found.
                                </li>
                              )}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div className="xl:hidden" variants={itemVariants}>
                  <button
                    type="button"
                    aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                    onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-secondary group cursor-pointer transition-all duration-500"
                  >
                    <MobileMenuIcon isOpen={isMobileMenuOpen} />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
          <AnimatePresence>
            {activeIndex !== null && navItems[activeIndex]?.dropdownItems && (
              <div
                style={{
                  position: "absolute",
                  left: dropdownLeft,
                  top: "100%",
                  paddingTop: 9,
                }}
                onMouseEnter={cancelClose}
                onMouseLeave={scheduleClose}
              >
                <NavDropdown
                  isLight={isLight}
                  items={navItems[activeIndex].dropdownItems!}
                />
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileNav
            headerHeight={headerHeight}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.header>
  );
}
