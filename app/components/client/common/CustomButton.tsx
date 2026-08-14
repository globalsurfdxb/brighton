// import Link from "next/link";
// import Image from "next/image";

// interface CustomButtonProps {
//   text: string;
//   link: string;
//   btnClass?: string;
//   txtClass?: string;
//   imageClass?: string;
//   variant?: "1" | "2";
// }

// export default function CustomButton({
//   text,
//   link,
//   btnClass = "",
//   txtClass = "",
//   imageClass = "",
//   variant = "1",
// }: CustomButtonProps) {
//   return (
//     <Link
//       href={link}
//       className={`btn-fill-center group/button flex items-center justify-center gap-4 max-h-9.25 md:max-h-10.5 rounded-[50px] border border-secondary px-4.5 md:px-5.5 py-[11.5px] md:py-3.5 text-white transition-colors duration-500 hover:text-black ${btnClass}`}
//       style={{ "--fill-color": "#fff" } as React.CSSProperties}
//     >
//       <span
//         className={`uppercase text-15 leading-none mt-1 font-itc-medium ${txtClass}`}
//       >
//         {text}
//       </span>
//       <Image
//         src="/assets/icons/right-top-arrow-primary.svg"
//         alt="arrow-top-right"
//         width={14}
//         height={14}
//         className={`pointer-events-none transition-transform duration-500 group-hover/button:rotate-45 invert brightness-0 group-hover/button:invert-0 group-hover/button:brightness-100 ${imageClass}`}
//       />
//     </Link>
//   );
// }



import Link from "next/link";
import Image from "next/image";

interface CustomButtonProps {
  text: string;
  link: string;
  btnClass?: string;
  txtClass?: string;
  imageClass?: string;
  variant?: "1" | "2" | "3";
  iconDirection?: "default" | "down";
}

export default function CustomButton({
  text,
  link,
  btnClass = "",
  txtClass = "",
  imageClass = "",
  variant = "1",
  iconDirection = "default",
}: CustomButtonProps) {
  const variantStyles = {
    "1": {
      button:
        "border-secondary text-white hover:text-black",
      icon:
        "invert brightness-0 group-hover/button:invert-0 group-hover/button:brightness-100",
    },
    "2": {
      button:
        "border-primary bg-transparent text-primary hover:text-white",
      icon:
        "group-hover/button:invert-0 group-hover/button:brightness-100",
    },
    "3": {
      button:
        "border-primary bg-primary text-white hover:bg-white hover:text-primary",
      icon:
        "invert brightness-0 group-hover/button:invert-0 group-hover/button:brightness-100",
    },
  };

  const iconRotation =
    iconDirection === "down"
      ? "rotate-90"
      : "group-hover/button:rotate-45";

  return (
    <Link
      href={link}
      className={`btn-fill-center group/button flex items-center justify-center gap-4 max-h-9.25 md:max-h-10.5 rounded-[50px] border px-4.5 md:px-5.5 py-[11.5px] md:py-3.5 transition-colors duration-500 ${variantStyles[variant].button} ${btnClass}`}
      style={{ "--fill-color": "#fff" } as React.CSSProperties}
    >
      <span
        className={`mt-1 text-15 leading-none uppercase font-itc-medium ${txtClass}`}
      >
        {text}
      </span>

      <Image
        src="/assets/icons/right-top-arrow-primary.svg"
        alt="arrow-top-right"
        width={14}
        height={14}
        className={`pointer-events-none transition-transform duration-500 ${variantStyles[variant].icon} ${iconRotation} ${imageClass}`}
      />
    </Link>
  );
}