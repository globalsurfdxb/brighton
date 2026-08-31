"use client";

import { useEffect, useMemo, useRef } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  from?: number | string;
  to: number | string;
  duration?: number;
  offset?: number;
}

function parseValue(value: number | string) {
  const str = String(value);
  const match = str.match(/-?\d+(\.\d+)?/);

  if (!match || match.index === undefined) {
    return { prefix: str, number: 0, suffix: "", decimals: 0, hasNumber: false };
  }

  const numStr = match[0];
  const prefix = str.slice(0, match.index);
  const suffix = str.slice(match.index + numStr.length);
  const dot = numStr.indexOf(".");
  const decimals = dot === -1 ? 0 : numStr.length - dot - 1;

  return {
    prefix,
    number: parseFloat(numStr),
    suffix,
    decimals,
    hasNumber: true,
  };
}

export default function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  offset,
}: AnimatedCounterProps) {
  const numberRef = useRef<HTMLSpanElement>(null);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(wrapperRef, { once: true, amount: 0.5 });

  const { prefix, number: end, suffix, decimals, hasNumber } = useMemo(
    () => parseValue(to),
    [to],
  );

  const start = useMemo(() => { 
    if (offset !== undefined) {
      return end - offset;
    }
    if (typeof from === "string") {
      const match = from.match(/-?\d+(\.\d+)?/);
      return match ? parseFloat(match[0]) : 0;
    }
    return from;
  }, [from, offset, end]);

  const padLength = useMemo(() => {
    if (!hasNumber) return 0;
    return Math.trunc(Math.abs(end)).toString().length;
  }, [end, hasNumber]);

  useEffect(() => {
    if (numberRef.current && hasNumber) {
      numberRef.current.textContent = start
        .toFixed(decimals)
        .padStart(padLength + (decimals > 0 ? decimals + 1 : 0), "0");
    }
  }, [start, decimals, hasNumber, padLength]);

  useEffect(() => {
    if (!isInView || !hasNumber) return;

    const el = numberRef.current;
    if (!el) return;

    const durationMs = duration * 1000;
    const startTime = performance.now();
    let raf: number;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      el.textContent = (start + (end - start) * eased)
        .toFixed(decimals)
        .padStart(padLength + (decimals > 0 ? decimals + 1 : 0), "0");

      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isInView, start, end, duration, decimals, hasNumber]);

  if (!hasNumber) {
    return <span ref={wrapperRef}>{prefix}</span>;
  }
  return (
    <span ref={wrapperRef}>
      {prefix}
      <span ref={numberRef} />
      {suffix}
    </span>
  );
}


export  const extractNumber = (value: number | string) => {
  const match = String(value).match(/-?\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 0;
};
