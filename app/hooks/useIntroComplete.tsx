"use client";

import { useEffect, useState } from "react";
import { introPromise } from "./introSignal";

declare global {
  interface Window {
    __introComplete?: boolean;
    __headerSurfaceEl?: HTMLElement | null;
  }
}

export function useIntroComplete() {
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    let cancelled = false;
    introPromise.then(() => {
      if (!cancelled) setIntroComplete(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return introComplete;
}

export function registerHeaderSurface(el: HTMLElement | null) {
  if (typeof window !== "undefined") {
    window.__headerSurfaceEl = el;
  }
}
