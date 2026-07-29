"use client";

interface AnimatedDividerTwoProps {
  className?: string;
  hoverColor?: string;
}

export default function AnimatedDividerTwo({
  className = "",
  hoverColor,
}: AnimatedDividerTwoProps) {
  return (
    <div className={`relative border-t ${className}`}>
      {hoverColor && (
        <div
          className="absolute left-0 top-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100"
          style={{ backgroundColor: hoverColor }}
        />
      )}
    </div>
  );
}