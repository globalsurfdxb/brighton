"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import TooltipPreview from "./ToolTip";

export default function OptionButton({ option, isActive, onSelect }: any) {
  const [isHovered, setIsHovered] = useState(false);
  const [shiftX, setShiftX] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (!isHovered || !buttonRef.current || !tooltipRef.current) return;

    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const padding = 12;

    let offset = 0;

    if (tooltipRect.left < padding) {
      offset = padding - tooltipRect.left;
    } else if (tooltipRect.right > window.innerWidth - padding) {
      offset = window.innerWidth - padding - tooltipRect.right;
    }

    setShiftX(offset);
  }, [isHovered]);

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={() => onSelect(option.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`cursor-pointer group relative inline-flex items-center rounded-[5px] gap-2 px-3 sm:px-4 py-3 md:py-[18px] max-h-[42px] 3xl:max-h-[50px] min-[1900px]:min-h-[50px] text-description-4 leading-none transition-colors duration-400 ${
        isActive ? "bg-primary text-white" : "bg-cream-background text-primary"
      }`}
    >
      {/* Border - SVG only, single source of truth */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        preserveAspectRatio="none"
      >
        {/* static border, always visible */}
        <rect
          x="0.5"
          y="0.5"
          width="calc(100% - 1px)"
          height="calc(100% - 1px)"
          rx="4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-secondary transition-opacity duration-500 group-hover:opacity-0"
        />
        {/* hover border, draws in on top, exact same geometry */}
        <rect
          x="0.5"
          y="0.5"
          width="calc(100% - 1px)"
          height="calc(100% - 1px)"
          rx="4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          pathLength="100"
          className="text-primary [stroke-dasharray:100] [stroke-dashoffset:100] transition-[stroke-dashoffset] duration-500 ease-in-out group-hover:[stroke-dashoffset:0]"
        />
      </svg>

      {option.swatchColor && (
        <span
          className="h-5 w-5 3xl:w-[26px] 3xl:h-[26px] rounded-full flex-shrink-0"
          style={{ background: option.swatchColor }}
        />
      )}

      <span className="max-h-[13px]">{option.label}</span>

      {/* Tooltip */}
      <motion.span
        ref={tooltipRef}
        initial={false}
        animate={
          isHovered
            ? { opacity: 1, y: -2, scale: 1, x: shiftX }
            : { opacity: 0, y: 8, scale: 0.9, x: shiftX }
        }
        transition={{
          opacity: { duration: 0.2, ease: "easeOut" },
          scale: { type: "spring", stiffness: 400, damping: 15 },
          y: { type: "spring", stiffness: 400, damping: 15 },
          x: { duration: 0.2, ease: "easeOut" },
        }}
        style={{ willChange: "transform, opacity" }}
        className="pointer-events-none absolute bottom-[calc(100%+14px)] left-1/2 -translate-x-1/2 z-10 rounded-[8px]
                   flex min-w-[120px] flex-col items-center gap-2 whitespace-nowrap
                   border border-primary bg-primary px-[14px] py-3 text-[10px] tracking-[0.05em] text-white origin-bottom
                   shadow-[0_12px_28px_rgba(0,0,0,0.18)] scale-[0.8] sm:scale-100"
      >
        <TooltipPreview preview={option.tooltip.preview} />
        <span className="text-[12px] sm:text-[13px] font-itc-medium  uppercase tracking-[0.01em] mt-2">
          {option.tooltip.label}
        </span>
        {option.tooltip.meta && (
          <span className="text-center text-10 sm:text-[12px] font-itc-medium tracking-[0.01em] text-white/60">
            {option.tooltip.meta}
          </span>
        )}
        <span
          className="absolute top-full left-1/2 border-[6px] border-transparent border-t-black"
          style={{ transform: `translateX(calc(-50% - ${shiftX}px))` }}
        />
      </motion.span>
    </button>
  );
}
