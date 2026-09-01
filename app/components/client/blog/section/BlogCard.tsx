import { formatDate } from "@/lib/utils/formatDate";
import Image from "next/image";
import Link from "next/link";
import AnimatedDividerTwo from "../../animations/AnimatedDividerTwo";

interface BlogCardProps {
  id: number;
  title: string;
  date: string;
  category: string;
  image: string;
  size?: "big" | "small";
  isLoneCard?: boolean;
}

const cardSizeClasses = {
  big: "lg:w-[445px] xl:w-[520px] 2xl:w-[610px] 3xl:w-[741px]",
  small: "",
};

const imageSizeClasses = {
  big: "aspect-[741/707]",
  small:
    "aspect-[436/416] lg:w-[280px] xl:w-[315px] 2xl:w-[360px] 3xl:w-[436px]",
};

const BlogCard = ({
  id,
  title,
  date,
  category,
  image,
  size = "big",
  isLoneCard = false,
}: BlogCardProps) => {
  return (
    <Link
      href={`/blog/${id}`}
      key={id}
      className={`flex w-full flex-col relative group ${
        isLoneCard ? "lg:!w-1/2" : cardSizeClasses[size]
      }`}
    >
      <div
        className={`w-full relative overflow-hidden rounded-[10px] max-sm:max-h-[280px] mb-30 ${imageSizeClasses[size]}`}
      >
        <Image
          src={image}
          alt={title}
          className="w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-500 ease-in-out"
          fill
        />
      </div>
      <div className="pb-4 flex justify-between min-[1900px]:items-center text-description-color text-subtitle-2">
        <p className="min-[1900px]:min-h-[19px]">{formatDate(date)}</p>
        <p className="mr-80 uppercase min-[1900px]:min-h-[19px]">{category}</p>
      </div>
      <AnimatedDividerTwo
        className="border-secondary mb-30"
        hoverColor="#0A0A0A"
      />
      <div>
        <h3 className="text-subtitle line-clamp-2">{title}</h3>
      </div>
    </Link>
  );
};

export default BlogCard;
