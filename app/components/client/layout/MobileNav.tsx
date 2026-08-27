"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { navItems } from "./data";
import { PlusMinusIcon } from "./Header";
import AnimatedDivider from "../animations/AnimatedDivider";
import { itemVariants, listVariants } from "./Deskdropdown";
import { moveLeft, moveRight } from "../animations/motionVariants";

const ease = [0.65, 0, 0.35, 1] as [number, number, number, number];

const shutterVariants = {
  hidden: { clipPath: "inset(0 0 100% 0)", opacity: 0 },
  visible: {
    clipPath: "inset(0 0 0% 0)",
    opacity: 1,
    transition: { duration: 0.45, ease },
  },
  exit: {
    clipPath: "inset(0 0 100% 0)",
    opacity: 0,
    transition: { duration: 0.35, ease },
  },
};

export type SearchResult = { label: string; href: string; parentLabel?: string };

export default function MobileNav({
  headerHeight,
  onClose,
}: {
  headerHeight: number;
  onClose: () => void;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleToggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

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

  return (
    <motion.div
      variants={shutterVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ top: headerHeight, originY: 0 }}
      className="xl:hidden fixed inset-x-0 bottom-0 bg-white z-40 flex flex-col transition-[top] duration-500 ease-in-out"
    >
      {/* Static block — never scrolls */}
      <div className="shrink-0">
        <div className="container">
          <AnimatedDivider className="border-secondary" />
        </div>

        <div className="flex items-center gap-[11px] py-[15px] container mb-1">
          <motion.div
            variants={moveRight(0)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <Link
              href="/contact-us"
              className="btn-fill-center flex items-center justify-center gap-4 rounded-[20px] bg-primary max-h-[37px] py-[11px] px-[19px] group border border-transparent hover:border-secondary transition-all duration-500"
            >
              <span className="text-15 font-itc-medium uppercase leading-none text-white max-h-[11px] group-hover:text-primary transition-all duration-500">
                Contact
              </span>
              <Image
                src="/assets/icons/right-top-arrow-secondary.svg"
                alt="contact-us"
                width={14}
                height={14}
                className="pointer-events-none group-hover:rotate-45 invert brightness-0 group-hover:brightness-100 transition-all duration-500"
              />
            </Link>
          </motion.div>
          <motion.div
            variants={moveLeft(0)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex-1"
          >
            <div className=" flex items-center gap-3 py-[12px] max-h-[37px] rounded-full bg-[#F5F5F5] px-[14px]">
              <Image
                src="/assets/icons/search.svg"
                alt="search"
                width={16}
                height={16}
                className="shrink-0 object-contain pointer-events-none w-auto h-4"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-transparent outline-none text-15 leading-none font-itc-medium text-primary placeholder:text-primary/50"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scrollable body — only this part scrolls */}
      <div className="flex-1 overflow-y-auto">
        {isSearching ? (
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col"
          >
            {searchResults.length > 0 ? (
              searchResults.map((result) => (
                <motion.div
                  key={`${result.label}-${result.href}`}
                  variants={itemVariants}
                >
                  <div className="container py-[15px]">
                    <Link
                      href={result.href}
                      onClick={onClose}
                      className="flex items-center justify-between"
                    >
                      <span className="text-[14px] font-itc-book leading-[1.3] uppercase">
                        {result.label}
                      </span>
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="container py-4">
                <span className="text-[14px] font-itc-book leading-[1.3] text-primary">
                  No results for &ldquo;{searchQuery}&rdquo;
                </span>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col"
          >
            {navItems.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <motion.div key={item.label} variants={itemVariants}>
                  <div
                    className={`container transition-all duration-500 ${isOpen ? "bg-[#F7F7F7] py-4" : "py-4"}`}
                  >
                    {item.hasDropdown ? (
                      <button
                        type="button"
                        onClick={() => handleToggle(idx)}
                        className="w-full flex items-center justify-between"
                      >
                        <span className="text-[20px] font-itc-book leading-[1.3] uppercase">
                          {item.label}
                        </span>
                        <PlusMinusIcon isHovered={isOpen} />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="flex items-center justify-between"
                      >
                        <span className="text-[20px] font-itc-book leading-[1.3] uppercase">
                          {item.label}
                        </span>
                      </Link>
                    )}
                    {item.hasDropdown && (
                      <motion.div
                        initial={false}
                        animate={isOpen ? "open" : "collapsed"}
                        variants={{
                          open: { height: "auto", opacity: 1, marginTop: 10 },
                          collapsed: { height: 0, opacity: 0, marginTop: 0 },
                        }}
                        transition={{ duration: 0.5, ease }}
                        style={{ overflow: "hidden" }}
                      >
                        <ul className="flex flex-col gap-[15px]">
                          {item.dropdownItems?.map((sub) => (
                            <li key={sub.label}>
                              <Link
                                href={sub.href}
                                onClick={onClose}
                                className="text-description-color text-description"
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
