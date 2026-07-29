import { useEffect, useState } from "react";

export function useContainerInset() {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const el = document.querySelector(".container");
    if (!el) return;

    const calculate = () => {
      setInset(el.getBoundingClientRect().left + 16);
    };

    calculate();
    window.addEventListener("resize", calculate);
    return () => window.removeEventListener("resize", calculate);
  }, []);

  return inset;
}
