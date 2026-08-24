import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import AnimatedTitle from "../animations/AnimatedTitle";

export interface RecentContentItem {
  id: number;
  title: string;
  date: string;
  category: string;
  image: string | StaticImageData;
}

interface RecentContentProps {
  title: string;
  items: RecentContentItem[];
  hrefPrefix: "news" | "blog";
}

const RecentContent = ({ title, items, hrefPrefix }: RecentContentProps) => {
  return (
    <section className="py-100 bg-cream-background">
      <div className="container">
        <AnimatedTitle text={title} className="section-title mb-40 max-w-[60ch]" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-7.5 gap-y-5 xl:gap-y-40 2xl:gap-y-80">
          {items.map((item) => (
            <article key={item.id} className="flex flex-col gap-7.5 relative">
              <Link href={`/${hrefPrefix}/${item.id}`} className="absolute inset-0 z-10" aria-label={item.title} />
              <div className="rounded-[10px] overflow-hidden h-[260px] xl:h-[320px] 2xl:h-[380px] 3xl:h-[420px]">
                <Image src={item.image} alt={item.title} className="w-full h-auto" width={587} height={420} />
              </div>
              <div className="pb-4 flex flex-wrap border-b border-secondary">
                <p className="text-gray-600">{item.date.split("-").reverse().join(" - ")}</p>
                <p className="text-gray-600 ml-auto">{item.category}</p>
              </div>
              <div>
                <h3 className="text-subtitle">{item.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentContent;
