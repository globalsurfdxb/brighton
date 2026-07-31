import Link from "next/link";
import Image from "next/image";

interface CustomButtonProps {
  text: string;
  link: string;
  btnClass?: string;
  txtClass?: string;
  imageClass?: string;
}

export default function CustomButton({
  text,
  link,
  btnClass = "",
  txtClass = "",
  imageClass = "",
}: CustomButtonProps) {
  return (
    <Link
      href={link}
      className={`btn-fill-center group/button flex items-center justify-center gap-4 max-h-10.5 rounded-[50px] border border-secondary px-5.5 py-3.5 text-white transition-colors duration-500 hover:text-black ${btnClass}`}
      style={{ "--fill-color": "#fff" } as React.CSSProperties}
    >
      <span
        className={`uppercase text-15 leading-none mt-1 font-itc-medium ${txtClass}`}
      >
        {text}
      </span>
      <Image
        src="/assets/icons/right-top-arrow-primary.svg"
        alt="arrow-top-right"
        width={14}
        height={14}
        className={`pointer-events-none transition-transform duration-500 group-hover/button:rotate-45 invert brightness-0 group-hover/button:invert-0 group-hover/button:brightness-100 ${imageClass}`}
      />
    </Link>
  );
}
