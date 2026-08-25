import Image from "next/image";
import Link from "next/link";

interface NewsCardProps {
  title: string;
  date: string;
  category: string;
  image: string
}

const NewsCard = ({ title, date, category, image }: NewsCardProps) => {
  return (
    <Link href={`/news/${title.toLowerCase().replace(" ", "-")}`}>
      <div className="flex flex-col gap-30 relative">
        <div className="relative rounded-[10px] overflow-hidden h-[260px] xl:h-[320px] 2xl:h-[360px] 3xl:h-[420px] bg-secondary">
          <Image
            src={image || "/assets/images/placeholder.png"}
            alt={title}
            className="object-cover pointer-events-none"
            fill
          />
        </div>
        <div className="pb-4 flex justify-between border-b border-secondary text-description-color text-subtitle-2">
          <p>{date.split("-").reverse().join(" - ")}</p>
          <p className="mr-60">{category}</p>
        </div>
        <div>
          <h3 className="text-subtitle line-clamp-2">{title}</h3>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
