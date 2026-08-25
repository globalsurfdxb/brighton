"use client";

import { useLayoutEffect, useRef } from "react";
import { useLenis } from "../components/client/layout/LenisProvider";

export function useLoadMoreScroll(itemCount: number, offset = -80) {
  const { resize, scrollTo } = useLenis();
  const firstNewCardRef = useRef<HTMLDivElement | null>(null);
  const pendingScrollIndexRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (pendingScrollIndexRef.current === null || !firstNewCardRef.current) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      if (!firstNewCardRef.current) return;
      resize();
      scrollTo(firstNewCardRef.current, {
        offset,
        immediate: false,
        duration: 0.9,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
      });
      pendingScrollIndexRef.current = null;
    });

    return () => cancelAnimationFrame(frame);
  }, [itemCount, resize, scrollTo, offset]);

  const markPendingScroll = (index: number) => {
    pendingScrollIndexRef.current = index;
  };

  const getRefForIndex = (index: number) =>
    index === pendingScrollIndexRef.current ? firstNewCardRef : undefined;

  return { markPendingScroll, getRefForIndex };
}
