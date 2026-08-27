import { formatDate } from "@/lib/utils/formatDate";
import Image from "next/image";
import Link from "next/link";
import AnimatedDividerTwo from "../../animations/AnimatedDividerTwo";

interface NewsCardProps {
  title: string;
  date: string;
  category: string;
  image: string;
}

const NewsCard = ({ title, date, category, image }: NewsCardProps) => {
  return (
    <Link
      className="group"
      href={`/news/${title.toLowerCase().replace(" ", "-")}`}
    >
      <div className="flex flex-col relative">
        <div className="relative rounded-[10px] overflow-hidden h-[260px] xl:h-[320px] 2xl:h-[360px] 3xl:h-[420px] bg-secondary mb-30">
          <Image
            src={image || "/assets/images/placeholder.png"}
            alt={title}
            className="object-cover pointer-events-none group-hover:scale-105 transition-transform duration-500 ease-in-out"
            fill
          />
        </div>
        <div className="pb-4 flex justify-between text-description-color text-subtitle-2">
          <p>{formatDate(date)}</p>
          <p className="mr-60 uppercase">{category}</p>
        </div>
        <AnimatedDividerTwo
          className="border-secondary mb-30"
          hoverColor="#0A0A0A"
        />
        <div>
          <h3 className="text-subtitle line-clamp-2">{title}</h3>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
