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
        style={{ "--fill-color": "#0A0A0A" } as React.CSSProperties}
      className="btn-fill-center cursor-pointer group select-none flex items-center justify-center max-h-9.25 md:max-h-10.5 py-2 px-5 lg:px-[29px] rounded-[50px] border border-secondary  disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <Image
        src="/assets/icons/right-arrow-black.svg"
        alt={direction === "prev" ? "Previous" : "Next"}
        width={27}
        height={27}
        className={`pointer-events-none ${direction === "prev" ? "rotate-180" : ""} group-hover:invert group-hover:brightness-0 transition-colors duration-500 w-5 h-5 md:w-6.75 md:h-6.75`}
      />
    </button>
  );
}
