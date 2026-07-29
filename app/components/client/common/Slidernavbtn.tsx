"use client";

import Image from "next/image";

interface SliderNavBtnProps {
  direction: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
}

export default function SliderNavBtn({
  direction,
  onClick,
  disabled = false,
}: SliderNavBtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous slide" : "Next slide"}
      className="select-none flex items-center justify-center max-h-[42px] py-2 px-[29px] rounded-[50px] border border-secondary  disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
    >
      <Image
        src="/assets/icons/right-arrow-black.svg"
        alt={direction === "prev" ? "Previous" : "Next"}
        width={19}
        height={19}
        className={direction === "prev" ? "rotate-180" : ""}
      />
    </button>
  );
}
