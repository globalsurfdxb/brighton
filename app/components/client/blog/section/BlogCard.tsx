import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface BlogCardProps {
  id: number;
  title: string;
  date: string;
  category: string;
  image: string | StaticImageData;
  size?: "big" | "small";
}

const imageSizeClasses = {
  big: "aspect-[741/707] lg:w-[445px] xl:w-[520px] 2xl:w-[610px] 3xl:w-[741px]",
  small: "aspect-[436/416] lg:w-[280px] xl:w-[315px] 2xl:w-[360px] 3xl:w-[436px]",
};

const BlogCard = ({ id, title, date, category, image, size = "big" }: BlogCardProps) => {
  return (
    <div key={id} className="flex w-full flex-col gap-3.75 lg:gap-5 3xl:gap-7.5 relative">
      <Link href={`/blog/${id}`} className="absolute inset-0 z-10"></Link>
      <div className={`w-full overflow-hidden rounded-[10px] ${imageSizeClasses[size]}`}>
        <Image src={image} alt={title} className="w-full h-full object-cover" width={741} height={707} />
      </div>
      <div className="pb-4 flex flex-wrap border-b border-secondary">
        <p className="text-gray-600">{date.split("-").reverse().join(" - ")}</p>
        <p className="text-gray-600 ml-auto">{category}</p>
      </div>
      <div>
        <h3 className="text-subtitle">{title}</h3>
      </div>
    </div>
  );
};

export default BlogCard;
