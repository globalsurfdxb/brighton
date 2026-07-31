"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    __introComplete?: boolean;
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
