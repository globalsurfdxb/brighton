"use client";

import { useEffect, useRef, useState, useCallback, useLayoutEffect } from "react";
import AnimatedTitle from "../../animations/AnimatedTitle";

interface ProcessSectionProps {
  data: {
    title: string;
    items: {
      id: string;
      title: string;
      description: string;
    }[];
  };
}

const ITEM_MIN_WIDTH = 280;
const AUTOPLAY_DELAY = 3500;
// Small buffer so subpixel rounding never lets an overflow slip through
// as "fits" (which used to kill autoplay on some breakpoints).
const FIT_BUFFER = 2;

const ProcessSection = ({ data }: ProcessSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  const [needsSlider, setNeedsSlider] = useState(false);
  const [itemWidth, setItemWidth] = useState(ITEM_MIN_WIDTH);
  const [translateX, setTranslateX] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [lineTop, setLineTop] = useState(0);

  const dragStartX = useRef(0);
  const dragStartTranslate = useRef(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = data.items.length;
  const maxTranslate = Math.max(0, itemWidth * total - (containerRef.current?.clientWidth || 0));

  // Decide whether items fit, or need to become a slider.
  // IMPORTANT: this must use the exact same min-width that static mode renders
  // with (ITEM_MIN_WIDTH), otherwise there's a range of container widths where
  // this check says "fits" but the actual layout overflows -> cards get clipped
  // by overflow-hidden AND autoplay never starts (since it's gated on needsSlider).
  useEffect(() => {
    const checkFit = () => {
      const containerWidth = containerRef.current?.clientWidth || 0;
      const naturalTotalWidth = ITEM_MIN_WIDTH * total;

      if (naturalTotalWidth > containerWidth - FIT_BUFFER) {
        setNeedsSlider(true);
        const fitCount = Math.max(1, Math.floor(containerWidth / ITEM_MIN_WIDTH));
        setItemWidth(Math.max(ITEM_MIN_WIDTH, containerWidth / Math.min(fitCount + 0.4, total)));
      } else {
        setNeedsSlider(false);
        setItemWidth(ITEM_MIN_WIDTH);
        setTranslateX(0);
      }
    };

    checkFit();
    const ro = new ResizeObserver(checkFit);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [total]);

  // Measure badge center so the line always aligns to it, regardless of breakpoint/font size
  useLayoutEffect(() => {
    const measure = () => {
      if (!badgeRef.current || !trackRef.current) return;
      const badgeRect = badgeRef.current.getBoundingClientRect();
      const trackRect = trackRef.current.getBoundingClientRect();
      setLineTop(badgeRect.top - trackRect.top + badgeRect.height / 2);
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (badgeRef.current) ro.observe(badgeRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [needsSlider, itemWidth]);

  const clamp = useCallback(
    (val: number) => Math.min(Math.max(val, 0), maxTranslate),
    [maxTranslate]
  );

  // Reset to a valid slide whenever the layout changes (breakpoint change,
  // items count change, etc.) so we never end up on a stale index.
  useEffect(() => {
    setCurrentIndex(0);
    setTranslateX(0);
  }, [needsSlider, itemWidth, total]);

  // Autoplay — runs whenever the slider is active (i.e. cards don't fully fit).
  //
  // IMPORTANT: we move by *index* and clamp each position to maxTranslate,
  // rather than adding a raw itemWidth offset to translateX. When there's
  // only a small remaining scroll distance left (e.g. 4 cards where the 4th
  // just barely peeks into view), maxTranslate can be smaller than a single
  // itemWidth step. Adding itemWidth directly would overshoot maxTranslate on
  // the very first tick and immediately reset to 0 — so the track never
  // visibly moved and autoplay looked "broken". Clamping to maxTranslate
  // instead eases the last card fully into view before wrapping around.
  useEffect(() => {
    if (!needsSlider || isDragging) return;

    autoplayRef.current = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => {
        const next = (prev + 1) % total;
        setTranslateX(clamp(next * itemWidth));
        return next;
      });
    }, AUTOPLAY_DELAY);

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [needsSlider, isDragging, itemWidth, maxTranslate, total, clamp]);

  // Drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!needsSlider) return;
    setIsDragging(true);
    setIsTransitioning(false);
    dragStartX.current = e.clientX;
    dragStartTranslate.current = translateX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStartX.current;
    setTranslateX(clamp(dragStartTranslate.current - delta));
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setIsTransitioning(true);
    setTranslateX((prev) => {
      const nearestIndex = Math.min(
        Math.max(Math.round(prev / itemWidth), 0),
        total - 1
      );
      setCurrentIndex(nearestIndex);
      return clamp(nearestIndex * itemWidth);
    });
  };

  return (
    <section className="py-100">
      <div className="container">
        <AnimatedTitle text={data.title} className="section-title mb-40" />

        <div ref={containerRef} className="relative bg-linear-to-br from-gray-50 to-white overflow-hidden select-none">
          <div
            ref={trackRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className={`relative flex ${needsSlider ? "cursor-grab active:cursor-grabbing" : ""} ${isTransitioning ? "transition-transform duration-700 ease-out" : ""
              }`}
            style={{
              transform: needsSlider ? `translateX(-${translateX}px)` : "none",
              width: needsSlider ? `${itemWidth * total}px` : "100%",
            }}
          >
            {/* continuous line, vertically centered on the badges */}
            <div
              className="absolute h-px bg-gray-200 pointer-events-none"
              style={{
                top: lineTop,
                left: 50,
                width: needsSlider ? itemWidth * total - 80 : undefined,
                right: needsSlider ? undefined : 50,
              }}
            />

            {data.items.map((item, index) => (
              <div key={item.id}
                className={`relative flex flex-col p-50 rounded-[10px] border border-[#bfbfbf] 
                ${needsSlider ? "flex-shrink-0" : "flex-1"}`}
                style={{ minWidth: ITEM_MIN_WIDTH, ...(needsSlider ? { width: itemWidth } : {}) }}
              >
                <h3 className="text-subtitle text-primary mb-40">
                  {item.title}
                </h3>

                <div
                  ref={index === 0 ? badgeRef : undefined}
                  className="relative z-10 flex items-center justify-center w-[70px] h-[70px] rounded-[5px] bg-primary text-secondary text-subtitle shrink-0"
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                <p className="text-gray-400 mt-90">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {needsSlider && (
          <div className="flex justify-center gap-8 mt-24">
            {data.items.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsTransitioning(true);
                  setCurrentIndex(index);
                  setTranslateX(clamp(index * itemWidth));
                }}
                className={`h-1.5 rounded-full transition-all ${currentIndex === index
                  ? "w-6 bg-black"
                  : "w-1.5 bg-gray-300"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProcessSection;