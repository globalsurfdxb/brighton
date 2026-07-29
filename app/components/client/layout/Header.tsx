"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { navItems } from "./data";

export default function Header() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

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
      className="fixed inset-x-0 top-40 z-50"
      animate={{ y: hidden ? -160 : 0 }}
      transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
    >
      <div className="container">
        <div className="flex items-center justify-between rounded-[10px] bg-white px-5 py-[15px] shadow-lg">
          <div className="flex gap-60">
            <Link href="/" className="">
              <Image src="/assets/logos/header-logo.svg" alt="logo" width={180} height={24} />
            </Link>
            <nav className="hidden lg:flex items-center gap-[37px]">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center text-15 font-itc-medium uppercase gap-[7px] leading-none group"
                >
                  {item.label}
                  {item.hasDropdown && (
                    <Image src="/assets/icons/plus.svg" className="pb-[5px] group-hover:rotate-45 transition-all duration-300" alt="plus" width={11} height={11} />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-[10px]">
            <Link
              href="/contact"
              className="flex items-center justify-center gap-4 rounded-[20px] bg-primary max-h-[36px] py-[11px] px-[19px]"
            >
              <span className="text-15 font-itc-medium uppercase leading-none text-secondary max-h-[11px]">Contact</span>
              <Image src="/assets/icons/right-top-arrow-secondary.svg" alt="contact-us" width={14} height={14} />
            </Link>

            <button
              type="button"
              aria-label="Search"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-secondary"
            >
              <Image src="/assets/icons/search.svg" alt="search" width={16} height={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}