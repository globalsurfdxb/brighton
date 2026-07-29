"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useLenis } from "../layout/LenisProvider";

interface FilterSelectDropDownProps {
  label: string;
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
  className?: string;
}

export default function FilterSelectDropDown({
  label,
  options,
  value,
  onChange,
  className,
}: FilterSelectDropDownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const { scrollTo } = useLenis();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useLayoutEffect(() => {
    if (!open) return;

    const raf = requestAnimationFrame(() => {
      const el = listRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const padding = 24;
      const overflow = rect.bottom - window.innerHeight + padding;

      if (overflow > 0) {
        scrollTo(window.scrollY + overflow, { duration: 0.9 });
      }
    });

    return () => cancelAnimationFrame(raf);
  }, [open, scrollTo]);

  const handleSelect = (option: string | null) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div
      ref={rootRef}
      onClick={() => setOpen((prev) => !prev)}
      className={`relative w-full 2xl:min-w-[229px] cursor-pointer max-h-[42px] ${className}`}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full bg-cream-background items-center justify-between text-left border border-secondary rounded-[50px] gap-100 cursor-pointer px-5 py-[15px] text-15 leading-none font-itc-medium uppercase"
      >
        <span
          className={`max-h-[11px] ${value ? "text-primary" : "text-description-color"}`}
        >
          {value ?? label}
        </span>

        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <Image
            src="/assets/icons/down-arrow.svg"
            alt="chevron-down"
            className="w-auto sm:h-[10px] h-[9px] mr-[2px] sm:mr-0 pointer-events-none"
            width={30}
            height={30}
          />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            ref={listRef}
            role="listbox"
            data-lenis-prevent
            onClick={(e) => e.stopPropagation()}
            initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
            animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
            exit={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
            className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-y-auto overscroll-contain rounded-[10px] border border-secondary bg-white"
            style={{ originY: 0 }}
          >
            <li>
              <button
                type="button"
                onClick={() => handleSelect(null)}
                className="block w-full px-4 py-2.5 text-left text-subtitle-2 text-description-color bg-cream-background rounded-b-[10px] cursor-pointer"
              >
                {label}
              </button>
            </li>
            {options.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`block w-full px-4 py-3 text-left text-subtitle-2 hover:bg-primary hover:text-white cursor-pointer capitalize ${
                    option === value ? "text-primary" : "text-description-color"
                  }`}
                >
                  {option.toLowerCase()}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
