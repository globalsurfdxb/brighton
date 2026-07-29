interface PillBtnProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export default function PillBtn({ label, active, onClick }: PillBtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border border-secondary  px-[22px] py-[15.5] text-15 leading-none font-itc-medium transition-colors duration-500 max-h-[42px] flex items-center justify-center uppercase ${
        active
          ? "bg-primary text-white"
          : "text-description-color hover:bg-primary hover:text-white"
      }`}
    >
      <span className="max-h-[11px]">{label}</span>
    </button>
  );
}