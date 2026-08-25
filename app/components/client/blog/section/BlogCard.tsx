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
}: BlogCardProps) => {
  return (
    <Link
      href={`/blog/${id}`}
      key={id}
      className={`flex w-full flex-col relative group ${cardSizeClasses[size]}`}
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
      <div className="pb-4 flex justify-between text-description-color text-subtitle-2">
        <p>{formatDate(date)}</p>
        <p className="mr-80 uppercase">{category}</p>
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
