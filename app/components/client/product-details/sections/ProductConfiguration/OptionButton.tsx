"use client";

import TooltipPreview from "./ToolTip";

export default function OptionButton({ option, isActive, onSelect }: any) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.id)}
      className={`group relative inline-flex items-center rounded-[5px] border border-secondary gap-2 px-4 py-[18px] max-h-[50px] text-description-4 leading-none transition-colors duration-400 ${
        isActive ? "bg-primary text-white" : "bg-cream-background text-primary"
      }`}
    >
      {option.swatchColor && (
        <span
          className={`w-[26px] h-[26px] rounded-full flex-shrink-0`}
          style={{ background: option.swatchColor }}
        />
      )}

      <span className="max-h-[13px]">{option.label}</span>

      {/* Tooltip */}
      <span
        className="pointer-events-none absolute bottom-[calc(100%+14px)] left-1/2 -translate-x-1/2 z-10 rounded-[8px]
                   flex min-w-[140px] flex-col items-center gap-2 whitespace-nowrap
                   border border-primary bg-primary px-[14px] py-3 text-[10px] tracking-[0.05em] text-white
                   opacity-0 shadow-[0_12px_28px_rgba(0,0,0,0.18)] transition-all duration-400
                   group-hover:opacity-100 group-hover:-translate-y-[2px]"
      >
        <TooltipPreview preview={option.tooltip.preview} />
        <span className="text-[13px] font-itc-medium  uppercase tracking-[0.01em] mt-2">
          {option.tooltip.label}
        </span>
        {option.tooltip.meta && (
          <span className="text-center text-[12px] font-itc-medium tracking-[0.01em] text-white/60">
            {option.tooltip.meta}
          </span>
        )}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-black" />
      </span>
    </button>
  );
}
