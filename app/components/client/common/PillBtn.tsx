import Image from "next/image";

interface PillBtnProps {
  label: string;
  active: boolean;
  onClick: () => void;
  arrow?: boolean;
}

export default function PillBtn({
  label,
  active,
  onClick,
  arrow,
}: PillBtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border border-secondary  px-5 py-[15.5] text-15 leading-none font-itc-medium transition-colors duration-500 max-h-[42px] flex items-center justify-center uppercase cursor-pointer group ${
        active
          ? "bg-primary text-white"
          : "text-description-color hover:bg-primary hover:text-white"
      }`}
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
