import Image from "next/image";

interface PillBtnProps {
  label: string;
  active: boolean;
  onClick?: () => void;
  arrow?: boolean;
  noHoverEffect?: boolean;
  btnClassName?: string;
}

export default function PillBtn({
  label,
  active,
  onClick,
  arrow,
  noHoverEffect,
  btnClassName,
}: PillBtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={
        {
          "--fill-color": "var(--color-primary, #0A0A0A)",
        } as React.CSSProperties
      }
      className={`${noHoverEffect ? "" : "btn-fill-center cursor-pointer group"} rounded-full border border-secondary px-4.5 md:px-5 py-[15.5px] text-15 font-itc-medium leading-none transition-colors duration-500 max-h-9.25 md:max-h-10.5 flex items-center justify-center uppercase ${
        active
          ? "bg-primary text-white"
          : `text-description-color ${noHoverEffect ? "" : "hover:text-white"}`
      } ${btnClassName}`}
    >
      <span className="max-h-[11px]">{label}</span>
      {arrow && (
        <Image
          src="/assets/icons/down-arrow.svg"
          alt="chevron-down"
          className="w-auto pl-3 sm:h-[10px] h-[9px] mr-[2px] sm:mr-0 pointer-events-none group-hover:invert group-hover:brightness-0 duration-500"
          width={30}
          height={30}
        />
      )}
    </button>
  );
}
