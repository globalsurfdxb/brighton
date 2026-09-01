import Link from "next/link";
import Image from "next/image";

type CardProps = {
  item: {
    href: string;
    name: string;
    fileType: string;
    meta?: string;
    action?: string;
  };
  bgColor?: string;
  btnBgColor?: string;
  textColor?: string;
  iconSrc: string;
  arrowIcon: string;
  arrowSize?: string;
};

function FileTypeIcon({
  iconSrc,
  fileType,
}: {
  iconSrc: string;
  fileType: string;
}) {
  return (
    <div className="relative w-10 h-12 md:w-12 md:h-14 xl:w-[76.9px] xl:h-[89.04px] flex-shrink-0">
      <Image src={iconSrc} alt={fileType} fill className="object-contain" />
      <span className="absolute inset-0 flex items-center justify-center text-description text-trim text-white">
        {fileType}
      </span>
    </div>
  );
}

export function ResourceCard({
  item,
  bgColor = "bg-white",
  textColor = "text-foreground",
  iconSrc,
  arrowIcon,
  arrowSize = "",
  btnBgColor = "bg-transparent",
}: CardProps) {
  return (
    <div
      className={`flex justify-between border border-secondary p-3 sm:p-30 rounded-[10px] ${bgColor}`}
    >
      <div className="flex gap-5">
        <FileTypeIcon iconSrc={iconSrc} fileType={item.fileType} />

        <div className="flex flex-col gap-2.5 xl:mt-[14px]">
          <span className={`text-subtitle text-primary mr-4 ${textColor}`}>
            {item.name}
          </span>

          <div className="flex items-center flex-wrap gap-x-30 gap-y-3">
            <span className="text-description text-trim text-description-color">
              {item.meta}
            </span>
            <span className="text-description text-trim text-description-color">
              {item.action}
            </span>
          </div>
        </div>
      </div>

      <Link
        href={item.href}
        className={`flex items-center justify-center w-7 h-7 xl:w-10 xl:h-10 rounded-[5px] border border-secondary shrink-0 cursor-pointer group btn-fill-center ${btnBgColor}`}
        style={{
          "--fill-color": "var(--color-primary, #0A0A0A)",
        } as React.CSSProperties}
      >
        <Image
          src={arrowIcon}
          alt="arrow"
          width={30}
          height={30}
          className={`object-contain group-hover:invert transition-all duration-500 ${arrowSize}`}
        />
      </Link>
    </div>
  );
}
