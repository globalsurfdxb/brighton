import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface NewsCardProps {
  id: number;
  title: string;
  date: string;
  category: string;
  image: string | StaticImageData;
}

const NewsCard = ({ id, title, date, category, image }: NewsCardProps) => {
  return (
    <div key={id} className="flex flex-col gap-7.5 relative">
      <Link href={`/news/${id}`} className="absolute inset-0 z-10"></Link>
      <div className="rounded-[10px] overflow-hidden h-[260px] xl:h-[320px] 2xl:h-[380px] 3xl:h-[420px]">
        <Image src={image} alt={title} className="w-full h-auto" width={587} height={420} />
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
}

export default NewsCard;