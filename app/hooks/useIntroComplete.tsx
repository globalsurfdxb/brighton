// "use client";

// import { useEffect, useState } from "react";

// declare global {
//   interface Window {
//     __introComplete?: boolean;
//   }
// }

// export function useIntroComplete() {
//   const [introComplete, setIntroComplete] = useState(false);

//   useEffect(() => {
//     if (window.__introComplete) {
//       setIntroComplete(true);
//       return;
//     }

//     const handleComplete = () => setIntroComplete(true);
//     window.addEventListener("introComplete", handleComplete);
//     return () => window.removeEventListener("introComplete", handleComplete);
//   }, []);

//   return introComplete;
// }



"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    __introComplete?: boolean;
    __headerSurfaceEl?: HTMLElement | null;
  }
}

export function useIntroComplete() {
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    if (window.__introComplete) {
      setIntroComplete(true);
      return;
    }

    const handleComplete = () => setIntroComplete(true);
    window.addEventListener("introComplete", handleComplete);
    return () => window.removeEventListener("introComplete", handleComplete);
  }, []);

  return introComplete;
}

export function registerHeaderSurface(el: HTMLElement | null) {
  if (typeof window !== "undefined") {
    window.__headerSurfaceEl = el;
  }
}