"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { NavDropdownItem } from "./data";

const shutterVariants = {
  hidden: { clipPath: "inset(0 0 100% 0 round 10px)", opacity: 0 },
  visible: {
    clipPath: "inset(0 0 0% 0 round 10px)",
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: [0.65, 0, 0.35, 1] as [number, number, number, number],
    },
  },
  exit: {
    clipPath: "inset(0 0 100% 0 round 10px)",
    opacity: 0.5,
    transition: {
      duration: 0.35,
      ease: [0.65, 0, 0.35, 1] as [number, number, number, number],
    },
  },
};

export const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

export const itemVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.65, 0, 0.35, 1] as [number, number, number, number],
    },
  },
};

export default function NavDropdown({ items }: { items: NavDropdownItem[] }) {
  return (
    <motion.div
      variants={shutterVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ originY: 0 }}
      className="absolute left-0 top-full w-[334px] rounded-[10px] bg-white py-[12px] overflow-hidden z-40"
    >
      <motion.ul
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className="divide-y divide-[#0A0A0A1A] px-30"
      >
        {items.map((item) => (
          <motion.li
            key={item.label}
            variants={itemVariants}
            className="group relative"
          >
            <Link
              href={item.href}
              className="flex items-center justify-between py-[17px] text-15 leading-none font-itc-medium"
            >
              <span className="group-hover:text-primary text-[#6B6B70] transition-all duration-500">{item.label}</span>
              <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full border border-[#BFBFBF] opacity-0 scale-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100">
                <Image
                  src="/assets/icons/right-arrow-nav.svg"
                  alt=""
                  width={9}
                  height={9}
                />
              </span>
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}
